// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth'; // Import a custom hook to handle authentication status

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = { isLoggedIn: false }; // Force false for testing
  // const { isLoggedIn } = useAuth(); // Fetch authentication status
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log("Is user logged in? ", isLoggedIn);
  }, [isLoggedIn]);

  if (!loaded) {
    return null;
  }

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
              // Navigate to driver screens if logged in
              <Stack.Screen name="(driver)" options={{ headerShown: false }} />
          ) : (
              // Navigate to auth screens if not logged in
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
        </Stack>
      </ThemeProvider>
  );
}
