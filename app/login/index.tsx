//app/login/index.tsx

import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import baseUrl from "@/constants/projUrl";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Simple validation to check if all required fields are filled
        if (!email ||  !password ) {
            setError("All fields are required.");
            return;
        }

        // Validate the email format
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        const apiUrl = baseUrl + '/user-service/user/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: email,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Store the user info (userId, name, role, token) in AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify({
                    userId: result.userId,
                    name: result.name,
                    role: result.role,
                    token: result.token,
                }));

                // Save login flag to local storage
                await AsyncStorage.setItem('userlogin', 'true');
                router.replace('/driver');  // Navigate to Driver screen
            } else {
                setError(result.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.pageContainer}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Login</Text>
                <Text style={styles.headerSubtitle}>Please login to your existing account</Text>
            </View>

            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                    <Text style={styles.normalText}>
                        Don't have an account?{' '}
                        <Text onPress={() => router.push('/signup')} style={styles.linkText}>
                            Register Now
                        </Text>
                    </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'M PLUS 1, sans-serif',
    },
    header: {
        backgroundColor: '#0C0C0A',
        width: '100%',
        paddingVertical: 50,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#F6F6F9',
        fontSize: 40,
        fontWeight: '600',
    },
    headerSubtitle: {
        color: '#F6F6F9',
        fontSize: 16,
        marginTop: 10,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    error: {
        color: 'red',
        marginBottom: 16,
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
    },
    normalText: {
        fontSize: 14,
        marginTop: 16,
        textAlign: 'center',
    },
    linkText: {
        color: '#FF9500',
        fontWeight: 'bold',
    },
});
