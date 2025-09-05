import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/utils';
import { Claim, PreAuthorization } from '@/types/healthcare';


interface VisitState {
    visits: any[];
    claims: Claim[];
    preauths: PreAuthorization[];
    loading: boolean;
    error: string | null;
}

const initialState: VisitState = {
    visits: [],
    claims: [],
    preauths: [],
    loading: false,
    error: null,
};

// Fetch all visits
export const fetchVisits = createAsyncThunk('visit/fetchVisits', async () => {
    const response = await api.get('/visits/');
    return response.data.data;
});

// Fetch all claims
export const fetchClaims = createAsyncThunk('visit/fetchClaims', async () => {
    const response = await api.get('/claims/');
    return response.data.data;
});

// Fetch all pre-authorizations
export const fetchPreAuths = createAsyncThunk('visit/fetchPreAuths', async () => {
    const response = await api.get('/preauth/');
    return response.data.data;
});

// Create a new visit
export const createVisit = createAsyncThunk(
    'visit/createVisit',
    async (visitData: any) => {
        const response = await api.post('/visit/', visitData);
        return response.data.data;
    }
);

// Update an existing visit
export const updateVisit = createAsyncThunk(
    'visit/updateVisit',
    async ({ visitId, updateData }: { visitId: string; updateData: any }) => {
        console.log({visitId, updateData})
        const response = await api.put(`/visit/${visitId}/`, updateData);
        return response.data.data;
    }
);

const visitReducer = createSlice({
    name: 'visit',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch visits
            .addCase(fetchVisits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisits.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.visits = action.payload;
            })
            .addCase(fetchVisits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch visits';
            })

            // Fetch claims
            .addCase(fetchClaims.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClaims.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.claims = action.payload;
            })
            .addCase(fetchClaims.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch claims';
            })

            // Fetch pre-auths
            .addCase(fetchPreAuths.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPreAuths.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.preauths = action.payload;
            })
            .addCase(fetchPreAuths.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch pre-auths';
            })

            // Create visit
            .addCase(createVisit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVisit.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.visits.unshift(action.payload);
            })
            .addCase(createVisit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create visit';
            })

            // Update visit
            .addCase(updateVisit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisit.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const index = state.visits.findIndex(v => v.id === action.payload.id);
                if (index >= 0) state.visits[index] = action.payload;
            })
            .addCase(updateVisit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update visit';
            });
    },
});

export const { clearError } = visitReducer.actions;
export { visitReducer };
