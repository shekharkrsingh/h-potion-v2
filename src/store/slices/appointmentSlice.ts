import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';

export type AppointmentStatus = 'BOOKED' | 'ACCEPTED' | 'CANCELLED' | 'MISSED' | 'REACTIVATED';
export type AppointmentType = 'IN_PERSON' | 'ONLINE';

export interface Appointment {
    appointmentId: string;
    doctorId: string;
    patientName: string;
    contact: string;
    description: string | null;
    appointmentDateTime: string;
    bookingDateTime: string;
    availableAtClinic: boolean;
    treated: boolean;
    status: AppointmentStatus;
    appointmentType: AppointmentType;
    paymentStatus: boolean;
    isEmergency: boolean;
    email?: string;
    doctorName?: string;
    doctorSpecialization?: string;
    // Add other fields as needed based on old code
}

interface AppointmentState {
    appointments: Appointment[];
    isLoading: boolean;
    error: string | null;
}

const smartMerge = (existing: Appointment, update: Partial<Appointment>): Appointment => {
    const cleanUpdate = Object.entries(update).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
    return { ...existing, ...cleanUpdate };
};

const initialState: AppointmentState = {
    appointments: [],
    isLoading: false,
    error: null,
};

export const fetchAppointments = createAsyncThunk(
    'appointments/fetchAll',
    async (date: string | undefined = undefined, { rejectWithValue }) => {
        try {
            const config = date ? { params: { date } } : {};
            const response = await client.get(endpoints.appointments.today, config);
            return response.data.data || [];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch appointments');
        }
    }
);


export const updateAppointment = createAsyncThunk(
    'appointments/update',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(endpoints.appointments.update(id), data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update appointment');
        }
    }
);

export const cancelAppointment = createAsyncThunk(
    'appointments/cancel',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await client.patch(endpoints.appointments.cancel(id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel appointment');
        }
    }
);

export const updateEmergencyStatus = createAsyncThunk(
    'appointments/updateEmergency',
    async ({ id, isEmergency }: { id: string; isEmergency: boolean }, { rejectWithValue }) => {
        try {
            const response = await client.patch(endpoints.appointments.emergency(id), { isEmergency });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update emergency status');
        }
    }
);



const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateAppointmentLocal: (state, action: PayloadAction<Appointment>) => {
            const index = state.appointments.findIndex(a => a.appointmentId === action.payload.appointmentId);
            if (index !== -1) {
                // Merge the new data with existing data to prevent data loss from partial updates
                state.appointments[index] = smartMerge(state.appointments[index], action.payload);
            }
        },
        addAppointmentLocal: (state, action: PayloadAction<Appointment>) => {
            state.appointments.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAppointments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointments = action.payload;
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateAppointment.fulfilled, (state, action) => {
                const index = state.appointments.findIndex(a => a.appointmentId === action.payload.appointmentId);
                if (index !== -1) {
                    state.appointments[index] = smartMerge(state.appointments[index], action.payload);
                }
            })
            // Cancel
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                const index = state.appointments.findIndex(a => a.appointmentId === action.payload.appointmentId);
                if (index !== -1) {
                    state.appointments[index] = smartMerge(state.appointments[index], action.payload);
                }
            })
            // Emergency
            .addCase(updateEmergencyStatus.fulfilled, (state, action) => {
                const index = state.appointments.findIndex(a => a.appointmentId === action.payload.appointmentId);
                if (index !== -1) {
                    state.appointments[index] = smartMerge(state.appointments[index], action.payload);
                }
            })
    },
});

export const { clearError, updateAppointmentLocal, addAppointmentLocal } = appointmentSlice.actions;
export default appointmentSlice.reducer;
