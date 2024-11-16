//app/login/index.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import getProjUrl from '../../constants/projUrl'; // Import the function to get projUrl

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [projEnv, setProjEnv] = useState('production'); // Local state to handle environment
    const [projUrl, setProjUrl] = useState(''); // To store the API URL dynamically
    const router = useRouter();

    // Fetch the environment and API URL when the component mounts
    useEffect(() => {
        const loadEnv = async () => {
            const storedEnv = await AsyncStorage.getItem('projEnv') || 'production';
            setProjEnv(storedEnv);
            const url = await getProjUrl();
            setProjUrl(url);
        };
        loadEnv();
    }, []);

    // Function to toggle environment
    const toggleEnv = async () => {
        const newEnv = projEnv === 'development' ? 'production' : 'development';
        setProjEnv(newEnv);
        await AsyncStorage.setItem('projEnv', newEnv); // Store environment in AsyncStorage
        const url = await getProjUrl(); // Get the new API URL
        setProjUrl(url); // Update the API URL
    };

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

        const apiUrl = projUrl + '/user/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password,
                }),
            });

            if (response.ok) {
                console.log('Response OK:', response);

                const result = await response.json();

                // Check the user role before proceeding
                if (result.role !== 'delivery') {
                    // Show an alert with the email and role, then log out
                    Alert.alert(
                        'Role not allowed',
                        `Email: ${email}\nYour account role is '${result.role}'.`,
                        [
                            {
                                text: 'OK',
                                onPress: async () => {
                                    await AsyncStorage.clear(); // Clear user data and go back to login screen
                                    router.replace('/login');
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                    return;
                }

                // Store the user info (userId, name, role, token) in AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify({
                    userId: result.userId,
                    name: result.name,
                    role: result.role,
                    token: result.token,
                    email: email,
                }));

                // Save login flag to local storage
                await AsyncStorage.setItem('userlogin', 'true');
                router.replace('/driver');  // Navigate to Driver screen

            }
            else {
                console.log('Response Status:', response.status);
                console.log('Response StatusText:', response.statusText);
                console.log('Response KO:', response);
                // Handle error based on HTTP status code
                if (response.status === 401) {
                    setError('Invalid credentials. Please try again.');
                } else if (response.status === 404) {
                    if (projEnv === "development"){
                        setError('Invalid Mock Request (https://0vl43.wiremockapi.cloud), please use {"name":"demo@email.com","password":"password"}');
                    } else {
                        setError('Login endpoint not found. Please contact support or try again later.');
                    }
                } else if (response.status === 500) {
                    setError('Internal server error. Please try again later or use Mock Server in case PROD env shutdown.');
                } else {
                    setError(response.status + 'Login failed. Please try again or use Mock Server in case PROD env shutdown');
                }
            }
        } catch (error) {
            // Handle generic errors
            if (error instanceof Error) {
                setError(error.message || 'An error occurred. Please try again later.');
                console.log('error:', error.message);
            } else {
                setError('An unknown error occurred. Please try again later.');
            }
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
                    placeholder="User Email"
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


                {/* Toggle Environment */}
                <View style={styles.envSwitchContainer}>
                    <Text>{projEnv === 'development' ? 'Mock Development' : 'Production'} Environment</Text>
                    <Switch
                        value={projEnv === 'production'}
                        onValueChange={toggleEnv}
                    />
                </View>

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
    envSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
});
