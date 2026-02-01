import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import Constants from 'expo-constants';

interface RuntimeData {
    minVersion: string;
    latestVersion: string;
    forceUpdate: boolean;
    message: string;
}

interface RuntimeState {
    data: RuntimeData | null;
    isLoading: boolean;
    needsUpdate: boolean;
}

const initialState: RuntimeState = {
    data: null,
    isLoading: false,
    needsUpdate: false,
};

export const checkAppVersion = createAsyncThunk(
    'runtime/checkVersion',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.auth.runtime);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const runtimeSlice = createSlice({
    name: 'runtime',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAppVersion.fulfilled, (state, action) => {
                state.data = action.payload;
                const currentVersion = Constants.expoConfig?.version || '1.0.0';
                // Simple string comparison for now, robust semver needed ideally
                state.needsUpdate = action.payload.minVersion > currentVersion;
            });
    },
});

export default runtimeSlice.reducer;
