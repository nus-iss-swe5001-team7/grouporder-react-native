// app/(auth)/driverscreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function driverscreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Driver Screen</Text>
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
        marginBottom: 16,
        textAlign: 'center',
    },
});
