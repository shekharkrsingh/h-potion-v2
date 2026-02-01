import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ConfigService, RuntimeConfig } from '@/services/configService';

export type UpdateStatus = 'none' | 'optional' | 'force';

interface ConfigState {
    runtimeConfig: RuntimeConfig | null;
    updateStatus: UpdateStatus;
    isLoading: boolean;
    error: string | null;
}

const initialState: ConfigState = {
    runtimeConfig: null,
    updateStatus: 'none',
    isLoading: false,
    error: null,
};

export const fetchAppConfig = createAsyncThunk(
    'config/fetchAppConfig',
    async (_, { rejectWithValue }) => {
        try {
            return await ConfigService.fetchRuntimeConfig();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch config');
        }
    }
);

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setUpdateStatus: (state, action: PayloadAction<UpdateStatus>) => {
            state.updateStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppConfig.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAppConfig.fulfilled, (state, action) => {
                state.isLoading = false;
                state.runtimeConfig = action.payload;
            })
            .addCase(fetchAppConfig.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUpdateStatus } = configSlice.actions;
export default configSlice.reducer;
