import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import { getRoleFromToken } from '@/services/auth/tokenService';

export interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    // Basic Info
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    dateOfBirth?: string;
    phoneNumber?: string;
    profilePicture?: string;
    coverPicture?: string;
    coverImage?: string; // Legacy/Compat
    doctorId?: string;
    collaboratorId?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        address?: string;
    };

    // Professional Details
    specialization?: string;
    education?: string[];
    qualifications?: string[];
    experienceYears?: number;
    yearsOfExperience?: number; // API uses this
    bio?: string;
    about?: string;
    languagesKeywords?: string[];
    achievementsAndAwards?: string[];

    // Clinic Info
    clinicName?: string;
    clinicAddress?: any;
    clinicCity?: string;
    clinicContactNumber?: string;
    clinicEmail?: string;
    consultationFee?: number;

    // Availability
    availability?: { day: string; slots: { startTime: string; endTime: string }[] }[];

    // Verification
    licenseNumber?: string;
    licensingAuthority?: string;
    licenseExpiryDate?: string;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | 'TERMINATED' | 'DENIED';
    hasPendingVerification?: boolean;
    pendingLicenseNumber?: string;
    pendingLicensingAuthority?: string;
    pendingLicenseExpiryDate?: string;

    // Status
    isAvailable?: boolean;
    rating?: number;
    reviewCount?: number;
}

interface ProfileState {
    data: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    role: string | null;
}

const initialState: ProfileState = {
    data: null,
    isLoading: false,
    error: null,
    role: null,
};

export const fetchProfile = createAsyncThunk(
    'profile/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const role = await getRoleFromToken();
            const endpoint = role === 'COLLABORATOR'
                ? endpoints.collaborators.profile
                : endpoints.doctor.profile;

            const response = await client.get(endpoint);
            return { data: response.data.data, role };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch profile');
        }
    },
    {
        condition: (_, { getState }) => {
            const { profile } = getState() as { profile: ProfileState };
            if (profile.isLoading) {
                // Already fetching, don't execute
                return false;
            }
        },
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async (data: Partial<ProfileData>, { rejectWithValue }) => {
        try {
            const role = await getRoleFromToken();
            const endpoint = role === 'COLLABORATOR'
                ? endpoints.collaborators.updateProfile
                : endpoints.doctor.update;

            const response = await client.put(endpoint, data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);

export const updateProfilePicture = createAsyncThunk(
    'profile/updateProfilePicture',
    async (image: { uri: string; type?: string; fileName?: string }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: image.uri,
                name: image.fileName || 'profile.jpg',
                type: image.type || 'image/jpeg',
            } as any);

            const response = await client.put(endpoints.doctor.updateProfilePicture, formData);
            return response.data.data; // Assuming it returns the new image URL
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update profile picture');
        }
    }
);

export const updateCoverPicture = createAsyncThunk(
    'profile/updateCoverPicture',
    async (image: { uri: string; type?: string; fileName?: string }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: image.uri,
                name: image.fileName || 'cover.jpg',
                type: image.type || 'image/jpeg',
            } as any);

            const response = await client.put(endpoints.doctor.updateCoverPicture, formData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update cover picture');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.role = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.data;
                state.role = action.payload.role;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(updateProfilePicture.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfilePicture.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.data) {
                    state.data.profilePicture = action.payload;
                }
            })
            .addCase(updateProfilePicture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCoverPicture.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCoverPicture.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.data) {
                    state.data.coverPicture = action.payload;
                    state.data.coverImage = action.payload; // Synchronize for UI
                }
            })
            .addCase(updateCoverPicture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProfile } = profileSlice.actions;

export const selectProfile = (state: { profile: ProfileState }) => state.profile.data;
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.isLoading;

export default profileSlice.reducer;
