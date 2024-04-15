import { StyleSheet, Text, View, Button} from 'react-native';

import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';

import 'react-native-gesture-handler';

import LoginScreen from './Screens/Login';
import ReservationsScreen from './Screens/ReservationsScreen';
import SearchScreen from './Screens/SearchScreen';
import ChosenCar from './Screens/ChosenCar'

import { auth } from './firebaseConfig';
import { signOut } from "firebase/auth";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const logoutPressed = async (navigation) => {
  // TODO: Code to logout
  console.log("Logging the user out..")
  try {
      if (auth.currentUser === null) {
          console.log("logoutPressed: There is no user to logout!")
      } 
      else {
          await signOut(auth)
          console.log("logoutPressed: Logout complete")
          alert("logout complete!")
          navigation.navigate("Login")
      }
  } catch(error) {
      console.log("ERROR when logging out")
      console.log(error)
  }            
}

const TabContainerComponent = () => {
  
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name == "My Reservations") {
            return (
              <Fontisto name="history" size={24} color="black" />
            );
        }
        if (route.name === "Search") {
            return (
              <FontAwesome name="search" size={24} color="black" />
            );
        }
      },
      tabBarActiveTintColor: "#7C4DFF",
    tabBarInactiveTintColor: "gray",
})}>
      <Tab.Screen name="My Reservations" component={ReservationsScreen} />
      <Tab.Screen name="Search" component={SearchScreen}  />
   </Tab.Navigator>
  )
}

export default function App() {
 
  return ( 
      < NavigationContainer>
         <Stack.Navigator>    
        <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Rent a Wheel" component={TabContainerComponent} options={({ navigation }) => ({
              headerRight: () => (
             
                  <Button title="Logout" onPress={() => logoutPressed(navigation)} color="red"/>
                
              ),
              headerLeft: null, // If you want to remove the back button, set this to null
            })}/>
          <Stack.Screen name="Book a Car" component={ChosenCar} screenOptions={{headerShown:false}}/>
         
        </Stack.Navigator>
         
      </NavigationContainer>
  )
}
const styles = StyleSheet.create({
  
 
});
 
 