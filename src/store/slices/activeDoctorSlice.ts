import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileData } from './profileSlice';
import { websocketAppointment } from '@/services/websocket/websocketService';
import { fetchAppointments } from './appointmentSlice';
import { fetchStatistics } from './statisticsSlice';
import { fetchNotifications } from './notificationSlice';

export interface AssociatedDoctor {
    doctorId: string;
    doctorName: string;
    specialization: string;
    clinicName?: string;
    profilePicture?: string;
    role?: string;
    permissions?: string[];
    joinedAt: string;
    active: boolean;
    isCurrentActive: boolean;
}

export interface ActiveDoctorState {
    doctors: AssociatedDoctor[];
    activeDoctorId: string | null;
    activeDoctorProfile: ProfileData | null;
    isLoading: boolean;
    isSwitching: boolean;
    error: string | null;
    hasLoaded: boolean;
}

const initialState: ActiveDoctorState = {
    doctors: [],
    activeDoctorId: null,
    activeDoctorProfile: null,
    isLoading: false,
    isSwitching: false,
    error: null,
    hasLoaded: false,
};

export const fetchAssociatedDoctors = createAsyncThunk(
    'activeDoctor/fetchAssociated',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.collaborators.associatedDoctors);
            const doctors = response.data as AssociatedDoctor[];
            // Try to find the currently active doctor in the list
            const currentActive = doctors.find(d => d.isCurrentActive);
            return {
                doctors,
                activeDoctorId: currentActive ? currentActive.doctorId : null,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch associated doctors');
        }
    }
);

export const fetchActiveDoctorProfile = createAsyncThunk(
    'activeDoctor/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.collaborators.activeDoctorProfile);
            return response.data as ProfileData;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch active doctor profile');
        }
    }
);

export const switchActiveDoctor = createAsyncThunk(
    'activeDoctor/switch',
    async (doctorId: string, { dispatch, rejectWithValue }) => {
        try {
            // 1. Call API to update switch in backend
            const response = await client.put(endpoints.collaborators.switchDoctor(doctorId));
            const activeDoctor = response.data as AssociatedDoctor;

            // 2. Save active doctor ID in AsyncStorage
            await AsyncStorage.setItem('activeDoctorId', doctorId);

            // 3. Update websocket subscription context
            websocketAppointment.updateDoctorSubscription(doctorId);

            // 4. Trigger fresh fetches for the switched doctor's context
            dispatch(fetchActiveDoctorProfile());
            dispatch(fetchAppointments());
            dispatch(fetchStatistics());
            dispatch(fetchNotifications());

            return activeDoctor;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to switch doctor');
        }
    }
);

const activeDoctorSlice = createSlice({
    name: 'activeDoctor',
    initialState,
    reducers: {
        setActiveDoctorIdLocal: (state, action: PayloadAction<string>) => {
            state.activeDoctorId = action.payload;
        },
        clearActiveDoctor: (state) => {
            state.doctors = [];
            state.activeDoctorId = null;
            state.activeDoctorProfile = null;
            state.hasLoaded = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAssociatedDoctors
            .addCase(fetchAssociatedDoctors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAssociatedDoctors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasLoaded = true;
                state.doctors = action.payload.doctors;
                if (action.payload.activeDoctorId) {
                    state.activeDoctorId = action.payload.activeDoctorId;
                } else if (state.doctors.length > 0 && !state.activeDoctorId) {
                    // Fallback to first doctor if none is active
                    state.activeDoctorId = state.doctors[0].doctorId;
                }
            })
            .addCase(fetchAssociatedDoctors.rejected, (state, action) => {
                state.isLoading = false;
                state.hasLoaded = true;
                state.error = action.payload as string;
            })

            // fetchActiveDoctorProfile
            .addCase(fetchActiveDoctorProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchActiveDoctorProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeDoctorProfile = action.payload;
            })
            .addCase(fetchActiveDoctorProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // switchActiveDoctor
            .addCase(switchActiveDoctor.pending, (state) => {
                state.isSwitching = true;
                state.error = null;
            })
            .addCase(switchActiveDoctor.fulfilled, (state, action) => {
                state.isSwitching = false;
                state.activeDoctorId = action.payload.doctorId;
                // Update isCurrentActive flags in doctors list
                state.doctors = state.doctors.map(d => ({
                    ...d,
                    isCurrentActive: d.doctorId === action.payload.doctorId,
                }));
            })
            .addCase(switchActiveDoctor.rejected, (state, action) => {
                state.isSwitching = false;
                state.error = action.payload as string;
            });
    },
});

export const { setActiveDoctorIdLocal, clearActiveDoctor } = activeDoctorSlice.actions;

export default activeDoctorSlice.reducer;
