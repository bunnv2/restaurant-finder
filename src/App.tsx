import React, { useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import {  getFirestore, collection, doc, setDoc, getDocs} from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppBar, Box, Button, Container, Menu, Theme, ThemeProvider, Toolbar, Typography, createTheme, Tab, Tabs, CircularProgress } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { ReactComponent as MySVG } from './logo.svg';
import RestaurantCard, { restaurant } from './Components/Card';
// import { makeStyles } from '@mui/material/styles';

const app = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASSUEMENT_ID,
});


const auth = getAuth(app);
const db = getFirestore(app);

function SignInWithGoogleButton() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };


function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [user] = useAuthState( auth );
  const [activeTab, setActiveTab] = useState('2');
  const [isFetching, setIsFetching] = useState(false);
  const [isSenior, setIsSenior] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#000000',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ffa726',
      },
      info: {
        main: '#29b6f6',
      },
      success: {
        main: '#66bb6a',
      },

    },
  });

  const [currentTheme, setCurrentTheme] = useState(theme);

const toggleSenior = () => {
  setIsSenior(!isSenior);

  let newTheme = createTheme({
    palette: {
      primary: {
        main: !isSenior ? '#ff9800' : '#2196f3',
      },
      secondary: {
        main: !isSenior ? '#000000' : '#000000',
      },
      error: {
        main: !isSenior ? '#ff9800' : '#f44336',
      },
      warning: {
        main: !isSenior ? '#ff9800' : '#ffa726',
      },
      info: {
        main: !isSenior ? '#ff9800' : '#29b6f6',
      },
      success: {
        main: !isSenior ? '#ff9800' : '#66bb6a',
      },
      background: {
        default: !isSenior ? '#00000' : '#fafafa',
        paper: !isSenior ?  '#424242' : '#ffffff',
      },
      text: {
        primary: !isSenior ? '#00000' : '#00000',
        secondary: !isSenior ? '#00000' : '#0000006b',
      },
    },
  });
  setCurrentTheme(newTheme);
};

  const handleTabChange = async (event: React.SyntheticEvent, newValue: string) =>  {
    if (newValue === '1' && activeTab !== '1') {
      const offset = Math.floor(Math.random() * 100);
      setIsFetching(true);
      setRestaurants([]);
      await getRestaurants(offset);
    } else if(newValue === '2') {
      await getUserRestaurants();
    }
    setActiveTab(newValue);

  };

  const addToFavorites = async (restaurant: restaurant) => {
    if (user) {
      const userFavoritesRef = collection(db, "users", user.uid, "favorites");
      const restaurantRef = doc(userFavoritesRef);

      try {
        const dbRestaurant = {
          name: restaurant.name || "",
          address: restaurant.address || "",
          phone: restaurant.phone || "",
          website: restaurant.website || "",
          rating: restaurant.rating || "",
          photo:{
            images: {
              large: {
                url: restaurant.photo.images.large.url || "",
              }
            }
          } 
        };
        await setDoc(restaurantRef, dbRestaurant);
        console.log("Added to favorites:", restaurant.name);
      } catch (error) {
        console.error("Error adding to favorites:", error);
      }
    }
  };


  const getRestaurants = async (offset: number) => {
    const url = `https://travel-advisor.p.rapidapi.com/restaurants/list?location_id=274764&currency=PLN&lunit=km&limit=30&open_now=false&lang=pl_PL&offset=${offset}`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '7ff8216833mshf766ca06c06a2e9p1dc58bjsn4d5b4eb53c58',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options)
      const restaurantsResponse = await response.json()
      let restaurants : any = []; 
      restaurantsResponse.data.map((restaurant: any) => {
        if ( restaurant.photo && restaurant.name !== "" && restaurant.address !== "" && restaurant.rating !== "" && restaurant.phone !== "" && restaurant.website !== "") {
          restaurants.push(restaurant)
        }
      })
      setRestaurants(restaurants)
      setIsFetching(false);
    } catch (error) {
      console.log(error)
    }
  }

  const getUserRestaurants = async () => {
    const userFavoritesRef = collection(db, "users", user.uid, "favorites");
    const userFavoritesSnapshot = await getDocs(userFavoritesRef);
    const userFavorites = userFavoritesSnapshot.docs.map((doc) => doc.data()) as restaurant[];
    setRestaurants(userFavorites as any);
  }



  useEffect( () => {
    async function getRestaurantsOnMount() {
      if (user) {
        await getUserRestaurants();
      } 
    }
    getRestaurantsOnMount();
  }, [user])

  return (
    (
      <ThemeProvider  theme={currentTheme}>
        {/* make container full width */}
      <div>
      <TabContext value={activeTab}>
        <AppBar position="static">
          <Toolbar variant="regular">
            {!user ? (
              <>
                <Typography variant="h6" textAlign="center" margin="auto" color="secondary" {...(isSenior && { sx: { fontSize: '1.5rem' } })}>
                  Restaurant Finder
                </Typography>
                <Button onClick={() => toggleSenior()} color="secondary" >
                  <AccessibilityIcon />
                </Button>
              </>
            ) : (
              <>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                  sx={{ flexGrow: 1 }}
                > 
                  <Tab value="1" label="NEW" {...(isSenior && { sx: { fontSize: '1.5rem' } })}/>
                  <Tab value="2" label="SAVED" {...(isSenior && { sx: { fontSize: '1.5rem' } })}/>
                </Tabs> 
                <Button onClick={() => toggleSenior()} color="secondary" >
                  <AccessibilityIcon />
                </Button>
                
                <Button onClick={() => signOut(auth)} color="secondary" > 
                  {!isSenior ? (
                    <LogoutIcon />
                  ) : (
                    <Typography variant="h6" textAlign="center" margin="auto" color="secondary" {...(isSenior && { sx: { fontSize: '1.2rem', fontWeight:'bold' } })}>
                      Sign Out
                    </Typography>
                  )}
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Container>
          {!user ? ( 
            <>
          <Typography variant="h4" component="h1" justifyContent="center" textAlign="center" marginTop={5}>
            Find the best food around you
          </Typography>
          <Box display="flex" justifyContent="center" marginTop={2} marginBottom={2}>
            <MySVG width="150px" height="150px"/>
          </Box>
          <Typography variant={!isSenior ? "body1" : "h4"}
           component="p" justifyContent="center" textAlign="center" marginTop={2} marginBottom={2}>
            Discover new places to eat, read reviews, and make reservations with ease. Sign in to start exploring now.
          </Typography>
          <Box display="flex" justifyContent="center" marginTop={10}>
            <Button
              onClick={SignInWithGoogleButton}
              variant="contained"
              color="primary"
              startIcon={
                <img
                className="google-logo"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google logo"
                width={20}
                height={20}
                />
              }
              {...(isSenior && { sx: { fontSize: '1.5rem' } })}
            >
              Sign in with Google
            </Button>
          </Box>
          </>
          ) : (
            <>
              {isFetching ? (
                <>
                <Box display="flex" justifyContent="center" marginTop={10}>
                  <CircularProgress />
                </Box>
                </>
              ) : (

              <TabPanel value='1'>
                {restaurants.map((restaurant: any) => (
                  <RestaurantCard restaurant={restaurant} theme={currentTheme} addToFavorites={addToFavorites} tabPanel='1' senior={isSenior}/>
                ))}
              </TabPanel>
              )}
              <TabPanel value='2'>
                <Typography variant="h4" component="h1" marginTop={1}>
                {restaurants.map((restaurant: any) => (
                  <RestaurantCard restaurant={restaurant} theme={currentTheme} addToFavorites={addToFavorites} tabPanel='2' senior={isSenior}/>
                ))}
                </Typography>
              </TabPanel>
            </>
          )}
        </Container>
      </TabContext>
      </div>
      </ThemeProvider>
    )
  );
}

export default App;