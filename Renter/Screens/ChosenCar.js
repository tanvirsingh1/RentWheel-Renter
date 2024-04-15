import React from 'react';
import {useState, useEffect} from "react"
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
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

      const confirmationCode = Math.floor(Math.random() * 900000) + 100000;

        const bookingToInsert = {
            Date: nextDate,
            Status: 'confirmed',
            listingId: carDetails.id,
            renterId: auth.currentUser.uid,
            ownerId: carDetails.ownerId,
            pricePaid: (parseFloat(carDetails.price * 1.13)).toFixed(2),
            confirmationCode: confirmationCode
        }

        try {
            const docRef = await addDoc(collection(db, "Reservation"), bookingToInsert)
            alert(`Your booking to rent the car for tommorow is confirmed.\nPick up date: ${nextDate}\nPick up time: 8am to 11am\nDrop off time: 8pm to 11pm`)
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
          <Text style={styles.text}>{carDetails.color} {carDetails.carMake} {carDetails.carModel}{carDetails.isElectric ?  <Text>, Electric</Text>  : ""}</Text>
        
          <Image source={{ uri: carDetails.imageUrl }} style={styles.image} />
          <View>

            <Text style={styles.text}>Year: {carDetails.year}</Text>
          <Text style={styles.text}>Capacity: {carDetails.capacity} L</Text>
          <Text style={styles.text}>Mileage: {carDetails.mileage} km</Text>
          <Text style={styles.text}>Engine Power: {carDetails.enginePower} HP</Text>
          
          </View>
        
        <Text style={styles.text}>Price per day: ${carDetails.price}</Text>
          <Text style={styles.text}>Tax: ${(carDetails.price * 0.13).toFixed(2)}</Text>
        <Text style={styles.text}>Total: ${(carDetails.price * 1.13).toFixed(2)}</Text>
        

      
        <Pressable onPress={() => confirmBooking(item.id)}
                             style={({ pressed }) => ({
                                backgroundColor: pressed ? "#4a3a78" : "#9978f5", // Change the background color here
                                borderRadius: 5,
                                width: "90%",
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                alignSelf:"center"
                                })}>
                                <Text style={{color:"white"}}>Confirm</Text>
                            </Pressable>

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
    backgroundColor: 'white'
  },
  location: {
    fontSize: 16,
    color: 'grey',
  },
  image: {
    height: "100%",
    width:"100%",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold'
  },
  button: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    fontWeight: 'bold',
  }

});

export default CarSummaryScreen;
