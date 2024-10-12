// app/driver/orderDetail.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from "@/components/Header"; // Import Header component

export default function OrderDetailScreen() {
    const router = useRouter();
    const { order } = useLocalSearchParams();
    const orderData = JSON.parse(order as string);

    const [orderStatus, setOrderStatus] = useState(orderData.orderStatus);

    const handleStatusChange = () => {
        if (orderStatus === 'READY_FOR_DELIVERY') {
            setOrderStatus('ON_DELIVERY');
        } else if (orderStatus === 'ON_DELIVERY') {
            // Set status to COMPLETED and show an alert
            setOrderStatus('COMPLETED');
            Alert.alert(
                "Delivery Completed",
                "You have successfully completed the delivery.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // Navigate back to the delivery list page
                            router.replace('/driver');
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Order Detail" showBackButton={true} onBackPress={() => router.back()} />
            <View style={styles.contentContainer}>
                <View style={styles.orderDetailContainer}>
                    {/* Restaurant Image */}
                    <Image source={{ uri: orderData.imgUrl }} style={styles.restaurantImage} />
                    <Text style={styles.restaurantName}>{orderData.restaurantName}</Text>
                    <Text style={styles.orderInfo}>Order ID: {orderData.groupFoodOrderId}</Text>
                    <Text style={styles.orderInfo}>Order Time: {new Date(orderData.orderTime).toLocaleString()}</Text>
                    <Text style={styles.orderInfo}>Pickup Location: {orderData.location}</Text>
                    <Text style={styles.orderInfo}>Delivery Location: {orderData.deliveryLocation}</Text>
                    <Text style={styles.orderInfo}>Rating: {orderData.rating}</Text>
                    <Text style={styles.orderInfo}>Status: {orderStatus}</Text>
                </View>
            </View>

            {/* Order details and status update button */}
            <View style={styles.orderActionContainer}>
                <TouchableOpacity
                    style={[styles.statusButton, orderStatus === 'READY_FOR_DELIVERY' ? styles.acceptButton : styles.completeButton]}
                    onPress={handleStatusChange}
                >
                    <Text style={styles.statusButtonText}>
                        {orderStatus === 'READY_FOR_DELIVERY' ? 'Accept Delivery' : 'Complete Delivery'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    contentContainer: {
        flex: 1,
        marginTop: 60, // Adjust for the height of the Header
        paddingHorizontal: 16,
    },
    orderDetailContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 16
    },
    restaurantImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    orderInfo: {
        fontSize: 16,
        marginTop: 10
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
});
