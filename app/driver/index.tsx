// app/driver/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, Pressable, Image, ActivityIndicator, Alert   } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from "@/components/Header";
import Ionicons from '@expo/vector-icons/Ionicons';
import { projEnv, projUrl } from '../../constants/projUrl';

const locations = ['North', 'South', 'Central', 'West', 'East'];

export default function DriverScreen() {
    const [userData, setUserData] = useState<{ [key: string]: string | undefined }>({});
    const [selectedLocation, setSelectedLocation] = useState('North');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const router = useRouter(); // Use router for navigation

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                setUserData(JSON.parse(data)); // Parse and set the data
                const userId = JSON.parse(data).userId;
                fetchOrders(userId, selectedLocation);
            }
        };
        fetchData();
    }, []);

    const fetchOrders = async (userId: string, location: string): Promise<boolean> => {
        setLoading(true);
        try {
            // Retrieve JWT token from AsyncStorage
            const storedUserData = await AsyncStorage.getItem('userData');
            const token = storedUserData ? JSON.parse(storedUserData).token : null;

            if (!token) {
                throw new Error('No token found. Please log in again.');
            }

            const apiUrl = `${projUrl}/getOrdersForDeliveryStaff?userId=${userId}&location=${location}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include the JWT token in the Authorization header
                },
            });

            if (response.status === 401 || response.status === 403) {
                // Token is invalid, expired, or unauthorized
                Alert.alert(
                    'Session Expired',
                    'Your session has expired or is invalid. Please log in again.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await AsyncStorage.removeItem('userData'); // Clear the invalid token
                                router.replace('/login'); // Redirect to the login page
                            }
                        }
                    ],
                    { cancelable: false }
                );
                return false;
            }

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            setFilteredOrders(data);

            if (data.length > 0) {
                // Show a prompt with the number of available orders
                Alert.alert('Orders Available', `${data.length} orders available for ${location} region.`);
            } else {
                // No orders available, show a prompt
                Alert.alert('No Orders', `No orders available for ${location} region.`);
            }

            return true; // Success
        } catch (error) {
            // Cast the error to an Error type and handle it accordingly
            if (error instanceof Error) {
                Alert.alert('Error', `Failed to fetch orders: ${error.message}`);
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
            return false; // Failure
        } finally {
            setLoading(false);
        }
    };


    const handleOrderClick = (order: any) => {
        // Navigate to the order detail screen with the selected order data
        router.push({
            pathname: '/driver/orderDetail',
            params: { order: JSON.stringify(order) },
        });
    };

    // Handle location filter and fetch orders for the selected location
    const handleLocationFilter = async (location: string) => {
        setFilterModalVisible(false); // Close the modal after selection
        const previousLocation = selectedLocation; // Store previous location
        const userId = userData.userId; // Get user ID from userData state
        if (userId) {
            const success = await fetchOrders(userId, location); // Fetch orders for the selected location
            if (success) {
                setSelectedLocation(location); // Update location only on success
            } else {
                // Fetch failed, keep previous location
                // Optionally inform the user that the location hasn't changed
                Alert.alert(
                    'Error',
                    `Failed to fetch orders for ${location}. Keeping previous location: ${previousLocation}.`
                );
            }
        }
    };


    const renderOrderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderClick(item)}>
            <View style={styles.orderImageContainer}>
                <Image source={{ uri: item.imgUrl }} style={styles.orderImage} />
            </View>
            <View style={styles.orderDetailsContainer}>
                <Text style={styles.orderRestaurant}>{item.restaurantName}</Text>
                <Text style={styles.orderStatus}>Status: {item.orderStatus}</Text>
                <Text style={styles.orderLocation}>Pickup: {item.location}</Text>
                <Text style={styles.orderDeliveryLocation}>Delivery: {item.deliveryLocation}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            {/* Navigation Bar with Account Icon */}
            <Header title="Delivery Staff" showAccountIcon={true} onAccountPress={() => router.push('/account')} />

            {/* Add a margin to ensure the content is below the header */}
            <View style={styles.contentContainer}>
                {/* Filter Section */}
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>Filter Order By Location</Text>
                    <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                        <Ionicons name="filter" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.selectedLocationLabel}>
                    Selected Location : <Text style={styles.selectedLocationBold}>{selectedLocation}</Text>
                </Text>

                {/* Show loading indicator while fetching data */}
                {loading ? (
                    <ActivityIndicator size="large" color="#FF9500" />
                ) : (
                    <FlatList
                        data={filteredOrders}
                        renderItem={renderOrderItem}
                        keyExtractor={(item) => item.groupFoodOrderId}
                        contentContainerStyle={styles.orderList}
                    />
                )}
            </View>

            {/* Modal for Location Filter */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Location</Text>
                        {locations.map(location => (
                            <Pressable
                                key={location}
                                style={[
                                    styles.locationButton,
                                    selectedLocation === location && styles.locationButtonSelected,
                                ]}
                                onPress={() => handleLocationFilter(location)}
                            >
                                <Text style={styles.locationButtonText}>{location}</Text>
                            </Pressable>
                        ))}
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        marginTop: 60,
        paddingHorizontal: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f6f6f6',
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedLocationLabel: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
    selectedLocationBold: {
        fontWeight: 'bold',
    },
    orderList: {
        paddingTop: 10,
    },
    orderItem: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    orderImageContainer: {
        flex: 1,
        marginRight: 10,
    },
    orderImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    orderDetailsContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    orderRestaurant: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderStatus: {
        fontSize: 14,
        color: 'gray',
    },
    orderLocation: {
        fontSize: 14,
        color: '#FF3B30',
    },
    orderDeliveryLocation: {
        fontSize: 14,
        color: '#4CD964',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    locationButton: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    locationButtonSelected: {
        backgroundColor: '#FF9500',
    },
    locationButtonText: {
        fontSize: 16,
    },
    closeModalButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF9500',
        borderRadius: 10,
    },
    closeModalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

