// Mock data for GCC Healthcare Revenue Cycle Management

import { 
  Patient, 
  Claim, 
  PreAuthorization, 
  FinancialRecord, 
  DenialRecord, 
  Analytics 
} from '@/types/healthcare';

// Mock exchange rates (SAR as base)
export const exchangeRates = {
  SAR: 1.0,
  AED: 1.02,
  KWD: 0.083,
  BHD: 0.10,
  QAR: 0.96,
  OMR: 0.10
};

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'pat-001',
    name: 'Ahmed Al-Rashid',
    name_ar: 'أحمد الراشد',
    nationality: 'citizen',
    insurance_type: 'NPHIES',
    eligibility_status: 'verified',
    country: 'SA',
    date_of_birth: '1985-03-15',
    gender: 'male',
    phone_number: '+966501234567',
    email: 'ahmed.rashid@email.com',
    insurance_id: 'NPH-SA-001234',
    emergencyContact: {
      name: 'Fatima Al-Rashid',
      phone: '+966501234568',
      relationship: 'wife'
    },
    medical_history: ['Diabetes Type 2', 'Hypertension'],
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-20T10:15:00Z'
  },
  {
    id: 'pat-002',
    name: 'Sarah Johnson',
    nationality: 'expatriate',
    insurance_type: 'Private',
    eligibility_status: 'verified',
    country: 'UAE',
    date_of_birth: '1990-07-22',
    gender: 'female',
    phone_number: '+971501234567',
    email: 'sarah.johnson@email.com',
    insurance_id: 'PVT-UAE-5678',
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '+971501234568',
      relationship: 'husband'
    },
    medical_history: ['Asthma'],
    createdAt: '2024-01-10T09:45:00Z',
    updatedAt: '2024-01-18T14:20:00Z'
  },
  {
    id: 'pat-003',
    name: 'Mohammed Al-Kuwari',
    name_ar: 'محمد الكواري',
    nationality: 'citizen',
    insurance_type: 'Government',
    eligibility_status: 'pending',
    country: 'QA',
    date_of_birth: '1978-11-08',
    gender: 'male',
    phone_number: '+974501234567',
    email: 'mohammed.kuwari@email.com',
    insurance_id: 'GOV-QA-9012',
    medical_history: ['Cardiac Arrhythmia'],
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-22T16:30:00Z'
  },
  {
    id: 'pat-004',
    name: 'Aisha Al-Zahra',
    name_ar: 'عائشة الزهراء',
    nationality: 'citizen',
    insurance_type: 'CCHI',
    eligibility_status: 'verified',
    country: 'SA',
    date_of_birth: '1992-05-12',
    gender: 'female',
    phone_number: '+966501234569',
    email: 'aisha.zahra@email.com',
    insurance_id: 'CCH-SA-3456',
    medical_history: [],
    createdAt: '2024-01-18T13:15:00Z',
    updatedAt: '2024-01-25T09:45:00Z'
  }
];

