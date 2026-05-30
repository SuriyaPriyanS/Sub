import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
    theme: themeReducer,
  },
});
