// app/(driver)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function driverLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Correctly map driverscreen */}
            <Stack.Screen name="driverscreen" />
        </Stack>
    );
}
