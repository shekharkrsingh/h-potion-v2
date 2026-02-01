import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import { Appointment } from './appointmentSlice';

interface BookingState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    lastBookedAppointment: Appointment | null;
}

const initialState: BookingState = {
    isLoading: false,
    error: null,
    success: false,
    lastBookedAppointment: null,
};

export const bookAppointment = createAsyncThunk(
    'booking/book',
    async (data: Partial<Appointment>, { rejectWithValue }) => {
        try {
            const response = await client.post(endpoints.appointments.book, data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to book appointment');
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        resetBookingState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
            state.lastBookedAppointment = null;
        },
        clearBookingError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookAppointment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.lastBookedAppointment = action.payload;
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetBookingState, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
