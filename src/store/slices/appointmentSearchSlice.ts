import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import { Appointment } from './appointmentSlice';

interface AppointmentSearchState {
    searchResults: Appointment[];
    isLoading: boolean;
    error: string | null;
}

const initialState: AppointmentSearchState = {
    searchResults: [],
    isLoading: false,
    error: null,
};

export const searchAppointments = createAsyncThunk(
    'appointmentSearch/search',
    async (criteria: Record<string, any>, { rejectWithValue, signal }) => {
        try {
            const response = await client.post(endpoints.appointments.search, criteria, { signal });
            return response.data.data || [];
        } catch (error: any) {
            if (error.name === 'CanceledError') {
                return rejectWithValue('Request canceled');
            }
            return rejectWithValue(error.message || 'Failed to search appointments');
        }
    }
);

const appointmentSearchSlice = createSlice({
    name: 'appointmentSearch',
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.error = null;
        },
        clearSearchError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchAppointments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchAppointments.rejected, (state, action) => {
                state.isLoading = false;
                if (action.payload !== 'Request canceled') {
                    state.error = action.payload as string;
                }
            })
            // Cross-slice updates: listen for changes in the main appointment slice
            .addCase('appointments/update/fulfilled', (state, action: any) => {
                const index = state.searchResults.findIndex(a => a.appointmentId === action.payload.appointmentId);
                if (index !== -1) {
                    state.searchResults[index] = { ...state.searchResults[index], ...action.payload };
                }
            })
            .addCase('appointments/cancel/fulfilled', (state, action: any) => {
                const index = state.searchResults.findIndex(a => a.appointmentId === action.payload.appointmentId);
                if (index !== -1) {
                    state.searchResults[index] = { ...state.searchResults[index], ...action.payload };
                }
            })
            .addCase('appointments/updateEmergency/fulfilled', (state, action: any) => {
                const index = state.searchResults.findIndex(a => a.appointmentId === action.payload.appointmentId);
                if (index !== -1) {
                    state.searchResults[index] = { ...state.searchResults[index], ...action.payload };
                }
            });
    },
});

export const { clearSearchResults, clearSearchError } = appointmentSearchSlice.actions;
export default appointmentSearchSlice.reducer;
