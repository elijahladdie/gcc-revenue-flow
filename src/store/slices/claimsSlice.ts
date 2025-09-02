// Claims Redux Slice

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Claim, ClaimFilters } from '@/types/healthcare';
import { mockClaims } from '@/data/mockData';

interface ClaimsState {
  entities: Record<string, Claim>;
  ids: string[];
  loading: boolean;
  error: string | null;
  filters: ClaimFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ClaimsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Async thunks
export const fetchClaims = createAsyncThunk(
  'claims/fetchClaims',
  async (filters: ClaimFilters = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredClaims = [...mockClaims];
    
    // Apply filters
    if (filters.status) {
      filteredClaims = filteredClaims.filter(c => c.status === filters.status);
    }
    if (filters.country) {
      // This would typically come from patient data join
      filteredClaims = filteredClaims.filter(c => c.currency === getCountryCurrency(filters.country));
    }
    if (filters.facilityType) {
      filteredClaims = filteredClaims.filter(c => c.facilityType === filters.facilityType);
    }
    if (filters.urgencyLevel) {
      filteredClaims = filteredClaims.filter(c => c.urgencyLevel === filters.urgencyLevel);
    }
    if (filters.amountRange) {
      filteredClaims = filteredClaims.filter(c => 
        c.amount >= (filters.amountRange?.min || 0) &&
        c.amount <= (filters.amountRange?.max || Number.MAX_SAFE_INTEGER)
      );
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredClaims = filteredClaims.filter(c => 
        c.id.toLowerCase().includes(searchTerm) ||
        c.providerName.toLowerCase().includes(searchTerm) ||
        c.diagnosis.some(d => d.toLowerCase().includes(searchTerm))
      );
    }
    
    return {
      data: filteredClaims,
      total: filteredClaims.length,
    };
  }
);

export const createClaim = createAsyncThunk(
  'claims/createClaim',
  async (claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newClaim: Claim = {
      ...claimData,
      id: `clm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newClaim;
  }
);

export const updateClaimStatus = createAsyncThunk(
  'claims/updateClaimStatus',
  async ({ id, status, notes }: { id: string; status: Claim['status']; notes?: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const updates: Partial<Claim> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    
    if (notes) {
      updates.notes = notes;
    }
    
    if (status === 'approved') {
      updates.approvalDate = new Date().toISOString();
    }
    
    if (status === 'paid') {
      updates.paymentDate = new Date().toISOString();
    }
    
    return { id, updates };
  }
);

export const submitClaim = createAsyncThunk(
  'claims/submitClaim',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id,
      updates: {
        status: 'submitted' as const,
        submissionDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
);

// Helper function
function getCountryCurrency(countryCode: string) {
  const currencyMap: Record<string, string> = {
    SA: 'SAR',
    UAE: 'AED',
    QA: 'QAR',
    KW: 'KWD',
    BH: 'BHD',
    OM: 'OMR',
  };
  return currencyMap[countryCode];
}

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ClaimFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch claims
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        const { data, total } = action.payload;
        
        // Normalize data
        state.entities = {};
        state.ids = [];
        data.forEach(claim => {
          state.entities[claim.id] = claim;
          state.ids.push(claim.id);
        });
        
        state.pagination.total = total;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch claims';
      })
      
      // Create claim
      .addCase(createClaim.fulfilled, (state, action) => {
        const claim = action.payload;
        state.entities[claim.id] = claim;
        state.ids.unshift(claim.id);
        state.pagination.total += 1;
      })
      
      // Update claim status
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        if (state.entities[id]) {
          state.entities[id] = { ...state.entities[id], ...updates };
        }
      })
      
      // Submit claim
      .addCase(submitClaim.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        if (state.entities[id]) {
          state.entities[id] = { ...state.entities[id], ...updates };
        }
      });
  },
});

export const { setFilters, clearFilters, setPage, clearError } = claimsSlice.actions;
export { claimsSlice };