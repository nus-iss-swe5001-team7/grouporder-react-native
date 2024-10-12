// app/driver/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, Pressable, Image  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from "@/components/Header"; // Import Header component
import Ionicons from '@expo/vector-icons/Ionicons'; // Import icons for filter button

const orders = [
    {
        groupFoodOrderId: "364c547b-2191-49a1-8f7c-12e83b343564",
        deliveryTime: null,
        orderTime: "2024-10-09T17:02:49.631+00:00",
        orderStatus: "READY_FOR_DELIVERY",
        restaurantName: "Dumpling House",
        restaurantId: "5b75eb9f-fb89-45a2-94da-afbe6c21ff9c",
        location: "South",
        rating: "3.0",
        imgUrl: "https://images.pexels.com/photos/7363691/pexels-photo-7363691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        deliveryLocation: "Central"
    },
    {
        groupFoodOrderId: "f82993c9-de57-428b-a44c-161716f275f7",
        deliveryTime: null,
        orderTime: "2024-10-12T18:53:54.413+00:00",
        orderStatus: "READY_FOR_DELIVERY",
        restaurantName: "West Tempura House",
        restaurantId: "6cb8f841-6b19-43a2-9a5f-8e8b9e9e375e",
        location: "West",
        rating: "4.0",
        imgUrl: "https://images.pexels.com/photos/2098131/pexels-photo-2098131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        deliveryLocation: "West"
    },
    {
        groupFoodOrderId: "8773eac3-e5d2-48b6-adc0-eb7b7ac8b421",
        deliveryTime: null,
        orderTime: "2024-10-12T18:53:38.364+00:00",
        orderStatus: "READY_FOR_DELIVERY",
        restaurantName: "Eastern Tandoori Palace",
        restaurantId: "d3fa85bc-7ee7-4f0f-83c4-2d6b6a8f6e4b",
        location: "East",
        rating: "4.0",
        imgUrl: "https://images.pexels.com/photos/9792458/pexels-photo-9792458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        deliveryLocation: "East"
    },
    {
        groupFoodOrderId: "fc7b0338-ece5-4ebc-a7e9-95a6a509780d",
        deliveryTime: null,
        orderTime: "2024-10-12T18:53:08.077+00:00",
        orderStatus: "READY_FOR_DELIVERY",
        restaurantName: "Thai Spice",
        restaurantId: "30ed9c22-80e1-407e-8062-4dc7124425a5",
        location: "Central",
        rating: "4.0",
        imgUrl: "https://images.pexels.com/photos/12255224/pexels-photo-12255224.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        deliveryLocation: "South"
    },
    {
        groupFoodOrderId: "c1596599-3629-4184-962a-85f25bbf3ac6",
        deliveryTime: null,
        orderTime: "2024-10-12T18:52:48.275+00:00",
        orderStatus: "READY_FOR_DELIVERY",
        restaurantName: "Malay Delight",
        restaurantId: "48ef5a27-7c4e-4e67-8999-5f1a6a685aac",
        location: "North",
        rating: "4.0",
        imgUrl: "https://images.pexels.com/photos/11912788/pexels-photo-11912788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        deliveryLocation: "South"
    }
    // Add more orders as needed
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

                <Text style={styles.selectedLocationLabel}>Selected Location: {selectedLocation}</Text>


                {/* Order List */}
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.groupFoodOrderId}
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
        marginVertical: 10,
        textAlign: 'center',
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
        color: '#FF9500',
    },
    orderDeliveryLocation: {
        fontSize: 14,
        color: '#00C853',
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

