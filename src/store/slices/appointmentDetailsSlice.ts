import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import { Appointment } from './appointmentSlice';

interface AppointmentDetailsState {
    selectedAppointment: Appointment | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AppointmentDetailsState = {
    selectedAppointment: null,
    isLoading: false,
    error: null,
};

export const getAppointmentDetails = createAsyncThunk(
    'appointmentDetails/fetch',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.appointments.details(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch appointment details');
        }
    }
);

const appointmentDetailsSlice = createSlice({
    name: 'appointmentDetails',
    initialState,
    reducers: {
        clearSelectedAppointment: (state) => {
            state.selectedAppointment = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAppointmentDetails.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                // Clear state if fetching a new appointment to avoid showing stale data
                if (state.selectedAppointment?.appointmentId !== action.meta.arg) {
                    state.selectedAppointment = null;
                }
            })
            .addCase(getAppointmentDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedAppointment = action.payload;
            })
            .addCase(getAppointmentDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Listen for updates from other slices to keep details in sync
            .addCase('appointments/update/fulfilled', (state, action: any) => {
                if (state.selectedAppointment?.appointmentId === action.payload.appointmentId) {
                    state.selectedAppointment = { ...state.selectedAppointment, ...action.payload };
                }
            })
            .addCase('appointments/cancel/fulfilled', (state, action: any) => {
                if (state.selectedAppointment?.appointmentId === action.payload.appointmentId) {
                    state.selectedAppointment = { ...state.selectedAppointment, ...action.payload };
                }
            })
            .addCase('appointments/updateEmergency/fulfilled', (state, action: any) => {
                if (state.selectedAppointment?.appointmentId === action.payload.appointmentId) {
                    state.selectedAppointment = { ...state.selectedAppointment, ...action.payload };
                }
            });
    },
});

export const { clearSelectedAppointment } = appointmentDetailsSlice.actions;
export default appointmentDetailsSlice.reducer;
