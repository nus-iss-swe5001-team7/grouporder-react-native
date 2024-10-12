// app/driver/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from "@/components/Header"; // Import Header component
import Ionicons from '@expo/vector-icons/Ionicons'; // Import icons for filter button

const orders = [
    { id: '1', restaurant: 'Restaurant A', status: 'READY_FOR_DELIVERY', location: 'North', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '2', restaurant: 'Restaurant B', status: 'READY_FOR_DELIVERY', location: 'South', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '3', restaurant: 'Restaurant C', status: 'READY_FOR_DELIVERY', location: 'East', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '4', restaurant: 'Restaurant D', status: 'READY_FOR_DELIVERY', location: 'West', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '5', restaurant: 'Restaurant E', status: 'READY_FOR_DELIVERY', location: 'Central', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '6', restaurant: 'Restaurant F', status: 'READY_FOR_DELIVERY', location: 'South', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '7', restaurant: 'Restaurant G', status: 'READY_FOR_DELIVERY', location: 'North', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '8', restaurant: 'Restaurant H', status: 'READY_FOR_DELIVERY', location: 'West', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    { id: '9', restaurant: 'Restaurant I', status: 'READY_FOR_DELIVERY', location: 'South', orderId: 'dvsa-12313-344323', time: '24/04/2024, 8.55PM' },
    // ... Add more orders
];

const locations = ['All Location', 'North', 'South', 'Central', 'West', 'East'];

export default function DriverScreen() {
    const [userData, setUserData] = useState<{ [key: string]: string | undefined }>({});
    const [selectedLocation, setSelectedLocation] = useState('All Location');
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const router = useRouter(); // Use router for navigation

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                setUserData(JSON.parse(data)); // Parse and set the data
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [selectedLocation]);

    const filterOrders = () => {
        if (selectedLocation === 'All Location') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => order.location === selectedLocation);
            setFilteredOrders(filtered);
        }
    };

    const handleOrderClick = (order: any) => {
        // Navigate to the order detail screen with the selected order data
        router.push({
            pathname: '/driver/orderDetail',
            params: { order: JSON.stringify(order) },
        });
    };

    const handleLocationFilter = (location: string) => {
        setSelectedLocation(location);
        setFilterModalVisible(false); // Close the modal after selection
    };

    const renderOrderItem = ({ item }: { item: { restaurant: string, status: string, location: string } }) => (
        <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderClick(item)}>
            <Text style={styles.orderRestaurant}>{item.restaurant}</Text>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
            <Text style={styles.orderLocation}>{item.location}</Text>
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

                <Text style={styles.selectedLocationLabel}>Selected Location: {selectedLocation}</Text>


                {/* Order List */}
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.orderList}
                />
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
        marginTop: 60, // Adjust for the height of the Header (Ensure content is below the header)
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
    },
    orderList: {
        paddingTop: 10, // Add some padding between the filter and the order list
    },
    orderItem: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    orderRestaurant: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderStatus: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    orderLocation: {
        fontSize: 18,
        color: '#FF9500',
        marginTop: 5,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
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
