//app/signup/index.tsx

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown'; // Import the Dropdown component
import baseUrl from '../../constants/projUrl'; // Import the correct config based on the environment

export default function SignUpForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordagain, setPasswordagain] = useState<string>('');
    const [role, setRole] = useState<string>('delivery'); // Default role
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Simple validation to check if all required fields are filled
        if (!name || !email || !password || !passwordagain) {
            setError("All fields are required.");
            return;
        }

        // Validate the email format
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Check if password and confirm password match
        if (password !== passwordagain) {
            setError("Passwords do not match.");
            return;
        }

        const apiUrl = baseUrl + '/user-service/user/register';


        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    password,
                    email,
                    role,
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

                await AsyncStorage.setItem('userlogin', 'true');
                router.replace('/driver');
            } else {
                setError(result.message || 'Sign-up failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.pageContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Add this to adjust for keyboard on iOS and Android
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Driver Sign Up</Text>
                <Text style={styles.headerSubtitle}>Please sign up a new account</Text>
            </View>

            <View style={styles.container}>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={passwordagain}
                    onChangeText={setPasswordagain}
                    secureTextEntry
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.normalText}>
                    Already have an account?{' '}
                    <Text onPress={() => router.push('/login')} style={styles.linkText}>
                        Login Now
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
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
    normalTextLeft: {
        fontSize: 14,
        marginBottom: 8,
    },
    dropdownContainer: {
        width: '100%', // Ensure full width
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    dropdown: {
        width: '100%',
    },
    placeholderStyle: {
        color: '#ccc',
        fontSize: 14,
    },
    selectedTextStyle: {
        color: '#000',
        fontSize: 16,
    },
    linkText: {
        color: '#FF9500',
        fontWeight: 'bold',
    },
});
