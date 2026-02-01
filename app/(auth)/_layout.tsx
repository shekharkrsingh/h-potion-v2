import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup/index" />
            <Stack.Screen name="signup/verify" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
}
