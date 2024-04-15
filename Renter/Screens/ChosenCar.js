import React from 'react';
import {useState, useEffect} from "react"
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, addDoc, getDocs } from "firebase/firestore"
import { db, auth } from '../firebaseConfig';
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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
        <MapView style={{height:"40%", width:"100%"}}
        initialRegion={{
          latitude: carDetails.latitude,
          longitude:  carDetails.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
      }}>
            <Marker coordinate={{latitude: carDetails.latitude, longitude: carDetails.longitude}}></Marker>
        </MapView>
        
        <ScrollView style={styles.detailsContainer}>
        <Image source={{ uri: carDetails.imageUrl }} style={styles.image} />
          <Text style={styles.text}>{carDetails.carMake} - {carDetails.carModel}</Text>
          <Text style={styles.text}>Color: {carDetails.color}</Text>
          <Text style={styles.text}>Year: {carDetails.year}</Text>
          
          <Text style={styles.text}>Electric: {carDetails.isElectric ? 'Yes' : 'No'}</Text>
          

                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            paddingTop: 10,
                        }}
                    >

                        <View style={[styles.detailsBox, { backgroundColor: "#FF6868" }]}>
                            <FontAwesome5 name="tachometer-alt" size={24} color="black" />
                            <Text style={styles.text}>{carDetails.mileage}</Text>
                            <Text style={styles.fontText}>km</Text>
                        </View>
                        <View style={[styles.detailsBox, { backgroundColor: "#19A7CE" }]}>
                            <FontAwesome5 name="gas-pump" size={24} color="black" />
                            <Text style={styles.text}>{carDetails.capacity}</Text>
                            <Text style={styles.fontText}>L</Text>
                        </View>
                        <View style={[styles.detailsBox, { backgroundColor: "#F57D1F" }]}>
                            <FontAwesome5 name="bolt" size={24} color="black" />
                            <Text style={styles.text}>{carDetails.enginePower}</Text>
                            <Text style={styles.fontText}>HP</Text>
                        </View>
                  </View>
            <View style={styles.box}>
            <Text style={styles.price}>Price per day: ${carDetails.price}</Text>
            <Text style={styles.price}>Tax: ${(carDetails.price * 0.13).toFixed(2)}</Text>
            <Text style={styles.price}>Total: ${(carDetails.price * 1.13).toFixed(2)}</Text>
            </View>

        <View style={styles.button}>
        <Button 
          color='crimson' 
          title="Confirm your Booking" 
          onPress={() => handleBooking()} 
        />
        </View>

        </ScrollView>
        
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '50%',
  },
  detailsContainer: {
    height: '50%',
    padding: 20,
    backgroundColor: 'gainsboro'
  },
  box:{
    backgroundColor:'darkslategrey',
    color:'white',
    padding: 15,
    margin: 10,
    borderRadius: 10
  },
  price:{
    color:'white', 
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18
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
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  button: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  body: {
    backgroundColor: 'gainsboro',
    flex: 1,
},
container: {
    flex: 1,
    padding: 15,
},
row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
},
headingText: {
    fontSize: 24,
    paddingVertical: 8,
   
    textAlign: "center",
    marginBottom: 10,
},
fontText: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18,
   
},
input: {
    backgroundColor: "#FEFBF6",
    borderRadius: 5,
    width: "45%",
    padding: 10,
    fontSize: 12,
    marginVertical: 10,
   
},
input2: {
    backgroundColor: "#FEFBF6",
    borderRadius: 5,
    width: "85%",
    padding: 10,
    fontSize: 12,
    marginVertical: 10,
    
},
label: {
   
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
},
perDayLabel: {
    position: 'absolute',
    right: 0,
    top: 0,
   
    fontSize: 18,
},
line: {
    width: 200,
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 15,
},
detailsBox: {
    height: "90%",
    width: "30%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
},
inputInBox: {
    backgroundColor: "#FEFBF6",
    borderRadius: 5,
    padding: 10,
    fontSize: 12,
    marginVertical: 5,
   
    opacity: 0.8,
},
uploadLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
},
uploadInfo: {
    color: "white",
},
uploadedImage: {
    width: "65%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
},
addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
},
icon: {
    marginRight: 10,
},

});

export default CarSummaryScreen;
