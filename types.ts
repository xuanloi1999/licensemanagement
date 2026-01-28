
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'pending';

export interface Quotas {
  seats: { current: number; total: number };
  labs: { current: number; total: number };
  concurrency: { current: number; total: number };
}

export interface Plan {
  id: string;
  name: string;
  features: string[];
  defaultQuotas: {
    seats: number;
    labs: number;
    concurrency: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  licenseKey: string;
  status: LicenseStatus;
  planId: string;
  expiryDate: string;
  quotas: Quotas;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  targetOrg: string;
  timestamp: string;
  details: string;
}

export type UserRole = 'admin' | 'org_user';
