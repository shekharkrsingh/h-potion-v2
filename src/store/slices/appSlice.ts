import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import Constants from 'expo-constants';

interface AppData {
    minVersion: string;
    latestVersion: string;
    forceUpdate: boolean;
    message: string;
}

interface AppState {
    data: AppData | null;
    isLoading: boolean;
    needsUpdate: boolean;
}

const initialState: AppState = {
    data: null,
    isLoading: false,
    needsUpdate: false,
};

export const checkAppVersion = createAsyncThunk(
    'app/checkVersion',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.auth.runtime);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAppVersion.fulfilled, (state, action) => {
                state.data = action.payload;
                const currentVersion = Constants.expoConfig?.version || '1.0.0';
                state.needsUpdate = action.payload.minVersion > currentVersion;
            });
    },
});

export default appSlice.reducer;
