import { StyleSheet, Text, View, Pressable, FlatList, SafeAreaView,Image ,Alert} from 'react-native';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, onSnapshot, doc, getDoc, updateDoc  } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import * as Location from 'expo-location';

const ManageBookings = ({  }) => {
    const [bookings, setBookings] = useState([]);

    const toAddress = async (coords) => {
        try {
            const postalAddresses = await Location.reverseGeocodeAsync(coords, {});
            const result = postalAddresses[0];
            if (result === undefined) {
                return "No results found.";
            }
            return `${result.street}, ${result.city}\, ${result.region}, ${result.country}`;
        } catch(err) {
            console.error(err);
            return "Error fetching address.";
        }
    };

   
    const requestPermissions = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                alert("Permission granted!");
            } else {
                alert("Permission denied or not provided");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        requestPermissions();
        const fetchBookings = async () => {
            try {
                const renterBookingsQuery = query(collection(db, 'Reservation'), where('renterId', '==', auth.currentUser.uid));
                console.log("current id is", auth.currentUser.uid)
                const unsubscribe = onSnapshot(renterBookingsQuery, async (snapshot) => {
                    const bookingsData = [];
                    for (const docu of snapshot.docs) {
                       
                        const reservation = docu.data();
                       
                        const listingRef = doc(db, 'Listings', reservation.listingId)
                        const ownerRef = doc(db, 'Owners', reservation.ownerId)
                        const listingDoc = await getDoc(listingRef);
                        const ownerDoc = await getDoc(ownerRef);
    
                        if (listingDoc.exists() && ownerDoc.exists()) {
                            const listingData = { id: listingDoc.id, ...listingDoc.data() };
                            const address = await toAddress({ latitude: listingData.latitude, longitude: listingData.longitude })
                            const ownerData = { id: ownerDoc.id, ...ownerDoc.data() };
                            const booking = { id: docu.id, reservation: reservation, listing: listingData, owner: ownerData, address: address };
                            bookingsData.push(booking);
                            
                        }  
                       
                    }
                    setBookings(bookingsData);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching bookings: ", error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <SafeAreaView style={styles.body}>
            <View style={styles.container}>
                
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View >
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                             <Text style={styles.text}>Confirmation Code: {item.reservation.confirmationCode}</Text>
                            
                            </View>
                            <View style={{flexDirection:"row"}}>
                                <Image source={{ uri: item.owner.image }} style={styles.image} />
                            <View style={{marginTop: 10, marginLeft: 20}}> 
                            <Text >{item.reservation.Status}</Text>
                            <Text>Owner:  <Text style={{fontWeight:"bold"}}>{item.owner.name}</Text></Text>
                           <Text >{item.listing.color} {item.listing.carMake} {item.listing.carModel}</Text>
                            
                            <Text>Date: <Text style={{fontWeight:"bold"}}>{item.reservation.Date}</Text></Text>
                            <Text>Price with Tax: <Text style={{fontWeight:"bold"}}>${item.reservation.pricePaid}</Text></Text>
                            </View>
                             
                           </View>
                           <Text><Text style={{fontWeight:"bold", marginTop: 10}}>{item.address}</Text></Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.listItemBorder}></View>;
                      }}
                />
            </View>
        </SafeAreaView>
    );
}

export default ManageBookings;

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#000",
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center"
    },
    headingText: {
        fontSize: 24,
        paddingVertical: 8
    },
    text: {
        fontSize: 16,
        paddingVertical: 4,
        fontWeight:"bold",
    },
    image: {
        width: 100,
        height: 100, // Adjust the height as needed
        resizeMode: 'cover', // or 'contain' or 'stretch' as per your requirement
        marginVertical: 10
    },
    listItemBorder: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom:8,
        marginTop: 10
      },
});
