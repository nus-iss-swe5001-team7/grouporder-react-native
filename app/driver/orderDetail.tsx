// app/driver/orderDetail.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, ActivityIndicator, Linking  } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "@/components/Header"; // Import Header component
import { projUrl } from '../../constants/projUrl'; // Assuming projUrl is the base API URL

export default function OrderDetailScreen() {
    const router = useRouter();
    const { order } = useLocalSearchParams();
    const orderData = JSON.parse(order as string);
    // const deliveryAddress = JSON.parse("{\"address\": \"National University of Singapore\",\"latitude\": 1.2936935424804688,\"longitude\": 103.77532958984375}");
    // const restaurantAddress= JSON.parse("{\"address\": \"Fairprice Hub Joo Koon\",\"latitude\": 1.3249278764785808,\"longitude\": 103.67851212473738}");
    const [orderStatus, setOrderStatus] = useState(orderData.orderStatus);
    const [loading, setLoading] = useState(false); // State to manage loading indicator


    const updateOrderStatus = async (url: string) => {
        setLoading(true); // Show loading indicator when the API call starts
        try {
            // Get JWT token from AsyncStorage
            const storedUserData = await AsyncStorage.getItem('userData');
            const token = storedUserData ? JSON.parse(storedUserData).token : null;

            if (!token) {
                throw new Error('No token found. Please log in again.');
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Pass the JWT token in the Authorization header
                },
            });

            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired, prompt user to log in again
                Alert.alert(
                    'Session Expired',
                    'Your session has expired or is invalid. Please log in again.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await AsyncStorage.removeItem('userData'); // Remove the stored user data
                                router.replace('/login'); // Navigate to login screen
                            },
                        },
                    ],
                    { cancelable: false }
                );
                return false;
            }


            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            return true;
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', `Failed to update status: ${error.message}`);
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
            return false;
        } finally {
            setLoading(false); // Hide loading indicator after the API call is complete
        }
    };

    const handleStatusChange = async () => {
        let apiUrl = '';
        if (orderStatus === 'READY_FOR_DELIVERY') {
            apiUrl = `${projUrl}/deliveryAPI/onDelivered/${orderData.groupFoodOrderId}`;
            const success = await updateOrderStatus(apiUrl);
            if (success) {
                setOrderStatus('ON_DELIVERY');
            }
        } else if (orderStatus === 'ON_DELIVERY') {
            apiUrl = `${projUrl}/deliveryAPI/delivered/${orderData.groupFoodOrderId}`;
            const success = await updateOrderStatus(apiUrl);
            if (success) {
                setOrderStatus('DELIVERED');
                Alert.alert(
                    'Delivery Completed',
                    'You have successfully completed the delivery.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Navigate back to the delivery list page
                                router.replace('/driver');
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const openInGoogleMaps = (latitude: any, longitude: any, address: any) => {
        // Construct the Google Maps URL for navigation from the current location to the destination
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

        Linking.openURL(url).catch(err => {
            console.error("Failed to open Google Maps", err);
            Alert.alert("Error", "Unable to open Google Maps");
        });
    };




    return (
        <SafeAreaView style={styles.container}>
            <Header title="Order Detail" showBackButton={true} onBackPress={() => router.back()} />
            <View style={styles.contentContainer}>
                <View style={styles.orderDetailContainer}>
                    {/* Restaurant Image */}
                    <Image source={{ uri: orderData.imgUrl }} style={styles.restaurantImage} />
                    <Text style={styles.restaurantName}>{orderData.restaurantName}</Text>

                    {/* Section 1: Order Details */}
                    <View style={styles.section}>
                        <Text style={styles.orderInfo}>Order ID: {orderData.groupFoodOrderId}</Text>
                        <Text style={styles.orderInfo}>Order Time: {new Date(orderData.orderTime).toLocaleString()}</Text>
                        <Text style={styles.orderInfo}>Status: <Text style={styles.boldText}>{orderStatus}</Text></Text>
                    </View>

                    {/* Section 2: Pickup Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pickup Details</Text>
                        <View style={styles.inlineContainer}>
                            <Text style={styles.orderInfo}>Pickup Location: {orderData.location} </Text>
                            <TouchableOpacity onPress={() => openInGoogleMaps(orderData.restaurantLatitude, orderData.restaurantLongitude, orderData.restaurantAddress)}>
                                <Text style={styles.emojiButton}>➡️🌎</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.orderInfo}>Pickup Address: {orderData.restaurantAddress}</Text>
                    </View>

                    {/* Section 3: Delivery Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Details</Text>
                        <View style={styles.inlineContainer}>
                            <Text style={styles.orderInfo}>Delivery Location: {orderData.deliveryLocation}</Text>
                            <TouchableOpacity onPress={() => openInGoogleMaps(orderData.deliveryLatitude, orderData.deliveryLongitude, orderData.deliveryAddress)}>
                                <Text style={styles.emojiButton}>➡️🌎</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.orderInfo}>Delivery Address: {orderData.deliveryAddress}</Text>
                    </View>
                </View>
            </View>


            {/* Order details and status update button */}
            <View style={styles.orderActionContainer}>
                {loading ? ( // Show loading spinner when waiting for the API response
                    <ActivityIndicator size="large" color="#FF9500" />
                ) : (
                <TouchableOpacity
                    style={[styles.statusButton, orderStatus === 'READY_FOR_DELIVERY' ? styles.acceptButton : styles.completeButton]}
                    onPress={handleStatusChange}
                >
                    <Text style={styles.statusButtonText}>
                        {orderStatus === 'READY_FOR_DELIVERY' ? 'Accept Delivery' : 'Complete Delivery'}
                    </Text>
                </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: '#fff'
    },
    orderActionContainer: {
        padding: 16,
        alignItems: 'center'
    },
    statusButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%'
    },
    acceptButton: {
        backgroundColor: '#FF3B30'
    },
    completeButton: {
        backgroundColor: '#4CD964'
    },
    statusButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    contentContainer: {
        padding: 20,
        marginTop: 50,
    },
    orderDetailContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    restaurantImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    orderInfo: {
        fontSize: 16,
        marginVertical: 2,
    },
    boldText: {
        fontWeight: 'bold',
    },
    inlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emojiButton: {
        fontSize: 18,
        marginLeft: 5,
    },



});
