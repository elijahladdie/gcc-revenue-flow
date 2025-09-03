import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CountryCode, Patient, PatientFilters } from '@/types/healthcare';
import api from '@/lib/utils';
import { toast } from 'sonner';

interface PatientsState {
  entities: Record<string, Patient>;
  patients: Patient[];
  ids: string[];
  loading: boolean;
  error: string | null;
  insurances: { id: string; name: string; insurance_types: string[], country: CountryCode; }[];
  filters: PatientFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: PatientsState = {
  entities: {},
  patients: [],
  insurances: [],
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

// ---------- Async Thunks ----------

// Fetch patients from FastAPI
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (filters: PatientFilters = {}) => {
    const res = await api.get('/patients/');
    const patients: Patient[] = res.data?.data || [];

    // Apply filters client-side if backend doesn’t support them yet
    let filteredPatients = [...patients];
    if (filters.country) {
      filteredPatients = filteredPatients.filter(p => p.country === filters.country);
    }
    if (filters.nationality) {
      filteredPatients = filteredPatients.filter(p => p.nationality === filters.nationality);
    }
    if (filters.insuranceType) {
      filteredPatients = filteredPatients.filter(p => p.insurance_type === filters.insuranceType);
    }
    if (filters.eligibilityStatus) {
      filteredPatients = filteredPatients.filter(p => p.eligibility_status === filters.eligibilityStatus);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPatients = filteredPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm) ||
        p.insurance_id.toLowerCase().includes(searchTerm)
      );
    }

    return {
      data: filteredPatients,
      total: filteredPatients.length,
    };
  }
);

export const fetchInsurances = createAsyncThunk(
  'patients/fetchInsurances',
  async () => {
    const res = await api.get('/insurances/');
    return res.data?.data || [];
  }
);


// Create new patient via FastAPI
export const createPatient = createAsyncThunk<
  Patient, // returned value
  Partial<Patient>, // argument type
  { rejectValue: string } // rejected payload
>(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const res = await api.post('/patients/', patientData);
      return res.data.data;
    } catch (error: any) {
      // Check if backend responded with known validation error
      if (error.response?.data?.resp_code === 400) {
        toast.error(error.response.data.resp_msg); // show toast to client
        return rejectWithValue(error.response.data.resp_msg);
      }
      // fallback for other errors
      toast.error('Failed to create patient.');
      return rejectWithValue('Failed to create patient.');
    }
  }
);

// Update patient (FastAPI doesn’t expose PUT yet → we'll call /visit or later /patients/:id)
export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, updates }: { id: string; updates: Partial<Patient> }) => {
    const res = await api.put(`/patients/${id}`, updates); 
    return {
      id,
      updates: res.data.data,
    };
  }
);

// Delete patient (not in FastAPI yet → just remove from state)
export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id: string) => {
    await api.delete(`/patients/${id}`); // Only works if implemented
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
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        const { data, total } = action.payload;

        state.entities = {};
        state.patients = data
        // = [];
        // data.forEach(patient => {
        //   state.entities[patient.id] = patient;
        //   state.ids.push(patient.id);
        // });

        state.pagination.total = total;
      })
      .addCase(fetchInsurances.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInsurances.fulfilled, (state, action) => {
        state.loading = false;
        state.insurances = action.payload;
      })
      .addCase(fetchInsurances.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch insurances'; })

      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        const patient = action.payload;
        state.entities[patient.id] = patient;
        state.ids.unshift(patient.id);
        state.pagination.total += 1;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        if (state.entities[id]) {
          state.entities[id] = { ...state.entities[id], ...updates };
        }
      })
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
