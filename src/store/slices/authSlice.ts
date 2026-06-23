import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService, LoginPayload, SignupPayload, VerifyPayload } from '@/services/auth/authService';
import { getRefreshToken } from '@/services/auth/tokenService';
import { User } from '@/types/auth';

interface AuthState {
    // Session
    token: string | null;
    isAuthenticated: boolean;
    user: User | null;

    // UI State
    isLoading: boolean;
    error: string | null;

    // Registration Flow
    signupStep: number;
    signupData: Partial<SignupPayload>;
    signupSuccess: boolean;

    // Recovery Flow
    recoveryStep: number;
    recoveryEmail: string;
    recoverySuccess: boolean;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,

    signupStep: 1,
    signupData: {},
    signupSuccess: false,

    recoveryStep: 1,
    recoveryEmail: '',
    recoverySuccess: false,
};

// --- Thunks ---

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginPayload, { rejectWithValue }) => {
        try {
            const token = await AuthService.login(credentials);
            return token;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (payload: SignupPayload, { rejectWithValue }) => {
        try {
            const token = await AuthService.register(payload);
            return token;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const verifyUser = createAsyncThunk(
    'auth/verify',
    async (payload: VerifyPayload, { rejectWithValue }) => {
        try {
            const token = await AuthService.verify(payload);
            return token;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Verification failed');
        }
    }
);

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (email: string, { rejectWithValue }) => {
        try {
            await AuthService.resendOtp(email);
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to send OTP');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        // Always clear local state first — guaranteed even if network call fails
        dispatch(clearCredentials());
        try {
            await AuthService.logout();
        } catch (e) {
            // Network failure during logout is acceptable — local state already cleared
        }
    }
);

export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { rejectWithValue }) => {
        try {
            // First try: check if we have a valid (non-expired) access token
            let user = await AuthService.getUserFromToken();
            if (user) {
                const token = await AuthService.getValidToken();
                return { token, user };
            }

            // Access token expired or missing — try to refresh using the refresh token
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                try {
                    const newToken = await AuthService.refreshTokens(refreshToken);
                    if (newToken) {
                        user = await AuthService.getUserFromToken();
                        if (user) {
                            return { token: newToken, user };
                        }
                    }
                } catch {
                    // Refresh token also expired/revoked — force re-login
                }
            }

            return rejectWithValue('No valid session');
        } catch (error: any) {
            return rejectWithValue('Session restoration failed');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, newPassword, otp }: { email: string; newPassword: string; otp: string }, { rejectWithValue }) => {
        try {
            await AuthService.forgotPassword(email, newPassword, otp);
            return;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Password reset failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; user?: User }>
        ) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            if (action.payload.user) state.user = action.payload.user;
        },
        clearCredentials: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        // Signup Reducers
        updateSignupData: (state, action: PayloadAction<Partial<SignupPayload>>) => {
            state.signupData = { ...state.signupData, ...action.payload };
        },
        setSignupStep: (state, action: PayloadAction<number>) => {
            state.signupStep = action.payload;
        },
        resetSignup: (state) => {
            state.signupStep = 1;
            state.signupData = {};
            state.signupSuccess = false;
            state.error = null;
        },
        // Recovery Reducers
        setRecoveryEmail: (state, action: PayloadAction<string>) => {
            state.recoveryEmail = action.payload;
        },
        setRecoveryStep: (state, action: PayloadAction<number>) => {
            state.recoveryStep = action.payload;
        },
        resetRecovery: (state) => {
            state.recoveryStep = 1;
            state.recoveryEmail = '';
            state.recoverySuccess = false;
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.isAuthenticated = true;
                    state.token = action.payload;
                    state.signupSuccess = true;
                } else {
                    state.signupStep = 2; // Transition to OTP if no token returned
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Verify
            .addCase(verifyUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload;
                state.signupSuccess = true;
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Send OTP (Shared for signup/recovery)
            .addCase(sendOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Session Restore
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user as User;
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.isAuthenticated = false;
                state.isLoading = false;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.recoverySuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setCredentials,
    clearCredentials,
    updateSignupData,
    setSignupStep,
    resetSignup,
    setRecoveryEmail,
    setRecoveryStep,
    resetRecovery,
    clearAuthError
} = authSlice.actions;

export default authSlice.reducer;
