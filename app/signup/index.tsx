//app/signup/index.tsx

import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import {Picker} from "@react-native-picker/picker";

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordagain, setPasswordagain] = useState<string>('');
    const [role, setRole] = useState<string>('Driver');  // Default role
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        const apiUrl = 'https://66dd802bf7bcc0bbdcde43b3.mockapi.io/user-services/signup';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    role,
                }),
            });

            const result = await response.json();

            if (response.ok) {
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
        <View style={styles.pageContainer}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sign Up</Text>
                <Text style={styles.headerSubtitle}>Please sign up a new account</Text>
            </View>

            {/* Form Section */}
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
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
                <Text style={styles.normalTextLeft}>Roles</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Driver" value="Driver"/>
                        <Picker.Item label="Customer" value="Customer"/>
                    </Picker>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                {/* Navigation Link to Login */}
                <Text style={styles.normalText}>
                    Already have an account?{' '}
                    <Text onPress={() => router.push('/login')} style={styles.linkText}>
                        Login Now
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
    normalTextLeft: {
        fontSize: 14,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
        width: '100%',
    },

    linkText: {
        color: '#FF9500',
        fontWeight: 'bold',
    },
});