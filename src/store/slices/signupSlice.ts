import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService, SignupPayload, LoginResponseData } from '@/services/auth/authService';
import { client, ApiResponse } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import { setCredentials } from './authSlice'; // To auto-login after verify

interface SignupState {
    step: number;
    data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        otp?: string;
    };
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SignupState = {
    step: 1,
    data: {},
    isLoading: false,
    error: null,
    success: false,
};

export const registerUser = createAsyncThunk(
    'signup/register',
    async (payload: SignupPayload, { dispatch, rejectWithValue }) => {
        try {
            const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.signup, payload);
            // If the signup response includes a token (auto-login), set it.
            // If not, the user might need to login manually.
            const token = response.data?.data?.token;
            if (token) {
                dispatch(setCredentials({ token }));
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

// We can keep this for "resending" or "sending" initially.
export const sendSignupOtp = createAsyncThunk(
    'signup/sendOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            await AuthService.resendOtp(email);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to send OTP');
        }
    }
);

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        updateSignupData: (state, action: PayloadAction<Partial<SignupState['data']>>) => {
            state.data = { ...state.data, ...action.payload };
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        resetSignup: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Register (Final Step)
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Send OTP (Step 2)
            .addCase(sendSignupOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendSignupOtp.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendSignupOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { updateSignupData, setStep, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
