// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';

export default function authLayout() {

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Correctly map loginscreen */}
            <Stack.Screen name="loginscreen" />
        </Stack>
    );
}
