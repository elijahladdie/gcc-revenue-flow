// GCC Healthcare Revenue Cycle Management Types

export type CountryCode = 'SA' | 'UAE' | 'KW' | 'BH' | 'QA' | 'OM';
export type CurrencyCode = 'SAR' | 'AED' | 'KWD' | 'BHD' | 'QAR' | 'OMR';
export type Language = 'en' | 'ar';

export interface Patient {
  id: string;
  name: string;
  nameAr?: string;
  nationality: 'citizen' | 'expatriate' | 'visitor';
  insuranceType: 'CCHI' | 'NPHIES' | 'Private' | 'Government';
  eligibilityStatus: 'verified' | 'pending' | 'rejected';
  country: CountryCode;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  email?: string;
  insuranceId: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  patientId: string;
  amount: number;
  currency: CurrencyCode;
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'denied' | 'pending-payment' | 'paid';
  submissionDate: string;
  diagnosis: string[];
  procedures: string[];
  providerId: string;
  providerName: string;
  facilityType: 'hospital' | 'clinic' | 'pharmacy' | 'lab' | 'imaging';
  urgencyLevel: 'emergency' | 'urgent' | 'routine';
  estimatedProcessingDays: number;
  denialReason?: string;
  approvalDate?: string;
  paymentDate?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PreAuthorization {
  id: string;
  patientId: string;
  requestType: string;
  treatmentCategory: 'surgery' | 'medication' | 'imaging' | 'therapy' | 'consultation';
  requestedAmount: number;
  currency: CurrencyCode;
  aiRecommendation: 'auto-approve' | 'manual-review' | 'high-risk';
  confidenceScore: number; // 0-100
  status: 'pending' | 'approved' | 'denied' | 'expired';
  riskFactors: string[];
  medicalJustification: string;
  requiredDocuments: string[];
  submittedDocuments: string[];
  expectedApprovalDate: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
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
  insuranceType?: Patient['insuranceType'];
  eligibilityStatus?: Patient['eligibilityStatus'];
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
  facilityType?: Claim['facilityType'];
  urgencyLevel?: Claim['urgencyLevel'];
  search?: string;
}

export interface PreAuthFilters {
  status?: PreAuthorization['status'];
  treatmentCategory?: PreAuthorization['treatmentCategory'];
  aiRecommendation?: PreAuthorization['aiRecommendation'];
  riskLevel?: 'low' | 'medium' | 'high';
  search?: string;
}