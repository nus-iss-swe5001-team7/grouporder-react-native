//app/driver/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import baseUrl from "@/constants/projUrl";

export default function DriverScreen() {
    const [userData, setUserData] = useState<{ [key: string]: string | undefined }>({});
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

    const handleLogout = async () => {
        try {
            const apiUrl = baseUrl + '/user-service/user/logout';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token if required
                    // Authorization: `Bearer ${userData.token}`,
                },
            });

            if (response.ok) {
                // Logout successful, clear local storage
                await AsyncStorage.clear();

                // Navigate to login page
                router.replace('/login');
            } else {
                Alert.alert('Logout Failed', 'Please try again.');
            }
        } catch (error) {
            Alert.alert('Logout Error', 'An error occurred while logging out.');
        }
    };

    const renderItem = ({ item }: { item: { key: string, value: string } }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.key}</Text>
            <Text style={styles.cell}>{item.value}</Text>
        </View>
    );

    // Convert the userData object to key-value pairs, and ensure the value is always a string
    const keyValuePairs = Object.entries(userData).map(([key, value]) => ({
        key,
        value: value || '', // Ensure the value is always a string
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Driver Dashboard</Text>

            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.header}>Key</Text>
                    <Text style={styles.header}>Value</Text>
                </View>
                <FlatList
                    data={keyValuePairs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.key}
                />
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        fontSize: 16,
        width: '50%',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        width: '50%',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FF9500',
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
