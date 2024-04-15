import { StyleSheet, Text, View, Pressable, FlatList, SafeAreaView,Image } from 'react-native';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, onSnapshot, doc, getDoc, updateDoc  } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const Reservations = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const renterBookingsQuery = query(collection(db, 'Reservation'), where('renterId', '==', auth.currentUser.uid));
                const unsubscribe = onSnapshot(renterBookingsQuery, async (snapshot) => {
                    const bookingsData = [];
                    for (const docu of snapshot.docs) {
                       
                        const reservation = docu.data();
                        const listingRef = doc(db, 'Listings', reservation.listingId)
                        const RenterRef = doc(db, 'Owners', reservation.ownerId)
                        const listingDoc = await getDoc(listingRef);
                        const renterDoc = await getDoc(RenterRef);
    
                        if (listingDoc.exists() && renterDoc.exists()) {
                            const listingData = { id: listingDoc.id, ...listingDoc.data() };
                            const renterData = { id: renterDoc.id, ...renterDoc.data() };
                            const booking = { id: docu.id, reservation: reservation, listing: listingData, renter: renterData };
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
                            <View style={{flexDirection:"row", gap:10}}>
                                <Image source={{ uri: item.listing.imageUrl }} style={styles.image} />
                            <View> 
                            <Text>Owner:  <Text style={{fontWeight:"bold"}}>{item.renter.name}</Text></Text>
                           <Text >{item.listing.color} {item.listing.carMake} {item.listing.carModel}</Text>
                            
                            <Text style={styles.info}>Date: <Text style={{fontWeight:"bold"}}>{item.reservation.Date}</Text></Text>
                            <Text style={styles.info}>Price with Tax: <Text style={{fontWeight:"bold"}}>${item.reservation.pricePaid}</Text></Text>
                            <Text style={styles.info}>{item.reservation.Status}</Text>
                            </View>
                            
                           </View>
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

export default Reservations;

const styles = StyleSheet.create({
    body: {
   
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
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
        paddingVertical: 5,
        fontWeight:"bold",
    },
    image: {
        width: 100,
        height: 100, // Adjust the height as needed
        resizeMode: 'cover', // or 'contain' or 'stretch' as per your requirement
    },
    listItemBorder: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginVertical:4,
      },
    info: {
        paddingLeft: 30
    }
});
