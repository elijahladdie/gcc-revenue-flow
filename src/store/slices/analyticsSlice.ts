// Analytics Redux Slice

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Analytics } from '@/types/healthcare';
import { mockAnalytics } from '@/data/mockData';

interface AnalyticsState {
  data: Analytics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (dateRange?: { start: string; end: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, this would fetch filtered analytics based on date range
    return {
      ...mockAnalytics,
      lastUpdated: new Date().toISOString(),
    };
  }
);

export const refreshAnalytics = createAsyncThunk(
  'analytics/refreshAnalytics',
  async () => {
    // Simulate real-time analytics refresh
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate slight variations to simulate real-time updates
    const variation = () => 0.95 + Math.random() * 0.1; // ±5% variation
    
    return {
      ...mockAnalytics,
      totalPatients: Math.round(mockAnalytics.totalPatients * variation()),
      activeClaims: Math.round(mockAnalytics.activeClaims * variation()),
      pendingAuthorizations: Math.round(mockAnalytics.pendingAuthorizations * variation()),
      monthlyRevenue: Math.round(mockAnalytics.monthlyRevenue * variation()),
      claimApprovalRate: Math.round(mockAnalytics.claimApprovalRate * variation() * 100) / 100,
      lastUpdated: new Date().toISOString(),
    };
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      })
      
      // Refresh analytics
      .addCase(refreshAnalytics.fulfilled, (state, action) => {
        state.data = action.payload;
        state.lastUpdated = action.payload.lastUpdated;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export { analyticsSlice };