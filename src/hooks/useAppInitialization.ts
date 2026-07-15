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
import { fetchAssociatedDoctors, fetchActiveDoctorProfile, switchActiveDoctor } from '@/store/slices/activeDoctorSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

                // 3. Initialize Websocket if session exists
                websocketAppointment.initialize(
                    store.dispatch,
                    store.getState
                );
                websocketAppointment.initializeAppStateListener();

                // 4. Load collaborator active doctor context
                if (sessionResult && sessionResult.user && sessionResult.user.role === 'COLLABORATOR') {
                    try {
                        const assocResult = await dispatch(fetchAssociatedDoctors()).unwrap();
                        const activeDoctorId = await AsyncStorage.getItem('activeDoctorId');
                        
                        let targetDoctorId = activeDoctorId;
                        
                        // Verify that targetDoctorId actually exists in the associated doctors list
                        const isValidTarget = targetDoctorId && assocResult.doctors.some(d => d.doctorId === targetDoctorId);
                        
                        if (!isValidTarget) {
                            if (assocResult.activeDoctorId) {
                                targetDoctorId = assocResult.activeDoctorId;
                                await AsyncStorage.setItem('activeDoctorId', targetDoctorId);
                            } else if (assocResult.doctors.length > 0) {
                                targetDoctorId = assocResult.doctors[0].doctorId;
                                await AsyncStorage.setItem('activeDoctorId', targetDoctorId);
                            }
                        }

                        if (targetDoctorId) {
                            if (targetDoctorId !== assocResult.activeDoctorId) {
                                // Sync backend with local stored active doctor
                                await dispatch(switchActiveDoctor(targetDoctorId)).unwrap();
                            } else {
                                websocketAppointment.updateDoctorSubscription(targetDoctorId);
                                await dispatch(fetchActiveDoctorProfile()).unwrap();
                            }
                        }
                    } catch (err) {
                        console.error('[AppInit] Failed to load collaborator context:', err);
                    }
                }

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
