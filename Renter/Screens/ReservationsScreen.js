import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState, useEffect} from "react"

import { db, auth } from '../firebaseConfig';


const ReservationsScreen = ({navigation}) => {


   return(
       <View style={styles.container}>  
            <Text>Reservations Screen</Text>
       </View>
   )
}
export default ReservationsScreen


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
