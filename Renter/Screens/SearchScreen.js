import { StyleSheet, Text, View, Button} from 'react-native';
import {useState, useEffect} from "react"
import MapView, {Marker} from "react-native-maps"
import { collection, getDocs } from "firebase/firestore"
import * as Location from 'expo-location';
import { db } from '../firebaseConfig';


const SearchScreen = ({navigation}) => {

    const [listings, setListings] = useState([])
    const [location, setLocation] = useState(null);

    const fetchData = async () => {
        try {           
            const querySnapshot = await getDocs(collection(db, "Listings"))
          
            const load = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    price: String(data.pricePerDay)
                };
            })
            setListings(load)

        } catch (err) {
            console.log(err)
        } 

    };

    useEffect(() => {
        requestPermissions()
        fetchData();
      }, []);

      const requestPermissions = async () => {
        try {          
           const permissionsObject = 
               await Location.requestForegroundPermissionsAsync()
           if (permissionsObject.status  === "granted") {
               alert("Permission granted!")  
               getCurrLocation()           
           } else {
               alert("Permission denied or not provided")              
           }
        } catch (err) {
           console.log(err)
        }
    }
 

      const getCurrLocation = async () => {
        console.log("Getting the user's current location!")
        try {           
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});           
 
            console.log(`The current location is:`)
            console.log(location)
 
            setLocation(location)
 
        } catch (err) {
            console.log(err)
        }
    }
 
     
     
    const handlePress = (listing) => {
        navigation.navigate('Book my Car', { carDetails: listing });
    }


    return(
        
        <View>
            {location &&(
           <MapView 
           style={{height:"100%", width:"100%"}}
           initialRegion={{
                latitude: location.coords.latitude,
                longitude:  location.coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            }}
           >

           {
               listings.map(
                   (listing, index)=>{
                       return(
                           <Marker
                                key = {index}
                               coordinate={{latitude: listing.latitude, longitude:listing.longitude}}
                               title={listing.price}
                               onPress={() => handlePress(listing)}
                           />
                       )
                   })
            }

           </MapView>
            )}
       </View>
    )
   
}
export default SearchScreen


const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',     
     padding:20,
   },  
   btn: {
       borderWidth:1,
       borderColor:"#141D21",
       borderRadius:8,
       paddingVertical:16,
       marginVertical:20
   },
   btnLabel: {
       fontSize:16,
       textAlign:"center"
   },
   headingText: {
    fontSize:24,
    paddingVertical:8
   },
   text: {
    fontSize:18,
    paddingVertical:8
   }

});
