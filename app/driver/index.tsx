//app/driver/index.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DriverScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Driver Dashboard</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});