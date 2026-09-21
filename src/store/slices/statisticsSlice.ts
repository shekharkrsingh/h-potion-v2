import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';

interface DoctorStatistics {
    totalAppointments: number;
    treatedPatients: number;
    availableHours: number;
    // Performance Metrics
    lastActiveDayAppointments?: number;
    lastActiveDayTreatedAppointments?: number;
    lastActiveDayPercentageTreatedAppointments?: number;

    // Charts Data
    totalTreatedAppointment?: number;
    totalAvailableAtClinic?: number;
    totalUntreatedAppointmentAndNotAvailable?: number;
    lastWeekTreatedData?: Array<{ date: string; count: number }>;

    // Trends (Optional)
    appointmentsTrend?: { value: number; isPositive: boolean };
    treatedTrend?: { value: number; isPositive: boolean };
    completionRate?: number;
}

interface StatisticsState {
    data: DoctorStatistics | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: StatisticsState = {
    data: null,
    isLoading: false,
    error: null,
};

export const fetchStatistics = createAsyncThunk(
    'statistics/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.doctor.statistics);

            const rawData = response.data.data || {};

            // Map backend response to frontend interface
            // handling potential snake_case or different naming
            const mappedData: DoctorStatistics = {
                // API keys are singular 'totalAppointment', 'totalTreatedAppointment'
                totalAppointments: rawData.totalAppointment ?? rawData.totalAppointments ?? 0,

                // key mapping: treatedPatients -> totalTreatedAppointment
                treatedPatients: rawData.totalTreatedAppointment ?? rawData.treatedPatients ?? 0,

                // key mapping: availableHours -> totalAvailableAtClinic (assuming slots=hours or similar metric)
                availableHours: rawData.totalAvailableAtClinic ?? rawData.availableHours ?? 0,

                // Calculate completion rate if not provided: (treated / total) * 100
                completionRate: rawData.completionRate ??
                    (rawData.totalAppointment > 0
                        ? Math.round((rawData.totalTreatedAppointment / rawData.totalAppointment) * 100)
                        : 0),

                lastActiveDayAppointments: rawData.lastActiveDayAppointments,
                lastActiveDayTreatedAppointments: rawData.lastActiveDayTreatedAppointments,
                lastActiveDayPercentageTreatedAppointments: rawData.lastActiveDayPercentageTreatedAppointments,

                totalTreatedAppointment: rawData.totalTreatedAppointment,
                totalAvailableAtClinic: rawData.totalAvailableAtClinic,
                totalUntreatedAppointmentAndNotAvailable: rawData.totalUntreatedAppointmentAndNotAvailable,

                lastWeekTreatedData: rawData.lastWeekTreatedData,

                appointmentsTrend: rawData.appointmentsTrend,
                treatedTrend: rawData.treatedTrend
            };

            return mappedData;
        } catch (error: any) {
            console.error('Fetch Statistics Error:', error);
            // Error could be the custom object from handleApiError or a raw error
            const message = error?.message || error?.response?.data?.message || 'Failed to fetch statistics';
            return rejectWithValue(message);
        }
    },
    {
        condition: (_, { getState }) => {
            const { statistics } = getState() as { statistics: StatisticsState };
            if (statistics.isLoading) {
                return false;
            }
        },
    }
);

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatistics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchStatistics.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default statisticsSlice.reducer;