// Mock Claims
export const mockClaims: Claim[] = [
  {
    id: 'clm-001',
    patientId: 'pat-001',
    amount: 12500,
    currency: 'SAR',
    status: 'approved',
    submissionDate: '2024-01-20T09:00:00Z',
    diagnosis: ['E11.9 - Type 2 diabetes mellitus without complications'],
    procedures: ['99213 - Office visit, established patient', '80048 - Basic metabolic panel'],
    providerId: 'prv-001',
    providerName: 'King Fahd Medical City',
    facilityType: 'hospital',
    urgencyLevel: 'routine',
    estimatedProcessingDays: 5,
    approvalDate: '2024-01-22T14:30:00Z',
    notes: 'Standard diabetes follow-up with lab work',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z'
  },
  {
    id: 'clm-002',
    patientId: 'pat-002',
    amount: 8750,
    currency: 'AED',
    status: 'under-review',
    submissionDate: '2024-01-22T11:30:00Z',
    diagnosis: ['J45.9 - Asthma, unspecified'],
    procedures: ['94010 - Spirometry', '99214 - Office visit, established patient'],
    providerId: 'prv-002',
    providerName: 'American Hospital Dubai',
    facilityType: 'hospital',
    urgencyLevel: 'urgent',
    estimatedProcessingDays: 3,
    notes: 'Asthma exacerbation requiring immediate attention',
    createdAt: '2024-01-22T11:30:00Z',
    updatedAt: '2024-01-23T16:45:00Z'
  },
  {
    id: 'clm-003',
    patientId: 'pat-003',
    amount: 15000,
    currency: 'QAR',
    status: 'denied',
    submissionDate: '2024-01-18T14:20:00Z',
    diagnosis: ['I48.91 - Unspecified atrial fibrillation'],
    procedures: ['93005 - Electrocardiogram, tracing only'],
    providerId: 'prv-003',
    providerName: 'Hamad Medical Corporation',
    facilityType: 'hospital',
    urgencyLevel: 'emergency',
    estimatedProcessingDays: 1,
    denialReason: 'Prior authorization required for specialized cardiac procedures',
    notes: 'Emergency cardiac evaluation',
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-19T10:15:00Z'
  },
  {
    id: 'clm-004',
    patientId: 'pat-004',
    amount: 3200,
    currency: 'SAR',
    status: 'submitted',
    submissionDate: '2024-01-25T10:15:00Z',
    diagnosis: ['Z00.00 - Encounter for general adult medical examination without abnormal findings'],
    procedures: ['99395 - Periodic comprehensive preventive medicine evaluation'],
    providerId: 'prv-004',
    providerName: 'Saudi German Hospital',
    facilityType: 'hospital',
    urgencyLevel: 'routine',
    estimatedProcessingDays: 7,
    notes: 'Annual health screening',
    createdAt: '2024-01-25T10:15:00Z',
    updatedAt: '2024-01-25T10:15:00Z'
  }
];

