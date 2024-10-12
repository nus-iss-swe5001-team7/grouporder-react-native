// app/account/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from "@/components/Header"; // Assuming you already have a Header component

export default function AccountScreen() {
    const [userData, setUserData] = useState<{ userId: string, name: string, role: string, email: string} | null>(null);
    const router = useRouter(); // Use router for navigation

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
        try {
            await AsyncStorage.clear(); // Clear all stored data
            router.replace('/login'); // Navigate back to login screen
        } catch (error) {
            console.error("Error during logout:", error);
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
