import React, { useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import {  getFirestore,  query,  getDocs,  collection,  where,  addDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignIn from './Components/SignIn';
import { Box, Menu, ThemeProvider } from '@mui/material';
import { createTheme, makeStyles } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container/Container';
import blue from '@mui/material/colors/blue';
import { ReactComponent as MySVG } from './logo.svg';


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

  const getRestaurants = async () => {
    const url = 'https://travel-advisor.p.rapidapi.com/restaurants/list?location_id=274764&currency=PLN&lunit=km&limit=30&open_now=false&lang=pl_PL';
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '7ff8216833mshf766ca06c06a2e9p1dc58bjsn4d5b4eb53c58',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options)
      const restaurant = await response.json()
      setRestaurants(restaurant)
    } catch (error) {
      console.log(error)
    }
  }

  const getUserRestaurants = async () => {
    const userRef = collection(db, 'users');
  }

  const theme = createTheme({
    palette: {
      primary: blue,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" style={{backgroundColor: '#f6f6'}}>
      {/* menu */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MySVG
          style={{
            width: '100px',
            height: '100px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
          
        />
        <h1>Restaurants Finder</h1>
        <h4>Find the best restaurants in your city</h4>
      
      </Box>

      <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
        {user ? (
          <div>
            <Button onClick={getUserRestaurants}>Your restaurants</Button>
            <Button onClick={()=>signOut(auth)}>Sign Out</Button>
            <Button onClick={getRestaurants}>Get Restaurants</Button>
          </div>
        ) : (
          <SignIn signInWithGoogle={SignInWithGoogleButton} />
        )}
      </Box>
    </Container>
    </ThemeProvider>
  );
}

export default App;