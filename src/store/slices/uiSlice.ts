// UI State Redux Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountryCode, Language } from '@/types/healthcare';

interface UiState {
  sidebarCollapsed: boolean;
  currentCountry: CountryCode;
  language: Language;
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    types: {
      claims: boolean;
      preAuth: boolean;
      payments: boolean;
      alerts: boolean;
    };
  };
  dashboard: {
    refreshInterval: number; // seconds
    autoRefresh: boolean;
  };
}

const initialState: UiState = {
  sidebarCollapsed: false,
  currentCountry: 'SA',
  language: 'en',
  theme: 'light',
  notifications: {
    enabled: true,
    types: {
      claims: true,
      preAuth: true,
      payments: true,
      alerts: true,
    },
  },
  dashboard: {
    refreshInterval: 300, // 5 minutes
    autoRefresh: true,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setCurrentCountry: (state, action: PayloadAction<CountryCode>) => {
      state.currentCountry = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications.enabled = !state.notifications.enabled;
    },
    setNotificationType: (state, action: PayloadAction<{ type: keyof typeof initialState.notifications.types; enabled: boolean }>) => {
      const { type, enabled } = action.payload;
      state.notifications.types[type] = enabled;
    },
    setDashboardRefreshInterval: (state, action: PayloadAction<number>) => {
      state.dashboard.refreshInterval = action.payload;
    },
    toggleAutoRefresh: (state) => {
      state.dashboard.autoRefresh = !state.dashboard.autoRefresh;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setCurrentCountry,
  setLanguage,
  setTheme,
  toggleNotifications,
  setNotificationType,
  setDashboardRefreshInterval,
  toggleAutoRefresh,
} = uiSlice.actions;

export { uiSlice };