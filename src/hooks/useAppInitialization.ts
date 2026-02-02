import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store'; // Adjust path if needed
import { restoreSession } from '@/store/slices/authSlice';
import { initializeUserSettings } from '@/store/slices/userSettingsSlice';
import { checkAndSendDailyAnalytics } from '@/services/analytics/analyticsService';
import { websocketAppointment } from '@/services/websocket/websocketService';
import { store } from '@/store';
import { router } from 'expo-router';
import { fetchAppConfig, setUpdateStatus } from '@/store/slices/configSlice';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import {
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { compareVersions } from '@/utils/version';

export const useAppInitialization = () => {
    const [isReady, setIsReady] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const initializeApp = async () => {

            try {
                // 1. Parallelize independent tasks
                const [sessionResult, , configResult] = await Promise.all([
                    dispatch(restoreSession()).unwrap().catch(() => null),
                    dispatch(initializeUserSettings()).unwrap(),
                    dispatch(fetchAppConfig()).unwrap(),
                    Font.loadAsync({
                        Outfit_400Regular,
                        Outfit_500Medium,
                        Outfit_600SemiBold,
                        Outfit_700Bold,
                    }),
                ]);

                // 2. Version Check Logic
                if (configResult) {
                    const currentVersion = Constants.expoConfig?.version || '0.0.0';
                    const { minVersion, latestVersion } = configResult;

                    const cmpMin = compareVersions(currentVersion, minVersion);
                    const cmpLatest = compareVersions(currentVersion, latestVersion);

                    if (cmpMin === -1 || cmpLatest === 1) {
                        // current < min OR current > latest
                        dispatch(setUpdateStatus('force'));
                    } else if (cmpLatest === -1) {
                        // min <= current < latest
                        dispatch(setUpdateStatus('optional'));
                    } else {
                        dispatch(setUpdateStatus('none'));
                    }
                }

                // 2. Initialize Websocket if session exists
                // We pass the dispatch and a helper to get the latest profile state (if needed)
                websocketAppointment.initialize(
                    store.dispatch,
                    () => ({}) // Profile state getter (can be implemented if needed)
                );
                websocketAppointment.initializeAppStateListener();

            } catch (error) {
                console.error('[AppInit] Initialization error:', error);
            } finally {
                setIsReady(true);
            }
        };

        initializeApp();
    }, [dispatch]);

    return { isReady };
};
