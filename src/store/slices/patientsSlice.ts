// Patients Redux Slice

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Patient, PatientFilters } from '@/types/healthcare';
import { mockPatients } from '@/data/mockData';

interface PatientsState {
  entities: Record<string, Patient>;
  ids: string[];
  loading: boolean;
  error: string | null;
  filters: PatientFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: PatientsState = {
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
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (filters: PatientFilters = {}) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredPatients = [...mockPatients];
    
    // Apply filters
    if (filters.country) {
      filteredPatients = filteredPatients.filter(p => p.country === filters.country);
    }
    if (filters.nationality) {
      filteredPatients = filteredPatients.filter(p => p.nationality === filters.nationality);
    }
    if (filters.insuranceType) {
      filteredPatients = filteredPatients.filter(p => p.insuranceType === filters.insuranceType);
    }
    if (filters.eligibilityStatus) {
      filteredPatients = filteredPatients.filter(p => p.eligibilityStatus === filters.eligibilityStatus);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPatients = filteredPatients.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm) ||
        p.insuranceId.toLowerCase().includes(searchTerm)
      );
    }
    
    return {
      data: filteredPatients,
      total: filteredPatients.length,
    };
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newPatient;
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, updates }: { id: string; updates: Partial<Patient> }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id,
      updates: {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    };
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return id;
  }
);

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PatientFilters>) => {
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
      // Fetch patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        const { data, total } = action.payload;
        
        // Normalize data
        state.entities = {};
        state.ids = [];
        data.forEach(patient => {
          state.entities[patient.id] = patient;
          state.ids.push(patient.id);
        });
        
        state.pagination.total = total;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      
      // Create patient
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        const patient = action.payload;
        state.entities[patient.id] = patient;
        state.ids.unshift(patient.id);
        state.pagination.total += 1;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create patient';
      })
      
      // Update patient
      .addCase(updatePatient.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        if (state.entities[id]) {
          state.entities[id] = { ...state.entities[id], ...updates };
        }
      })
      
      // Delete patient
      .addCase(deletePatient.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.entities[id];
        state.ids = state.ids.filter(patientId => patientId !== id);
        state.pagination.total -= 1;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearError } = patientsSlice.actions;
export { patientsSlice };