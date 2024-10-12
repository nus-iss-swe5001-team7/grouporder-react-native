// app/driver/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import baseUrl from "@/constants/projUrl";
import Header from "@/components/Header"; // Import Header component

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


    const renderItem = ({ item }: { item: { key: string, value: string } }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.key}</Text>
            <Text style={styles.cell}>{item.value}</Text>
        </View>
    );

    const keyValuePairs = Object.entries(userData).map(([key, value]) => ({
        key,
        value: value || '',
    }));

    return (
        <SafeAreaView style={styles.container}>
            {/* Navigation Bar with Account Icon */}
            <Header title="Driver" showAccountIcon={true} onAccountPress={() => router.push('/account')} />

            {/* Rest of the content below the header */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Welcome to the Driver Dashboard</Text>

                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={styles.header}>Key</Text>
                        <Text style={styles.header}>Value</Text>
                    </View>
                    <FlatList data={keyValuePairs} renderItem={renderItem} keyExtractor={(item) => item.key} />
                </View>

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
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
