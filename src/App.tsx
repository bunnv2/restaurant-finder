import React, { useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import {  getFirestore, collection, doc, setDoc, getDocs} from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AppBar, Box, Button, Container, Menu, Theme, ThemeProvider, Toolbar, Typography, createTheme, Tab, Tabs, CircularProgress } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import LogoutIcon from '@mui/icons-material/Logout';
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
    signInWithPopup(auth, provider);
  };


function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [user] = useAuthState( auth );
  const [activeTab, setActiveTab] = useState('2');
  const [isFetching, setIsFetching] = useState(false);




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

  return (
    (
      <ThemeProvider  theme={theme}>
      <TabContext value={activeTab}>
        <AppBar position="static">
          <Toolbar variant="regular">
            {!user ? (
              <>
                <Typography variant="h6" textAlign="center" margin="auto" color="secondary">
                  Restaurant Finder
                </Typography>
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
                  <Tab value="1" label="NEW" />
                  <Tab value="2" label="SAVED" />
                </Tabs> 
                <Button onClick={() => signOut(auth)} color="secondary" > 
                  <LogoutIcon />
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
          <Typography variant="body1" component="p" justifyContent="center" textAlign="center" marginTop={2} marginBottom={2}>
            Discover new places to eat, read reviews, and make reservations with ease. Sign in to start exploring now.
          </Typography>
          <Box display="flex" justifyContent="center" marginTop={10}>
            {/* make space */}
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
                  <RestaurantCard restaurant={restaurant} theme={theme} addToFavorites={addToFavorites} tabPanel='1' />
                ))}
              </TabPanel>
              )}
              <TabPanel value='2'>
                <Typography variant="h4" component="h1" marginTop={1}>
                {restaurants.map((restaurant: any) => (
                  <RestaurantCard restaurant={restaurant} theme={theme} addToFavorites={addToFavorites} tabPanel='2' />
                ))}
                </Typography>
              </TabPanel>
            </>
          )}
        </Container>
      </TabContext>
      </ThemeProvider>
    )
  );
}

export default App;