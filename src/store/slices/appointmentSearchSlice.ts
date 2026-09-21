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
    async (criteriaPayload: Record<string, any> | Record<string, any>[], { rejectWithValue, signal }) => {
        try {
            if (Array.isArray(criteriaPayload)) {
                const promises = criteriaPayload.map(criteria =>
                    client.post(endpoints.appointments.search, criteria, { signal })
                );
                const responses = await Promise.all(promises);
                
                const allResults = responses.flatMap(res => res.data.data || []);
                // Deduplicate by appointmentId
                const uniqueResults = Array.from(
                    new Map(allResults.map(item => [item.appointmentId, item])).values()
                );
                return uniqueResults;
            } else {
                const response = await client.post(endpoints.appointments.search, criteriaPayload, { signal });
                return response.data.data || [];
            }
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
        },
        updateAppointmentSearchLocal: (state, action) => {
            const index = state.searchResults.findIndex(a => a.appointmentId === action.payload.appointmentId);
            if (index !== -1) {
                state.searchResults[index] = { ...state.searchResults[index], ...action.payload };
            }
        },
        addAppointmentSearchLocal: (state, action) => {
            // Unshift puts the newest appointment at the top
            state.searchResults.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchAppointments.pending, (state, action) => {
                const criteria = action.meta.arg;
                if (!criteria || !criteria.page || criteria.page === 0) {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(searchAppointments.fulfilled, (state, action) => {
                state.isLoading = false;
                const criteria = action.meta.arg;
                if (criteria && criteria.page && criteria.page > 0) {
                    state.searchResults = [...state.searchResults, ...action.payload];
                } else {
                    state.searchResults = action.payload;
                }
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

export const { clearSearchResults, clearSearchError, updateAppointmentSearchLocal, addAppointmentSearchLocal } = appointmentSearchSlice.actions;
export default appointmentSearchSlice.reducer;
