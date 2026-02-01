import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { client } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
}

interface NotificationState {
    items: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(endpoints.notifications.getAll);
            return response.data.data || [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markRead',
    async (id: string, { rejectWithValue }) => {
        try {
            await client.patch(endpoints.notifications.markRead(id));
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            await client.patch(endpoints.notifications.markAllRead);
            return;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            const index = state.items.findIndex(n => n.id === action.payload.id);
            if (index !== -1) {
                // Update existing
                state.items[index] = action.payload;
            } else {
                // Add new
                state.items.unshift(action.payload);
                state.unreadCount += 1;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.items = action.payload;
                state.unreadCount = state.items.filter(n => !n.isRead).length;
            })
            // Optimistic Update: Mark read immediately on pending
            .addCase(markAsRead.pending, (state, action) => {
                // action.meta.arg contains the 'id' passed to the thunk
                const id = action.meta.arg;
                const item = state.items.find(n => n.id === id);
                if (item && !item.isRead) {
                    item.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                // Already handled in pending, nothing to do here unless we sync data
            })
            .addCase(markAsRead.rejected, (state, action) => {
                // Rollback on failure
                const id = action.meta.arg;
                const item = state.items.find(n => n.id === id);
                if (item && item.isRead) {
                    item.isRead = false;
                    state.unreadCount += 1;
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.items.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