// Mock Pre-Authorizations
export const mockPreAuthorizations: PreAuthorization[] = [
  {
    id: 'pre-001',
    patientId: 'pat-001',
    requestType: 'Endocrinology Consultation',
    treatmentCategory: 'consultation',
    requestedAmount: 5000,
    currency: 'SAR',
    aiRecommendation: 'auto-approve',
    confidenceScore: 92,
    status: 'approved',
    riskFactors: ['Established patient', 'Standard follow-up'],
    medicalJustification: 'Diabetes management requires specialist consultation for insulin adjustment',
    requiredDocuments: ['Medical history', 'Recent lab results'],
    submittedDocuments: ['Medical history', 'Recent lab results'],
    expectedApprovalDate: '2024-01-26T12:00:00Z',
    validUntil: '2024-04-26T12:00:00Z',
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-01-26T12:00:00Z'
  },
  {
    id: 'pre-002',
    patientId: 'pat-002',
    requestType: 'MRI Chest Scan',
    treatmentCategory: 'imaging',
    requestedAmount: 15000,
    currency: 'AED',
    aiRecommendation: 'manual-review',
    confidenceScore: 67,
    status: 'pending',
    riskFactors: ['High-cost imaging', 'Recent similar procedure'],
    medicalJustification: 'Persistent respiratory symptoms requiring advanced imaging',
    requiredDocuments: ['Physician referral', 'X-ray results', 'Insurance pre-cert'],
    submittedDocuments: ['Physician referral', 'X-ray results'],
    expectedApprovalDate: '2024-01-28T15:00:00Z',
    validUntil: '2024-07-28T15:00:00Z',
    createdAt: '2024-01-24T14:45:00Z',
    updatedAt: '2024-01-25T11:20:00Z'
  },
  {
    id: 'pre-003',
    patientId: 'pat-003',
    requestType: 'Cardiac Catheterization',
    treatmentCategory: 'surgery',
    requestedAmount: 45000,
    currency: 'QAR',
    aiRecommendation: 'high-risk',
    confidenceScore: 34,
    status: 'pending',
    riskFactors: ['High-cost procedure', 'Patient history complications', 'Elective surgery'],
    medicalJustification: 'Diagnostic catheterization to evaluate coronary artery disease',
    requiredDocuments: ['Cardiologist referral', 'Echo results', 'Stress test', 'Insurance pre-auth'],
    submittedDocuments: ['Cardiologist referral', 'Echo results'],
    expectedApprovalDate: '2024-02-02T10:00:00Z',
    validUntil: '2024-08-02T10:00:00Z',
    createdAt: '2024-01-23T16:20:00Z',
    updatedAt: '2024-01-25T14:30:00Z'
  }
];

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalPatients: 15847,
  activeClaims: 1247,
  pendingAuthorizations: 89,
  monthlyRevenue: 2450000,
  currency: 'SAR',
  claimApprovalRate: 87.3,
  averageProcessingTime: 4.2,
  denialRate: 12.7,
  appealSuccessRate: 68.4,
  outstandingBalance: 125000,
  collectionRate: 94.2,
  countryBreakdown: {
    SA: { patients: 8920, claims: 1847, revenue: 1680000 },
    UAE: { patients: 3210, claims: 845, revenue: 950000 },
    QA: { patients: 1890, claims: 423, revenue: 485000 },
    KW: { patients: 1120, claims: 245, revenue: 280000 },
    BH: { patients: 498, claims: 134, revenue: 165000 },
    OM: { patients: 209, claims: 67, revenue: 89000 }
  },
  insuranceBreakdown: {
    'NPHIES': { claims: 1247, approvalRate: 91.2, averageAmount: 8950 },
    'CCHI': { claims: 892, approvalRate: 89.7, averageAmount: 12300 },
    'Private': { claims: 1568, approvalRate: 83.4, averageAmount: 15600 },
    'Government': { claims: 445, approvalRate: 94.1, averageAmount: 6780 }
  },
  monthlyTrends: [
    { month: '2024-01', revenue: 2450000, claims: 1247, approvals: 1089, denials: 158 },
    { month: '2023-12', revenue: 2380000, claims: 1198, approvals: 1052, denials: 146 },
    { month: '2023-11', revenue: 2290000, claims: 1156, approvals: 998, denials: 158 },
    { month: '2023-10', revenue: 2410000, claims: 1203, approvals: 1048, denials: 155 },
    { month: '2023-09', revenue: 2350000, claims: 1178, approvals: 1029, denials: 149 },
    { month: '2023-08', revenue: 2480000, claims: 1267, approvals: 1109, denials: 158 }
  ]
};

// Country and Currency mapping
export const countryInfo = {
  SA: { name: 'Saudi Arabia', name_ar: 'السعودية', currency: 'SAR', flag: '🇸🇦' },
  UAE: { name: 'United Arab Emirates', name_ar: 'الإمارات', currency: 'AED', flag: '🇦🇪' },
  QA: { name: 'Qatar', name_ar: 'قطر', currency: 'QAR', flag: '🇶🇦' },
  KW: { name: 'Kuwait', name_ar: 'الكويت', currency: 'KWD', flag: '🇰🇼' },
  BH: { name: 'Bahrain', name_ar: 'البحرين', currency: 'BHD', flag: '🇧🇭' },
  OM: { name: 'Oman', name_ar: 'عمان', currency: 'OMR', flag: '🇴🇲' }
};

// Insurance type information
export const insuranceInfo = {
  NPHIES: { name: 'NPHIES', description: 'National Platform for Health Information Exchange Services', country: 'SA' },
  CCHI: { name: 'CCHI', description: 'Council of Cooperative Health Insurance', country: 'SA' },
  Private: { name: 'Private Insurance', description: 'Private health insurance providers' },
  Government: { name: 'Government Insurance', description: 'Government-sponsored health insurance' }
};