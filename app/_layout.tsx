import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ThemedStatusBar } from '@/components/ui/ThemedStatusBar';

import { ToastProvider } from '@/context/ToastContext';
import { DialogProvider } from '@/context/DialogContext';
import CustomSplashScreen from '@/screens/SplashScreen';
import { useNetInfo } from '@react-native-community/netinfo';
import { OfflineScreen } from '@/components/ui/OfflineScreen';
import { UpdateRequiredScreen } from '@/screens/UpdateRequiredScreen';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { setUpdateStatus } from '@/store/slices/configSlice';
import { haptics } from '@/utils/haptics';

// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync();

import { useAppInitialization } from '@/hooks/useAppInitialization';


import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { websocketAppointment } from '@/services/websocket/websocketService';

function AppContent() {
    const [isSplashFinished, setSplashFinished] = useState(false);
    const { isReady } = useAppInitialization();
    const { updateStatus } = useSelector((state: RootState) => state.config);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { hapticsEnabled } = useSelector((state: RootState) => state.userSettings);
    const netInfo = useNetInfo();

    useEffect(() => {
        haptics.setEnabled(hapticsEnabled);
    }, [hapticsEnabled]);

    useEffect(() => {
        if (isReady) {
            if (isAuthenticated) {
                websocketAppointment.connect();
            } else {
                websocketAppointment.disconnect();
            }
        }
    }, [isAuthenticated, isReady]);

    const [dismissedOptional, setDismissedOptional] = useState(false);

    useEffect(() => {
        // Hide the native splash screen immediately to let the custom themed splash screen take over.
        ExpoSplashScreen.hideAsync();
    }, []);

    useEffect(() => {
        if (isSplashFinished && isReady) {
            // Only proceed with navigation if not forced to update
            if (updateStatus !== 'force' && (updateStatus !== 'optional' || dismissedOptional)) {
                if (isAuthenticated) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/(auth)/login');
                }
            }
        }
    }, [isSplashFinished, isReady, isAuthenticated, updateStatus, dismissedOptional]);

    if (!isSplashFinished || !isReady) {
        return (
            <CustomSplashScreen
                isReady={isReady}
                onFinish={() => {
                    setSplashFinished(true);
                }}
            />
        );
    }


    // Force Update: Un-bypassable
    if (isSplashFinished && isReady && updateStatus === 'force') {
        return <UpdateRequiredScreen />;
    }

    // Optional Update: Shown if not dismissed
    if (isSplashFinished && isReady && updateStatus === 'optional' && !dismissedOptional) {
        return <UpdateRequiredScreen onDismiss={() => setDismissedOptional(true)} />;
    }

    return (
        <DialogProvider>
            <ToastProvider>
                <Stack screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? "(tabs)" : "(auth)"}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
                <OfflineScreen isOffline={netInfo.isConnected === false} />
                <ThemedStatusBar />
            </ToastProvider>
        </DialogProvider>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </Provider>
    );
}
