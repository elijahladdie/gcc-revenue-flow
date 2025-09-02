// Redux Store Configuration for Healthcare RCM Platform

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { patientsSlice } from './slices/patientsSlice';
import { claimsSlice } from './slices/claimsSlice';
import { preAuthSlice } from './slices/preAuthSlice';
import { analyticsSlice } from './slices/analyticsSlice';
import { uiSlice } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    patients: patientsSlice.reducer,
    claims: claimsSlice.reducer,
    preAuth: preAuthSlice.reducer,
    analytics: analyticsSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;