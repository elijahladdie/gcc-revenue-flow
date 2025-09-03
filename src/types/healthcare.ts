// GCC Healthcare Revenue Cycle Management Types

export type CountryCode = 'SA' | 'UAE' | 'KW' | 'BH' | 'QA' | 'OM';
export type CurrencyCode = 'SAR' | 'AED' | 'KWD' | 'BHD' | 'QAR' | 'OMR';
export type Language = 'en' | 'ar';

export type MedicalHistoryItem = {
  condition?: string;
  diagnosis_date?: string;
  notes?: string;
}
export interface Patient {
  id: string;
  name: string;
  name_ar?: string;
  nationality: 'citizen' | 'expatriate' | 'visitor';
  insurance_type: string;
  eligibility_status: 'verified' | 'pending' | 'rejected' | 'new';
  country: CountryCode;
  date_of_birth: string;
  gender: 'male' | 'female';
  phone_number: string;
  email?: string;
  insurance_id: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medical_history?: MedicalHistoryItem[];
  createdAt: string;
  updatedAt: string;
}export interface Claim {
  procedure_modifiers: string | null; // nullable
  created_at: string; // ISO date string
  insurance_provider_id: string; // UUID
  charges: number; // was string, should be number
  updated_at: string; // ISO date string
  patient_id: string; // UUID
  place_of_service: string; // e.g., "hospital"
  id: string; // UUID
  patient_dob: string; // date string
  referring_provider_info: string | null; // nullable
  visit_id: string; // UUID
  insurance_policy_number: string;
  total_claim_charges: number; // was string, should be number
  pre_auth_id: string | null; // nullable
  relationship_to_subscriber: "self" | "spouse" | "child" | string; // better to use union + fallback
  denial_reason: string | null; // nullable
  patient_name: string;
  diagnosis: string[]; // array of strings
  status: "approved" | "denied" | "pending" | string; // union for known statuses
  procedures: string[]; // array of strings
  submission_date: string; // ISO date string
}
export interface PreAuthorization {
  id: string;
  request_type: string; // e.g., "Specialist Consultation"
  medical_justification: string;
  treatment_category: string; // e.g., "consultation"
  required_documents: string[];
  visit_id: string;
  requested_amount: number;
  submitted_documents: string[];
  currency: string; // e.g., "SAR"
  expected_approval_date: string; // ISO timestamp
  ai_recommendation: string; // e.g., "auto-approve"
  valid_until: string; // ISO timestamp
  confidence_score: number; // percentage (0–100)
  created_at: string; // ISO timestamp
  status: 'approved' | 'denied' | 'under-review' | 'submitted' | string; // expand as needed
  updated_at: string; // ISO timestamp
  patient_id: string;
  risk_factors: string[];
}


export interface FinancialRecord {
  id: string;
  claimId: string;
  patientId: string;
  type: 'payment' | 'refund' | 'adjustment' | 'writeoff';
  amount: number;
  currency: CurrencyCode;
  exchangeRate?: number;
  baseAmount?: number; // Amount in base currency (SAR)
  paymentMethod: 'insurance' | 'patient' | 'government' | 'bank-transfer';
  transactionId?: string;
  islamicCompliant: boolean;
  processingFee?: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processedDate?: string;
  reconciliationStatus: 'pending' | 'reconciled' | 'discrepancy';
  createdAt: string;
  updatedAt: string;
}

export interface DenialRecord {
  id: string;
  claimId: string;
  patientId: string;
  denialReason: string;
  denialCode: string;
  category: 'eligibility' | 'coverage' | 'medical-necessity' | 'documentation' | 'authorization';
  appealStatus: 'not-appealed' | 'appeal-submitted' | 'under-review' | 'upheld' | 'overturned';
  appealDeadline: string;
  aiSuggestedAction: 'appeal' | 'resubmit' | 'contact-patient' | 'write-off';
  appealProbability: number; // 0-100
  estimatedRecovery: number;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalPatients: number;
  activeClaims: number;
  pendingAuthorizations: number;
  monthlyRevenue: number;
  currency: CurrencyCode;
  claimApprovalRate: number;
  averageProcessingTime: number; // in days
  denialRate: number;
  appealSuccessRate: number;
  outstandingBalance: number;
  collectionRate: number;
  countryBreakdown: Record<CountryCode, {
    patients: number;
    claims: number;
    revenue: number;
  }>;
  insuranceBreakdown: Record<string, {
    claims: number;
    approvalRate: number;
    averageAmount: number;
  }>;
  monthlyTrends: {
    month: string;
    revenue: number;
    claims: number;
    approvals: number;
    denials: number;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'processor';
  country: CountryCode;
  department: string;
  permissions: string[];
  preferredLanguage: Language;
  lastLogin: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// Filter and Search Types
export interface PatientFilters {
  country?: CountryCode;
  nationality?: Patient['nationality'];
  insuranceType?: Patient['insurance_type'];
  eligibilityStatus?: Patient['eligibility_status'];
  search?: string;
}

export interface ClaimFilters {
  status?: Claim['status'];
  country?: CountryCode;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface PreAuthFilters {
  status?: PreAuthorization['status'];
  treatmentCategory?: PreAuthorization['treatment_category'];
  aiRecommendation?: PreAuthorization['ai_recommendation'];
  riskLevel?: 'low' | 'medium' | 'high';
  search?: string;
}
export interface Insurance {
  id: string;
  name: String;
  address: String;
  npi: String;
  tax_id: String;
  insurance_types: JSON;
  country: String;
  facility_type: String;
}