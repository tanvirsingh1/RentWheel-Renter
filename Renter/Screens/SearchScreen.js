import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState, useEffect} from "react"
import MapView, {Marker} from "react-native-maps"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore"

import { db, auth } from '../firebaseConfig';


const SearchScreen = ({navigation}) => {

    const [listings, setListings] = useState([])

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
        fetchData();
      }, []);

     
    const handlePress = (listing) => {
        navigation.navigate('ChosenCar', { carDetails: listing });
    }


    return(
        
        <View>
           <MapView 
           style={{height:"100%", width:"100%"}}
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
