import React, { useState, useEffect} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCs_ULfo0RySzk8bVEneGl5lxz00-jo74w",
  authDomain: "restaurant-finder-mim.firebaseapp.com",
  projectId: "restaurant-finder-mim",
  storageBucket: "restaurant-finder-mim.appspot.com",
  messagingSenderId: "553963630435",
  appId: "1:553963630435:web:6713bdea3d49704e5fed56",
  measurementId: "G-H9BB9400RY"
};

// initialize firebase app
// firebase.initializeApp(firebaseConfig);

function App() {
  const [restaurants, setRestaurants] = useState([]);

  const handleSearchRestaurants = async () => {
    // make api call to get restaurants
    const response = await fetch('https://api.example.com/restaurants');
    const data = await response.json();
    setRestaurants(data);
  };

  // const handleSaveFavorite = (restaurant) => {
  //   // save restaurant as favorite in Firebase database
  //   const db = firebase.firestore();
  //   db.collection('favorites').add(restaurant);
  // };


  const getRestaurants = async () => {
    const fetch = require('node-fetch');

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

  useEffect(() => {
    console.log(restaurants);
  }, [restaurants]);

  return (
    <div>
      <h1>Search for Restaurants</h1>
      <button onClick={getRestaurants}>Search</button>
      <ul>
        yoo
      </ul>
    </div>
  );
}

export default App;
