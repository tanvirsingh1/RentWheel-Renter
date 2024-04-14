import React from 'react';
import {useState, useEffect} from "react"
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, addDoc, getDocs } from "firebase/firestore"
import { db, auth } from '../firebaseConfig';

const CarSummaryScreen = ({route}) => {

    const {carDetails} = route.params
    const [nextDate, setNextDate] = React.useState(null);

    console.log(carDetails)

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
        setNextDate(tomorrow.toDateString()); 
    }, []); 

    const handleBooking = async () => {

        const bookingToInsert = {
            Date: nextDate,
            Status: 'confirmed',
            listingId: carDetails.id,
            renterId: auth.currentUser.uid,
            ownerId: carDetails.ownerId
        }

        try {
            const docRef = await addDoc(collection(db, "Reservation"), bookingToInsert)
            alert(`Your booking rent the car for tommorow is confirmed.\nPick up date: ${nextDate}\nPick up time: 8am to 11am\nDrop off time: 8pm to 11pm`)
            console.log(`Id of inserted document is: ${docRef.id}`)
        } catch (err) {
            console.log(err)
        }

    }


  return (
    <View style={styles.container}>
        <MapView style={{height:"40%", width:"100%"}}>
            <Marker coordinate={{latitude: carDetails.latitude, longitude: carDetails.longitude}}></Marker>
        </MapView>
        <Text style={styles.details}>Car Model: {carDetails.carModel}</Text>


        <Text style={styles.details}>Price: ${carDetails.price}</Text>
        <Text style={styles.details}>Tax: ${(carDetails.price * 0.13).toFixed(2)}</Text>
        <Text style={styles.details}>Total: ${(carDetails.price * 1.13).toFixed(2)}</Text>

        <Button color='dimgray' title="Confirm your Booking" onPress={() => handleBooking()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '50%',
  },
  detailsContainer: {
    height: '50%',
    padding: 10,
  },
  carName: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  carType: {
    fontSize: 18,
    color: 'grey',
  },
  location: {
    fontSize: 16,
    color: 'grey',
  },
  image: {
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  details: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20,
    fontSize: 20
  }

});

export default CarSummaryScreen;
