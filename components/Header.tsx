// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    showAccountIcon?: boolean;
    onAccountPress?: () => void;
}

export default function Header({
                                   title,
                                   showBackButton,
                                   onBackPress,
                                   showAccountIcon,
                                   onAccountPress,
                               }: HeaderProps) {
    return (
        <View style={styles.headerContainer}>
            {showBackButton && (
                <TouchableOpacity style={styles.iconLeft} onPress={onBackPress}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            )}
            <Text style={styles.headerText}>{title}</Text>
            {showAccountIcon && (
                <TouchableOpacity style={styles.iconRight} onPress={onAccountPress}>
                    <Ionicons name="person-circle-outline" size={30} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        backgroundColor: '#FF9500',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 10,
        width: '100%',
        position: 'absolute', // Ensures it's at the top of the screen
        top: 0, // Ensures it's positioned from the very top of the screen
        zIndex: 1000, // Make sure it stays on top of other content
    },
    headerText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconLeft: {
        position: 'absolute',
        left: 10,
        top: 18,
    },
    iconRight: {
        position: 'absolute',
        right: 10,
        top: 18,
    },
});
