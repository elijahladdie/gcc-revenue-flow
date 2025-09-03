import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PreAuthorization, PreAuthFilters } from '@/types/healthcare';
import { mockPreAuthorizations } from '@/data/mockData';

interface PreAuthState {
  entities: Record<string, PreAuthorization>;
  ids: string[];
  loading: boolean;
  error: string | null;
  filters: PreAuthFilters;
  aiInsights: {
    autoApprovalRate: number;
    riskDistribution: Record<string, number>;
    confidenceThreshold: number;
  };
}

const initialState: PreAuthState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  filters: {},
  aiInsights: {
    autoApprovalRate: 78.3,
    riskDistribution: {
      'auto-approve': 68,
      'manual-review': 25,
      'high-risk': 7,
    },
    confidenceThreshold: 85,
  },
};

// Async thunks
export const fetchPreAuthorizations = createAsyncThunk(
  'preAuth/fetchPreAuthorizations',
  async (filters: PreAuthFilters = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredPreAuths = [...mockPreAuthorizations];
    
    // Apply filters
    if (filters.status) {
      filteredPreAuths = filteredPreAuths.filter(p => p.status === filters.status);
    }
    if (filters.treatmentCategory) {
      filteredPreAuths = filteredPreAuths.filter(p => p.treatment_category === filters.treatmentCategory);
    }
    if (filters.aiRecommendation) {
      filteredPreAuths = filteredPreAuths.filter(p => p.ai_recommendation === filters.aiRecommendation);
    }
    if (filters.riskLevel) {
      filteredPreAuths = filteredPreAuths.filter(p => {
        const riskLevel = p.confidence_score >= 80 ? 'low' : p.confidence_score >= 50 ? 'medium' : 'high';
        return riskLevel === filters.riskLevel;
      });
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPreAuths = filteredPreAuths.filter(p => 
        p.id.toLowerCase().includes(searchTerm) ||
        p.request_type.toLowerCase().includes(searchTerm) ||
        p.medical_justification.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      data: filteredPreAuths,
      total: filteredPreAuths.length,
    };
  }
);

export const createPreAuthorization = createAsyncThunk(
  'preAuth/createPreAuthorization',
  async (preAuthData: Omit<PreAuthorization, 'id' | 'createdAt' | 'updatedAt' | 'aiRecommendation' | 'confidenceScore'>) => {
    // Simulate API call with AI processing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate AI recommendation logic
    const riskFactors = preAuthData.risk_factors || [];
    const baseConfidence = 85;
    const riskPenalty = riskFactors.length * 15;
    const confidenceScore = Math.max(20, baseConfidence - riskPenalty + Math.random() * 20);
    
    let aiRecommendation: PreAuthorization['ai_recommendation'];
    if (confidenceScore >= 85) {
      aiRecommendation = 'auto-approve';
    } else if (confidenceScore >= 50) {
      aiRecommendation = 'manual-review';
    } else {
      aiRecommendation = 'high-risk';
    }
    
    const newPreAuth: PreAuthorization = {
      ...preAuthData,
      id: `pre-${Date.now()}`,
      ai_recommendation:aiRecommendation,
      confidence_score: Math.round(confidenceScore),
      status: aiRecommendation === 'auto-approve' ? 'approved' : 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return newPreAuth;
  }
);

export const updatePreAuthStatus = createAsyncThunk(
  'preAuth/updatePreAuthStatus',
  async ({ id, status, notes }: { id: string; status: PreAuthorization['status']; notes?: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const updates: Partial<PreAuthorization> = {
      status,
      updated_at: new Date().toISOString(),
    };
    
    return { id, updates };
  }
);

export const batchProcessPreAuths = createAsyncThunk(
  'preAuth/batchProcessPreAuths',
  async ({ ids, action }: { ids: string[]; action: 'approve' | 'deny' }) => {
    // Simulate batch processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const status: PreAuthorization['status'] = action === 'approve' ? 'approved' : 'denied';
    const updates = ids.map(id => ({
      id,
      updates: {
        status,
        updatedAt: new Date().toISOString(),
      },
    }));
    
    return updates;
  }
);

const preAuthSlice = createSlice({
  name: 'preAuth',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PreAuthFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    updateAiInsights: (state, action: PayloadAction<Partial<typeof initialState.aiInsights>>) => {
      state.aiInsights = { ...state.aiInsights, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pre-authorizations
      .addCase(fetchPreAuthorizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreAuthorizations.fulfilled, (state, action) => {
        state.loading = false;
        const { data, total } = action.payload;
        
        // Normalize data
        state.entities = {};
        state.ids = [];
        data.forEach(preAuth => {
          state.entities[preAuth.id] = preAuth;
          state.ids.push(preAuth.id);
        });
      })
      .addCase(fetchPreAuthorizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pre-authorizations';
      })
      
      // Create pre-authorization
      .addCase(createPreAuthorization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPreAuthorization.fulfilled, (state, action) => {
        state.loading = false;
        const preAuth = action.payload;
        state.entities[preAuth.id] = preAuth;
        state.ids.unshift(preAuth.id);
      })
      .addCase(createPreAuthorization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create pre-authorization';
      })
      
      // Update status
      .addCase(updatePreAuthStatus.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        if (state.entities[id]) {
          state.entities[id] = { ...state.entities[id], ...updates };
        }
      })
      
      // Batch process
      .addCase(batchProcessPreAuths.fulfilled, (state, action) => {
        action.payload.forEach(({ id, updates }) => {
          if (state.entities[id]) {
            state.entities[id] = { ...state.entities[id], ...updates };
          }
        });
      });
  },
});

export const { setFilters, clearFilters, updateAiInsights, clearError } = preAuthSlice.actions;
export { preAuthSlice };