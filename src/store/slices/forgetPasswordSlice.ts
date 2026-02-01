import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { client, ApiResponse } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';

interface ForgetPasswordState {
    email: string;
    step: number;
    isLoading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: ForgetPasswordState = {
    email: '',
    step: 1,
    isLoading: false,
    success: false,
    error: null,
};

export const sendResetOtp = createAsyncThunk(
    'forgetPassword/sendOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await client.post<ApiResponse<null>>(endpoints.auth.sendOtp, { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to send OTP');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'forgetPassword/reset',
    async (data: { email: string; otp: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await client.post<ApiResponse<null>>(endpoints.auth.forgotPassword, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to reset password');
        }
    }
);

const forgetPasswordSlice = createSlice({
    name: 'forgetPassword',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Send OTP
            .addCase(sendResetOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(sendResetOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
                state.step = 2; // Move to next step usually
            })
            .addCase(sendResetOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
                state.step = 3; // Done
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { setEmail, setStep, resetState } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;
