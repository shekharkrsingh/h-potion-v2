import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice';
import bookingReducer from './slices/bookingSlice';
import profileReducer from './slices/profileSlice';
import notificationReducer from './slices/notificationSlice';
import statisticsReducer from './slices/statisticsSlice';
import appSliceReducer from './slices/appSlice';
import userSettingsReducer from './slices/userSettingsSlice';
import configReducer from './slices/configSlice';
import appointmentSearchReducer from './slices/appointmentSearchSlice';
import appointmentDetailsReducer from './slices/appointmentDetailsSlice';
import activeDoctorReducer from './slices/activeDoctorSlice';

import { combineReducers } from '@reduxjs/toolkit';

const appReducer = combineReducers({
    auth: authReducer,
    appointments: appointmentReducer,
    booking: bookingReducer,
    profile: profileReducer,
    notifications: notificationReducer,
    statistics: statisticsReducer,
    app: appSliceReducer,
    userSettings: userSettingsReducer,
    config: configReducer,
    appointmentSearch: appointmentSearchReducer,
    appointmentDetails: appointmentDetailsReducer,
    activeDoctor: activeDoctorReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === 'auth/logout/fulfilled' || action.type === 'auth/clearCredentials') {
        state = undefined;
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
