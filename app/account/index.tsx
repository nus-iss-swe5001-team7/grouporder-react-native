// app/account/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from "@/components/Header";
import getProjUrl from '../../constants/projUrl';

export default function AccountScreen() {
    const [userData, setUserData] = useState<{ userId: string, name: string, role: string, email: string} | null>(null);
    const [projUrl, setProjUrl] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await AsyncStorage.getItem('userData');
                if (data) {
                    setUserData(JSON.parse(data));
                }
            } catch (error) {
                console.error("Failed to load user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        const projUrl = await getProjUrl();
        const apiUrl = projUrl + '/user/logout'; // Set the logout API endpoint
        try {
            // Retrieve the stored token from AsyncStorage
            const storedUserData = await AsyncStorage.getItem('userData');
            const token = storedUserData ? JSON.parse(storedUserData).token : null;

            if (!token) {
                throw new Error('No token found. Please log in again.');
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send the token with the request
                },
            });

            console.log('Response:', response);

            // Handle different HTTP response codes
            if (response.ok) {
                // Successful logout, clear local storage and redirect to login
                await AsyncStorage.clear();
                router.replace('/login'); // Navigate back to login screen
            } else if (response.status === 401 || response.status === 403) {
                // Unauthorized or Forbidden (token might be invalid or expired)
                Alert.alert('Error', 'Session expired or unauthorized. Please log in again.');
                await AsyncStorage.clear();
                router.replace('/login'); // Redirect to login
            } else if (response.status === 500) {
                // Server error
                Alert.alert('Error', 'Internal server error. Please try again later.');
            } else {
                // Handle other status codes
                Alert.alert('Error', `Unexpected error: ${response.statusText}`);
            }
        } catch (error) {
            // Handle generic errors
            if (error instanceof Error) {
                Alert.alert('Error', error.message || 'An error occurred. Please try again later.');
                console.log('error:', error.message);
            } else {
                Alert.alert('Error', 'An unknown error occurred. Please try again later.');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Navigation Bar with Back Button */}
            <Header title="My Account" showBackButton={true} onBackPress={() => router.back()} />

            <View style={styles.contentContainer}>
                {/* Display user information */}
                {userData ? (
                    <>
                        <Text style={styles.infoText}>Name: {userData.name}</Text>
                        <Text style={styles.infoText}>Email: {userData.email}</Text>
                        <Text style={styles.infoText}>Role: {userData.role}</Text>
                    </>
                ) : (
                    <Text style={styles.infoText}>Loading user data...</Text>
                )}

                {/* Logout Button */}
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        marginTop: 60, // Adjust for the height of the Header
        padding: 16,
    },
    infoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 18,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#FF9500',
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
