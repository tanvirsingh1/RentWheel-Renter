import React from 'react';
import {useState, useEffect} from "react"
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, addDoc, getDocs } from "firebase/firestore"
import { db, auth } from '../firebaseConfig';

const CarSummaryScreen = ({route}) => {

    const {carDetails} = route.params
    const [nextDate, setNextDate] = React.useState(null);

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
        
        <ScrollView style={styles.detailsContainer}>
          <Text style={styles.text}>Make: {carDetails.carMake}</Text>
          <Text style={styles.text}>Model: {carDetails.carModel}</Text>
          <Text style={styles.text}>Color: {carDetails.color}</Text>
          <Text style={styles.text}>Year: {carDetails.year}</Text>
          <Text style={styles.text}>Capacity: {carDetails.capacity}</Text>
          <Text style={styles.text}>Mileage: {carDetails.mileage}</Text>
          <Text style={styles.text}>Engine Power: {carDetails.enginePower}</Text>
          <Text style={styles.text}>Electric: {carDetails.isElectric ? 'Yes' : 'No'}</Text>
          <Text style={styles.text}>Price per day: ${carDetails.price}</Text>
          <Text style={styles.text}>Tax: ${(carDetails.price * 0.13).toFixed(2)}</Text>
        <Text style={styles.text}>Total: ${(carDetails.price * 1.13).toFixed(2)}</Text>
        
        <Image source={{ uri: carDetails.imageUrl }} style={styles.image} />

        <View style={styles.button}>
        <Button 
          color='dimgray' 
          title="Confirm your Booking" 
          onPress={() => handleBooking()} 
        />
        </View>

        </ScrollView>
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
    padding: 20,
    backgroundColor: 'black'
  },
  location: {
    fontSize: 16,
    color: 'grey',
  },
  image: {
    height: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: 'lightgrey',
    fontWeight: 'bold'
  },
  button: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    fontWeight: 'bold',
  }

});

export default CarSummaryScreen;
