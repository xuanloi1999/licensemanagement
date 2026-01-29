
import { Organization, Plan, AuditLog } from './types';

// Master list of all available system capabilities for comparison
export const ALL_CAPABILITY_KEYS = [
  { key: 'access_control', label: 'Access Control' },
  { key: 'cyber_training', label: 'Cyber Training' },
  { key: 'live_battle', label: 'Live Battle' },
  { key: 'network_diagrams', label: 'Network Diagrams' },
  { key: 'traffic_generator', label: 'Traffic Generator' },
  { key: 'host_management', label: 'Host Management' },
  { key: 'incident_history', label: 'Incident History' },
  { key: 'api_sandbox', label: 'API Backend Sandbox' },
  { key: 'sso_oidc', label: 'Identity SSO (OIDC)' },
  { key: 'custom_branding', label: 'Custom Branding' },
];

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    description: 'Entry-level access for small development teams and internal experiments.',
    features: ['Single Project Context', 'Standard Labs', 'Community Support'],
    featureFlags: ALL_CAPABILITY_KEYS.map(cap => ({
      ...cap,
      enabled: ['access_control', 'network_diagrams'].includes(cap.key)
    })),
    defaultQuotas: { seats: 5, labs: 2, concurrency: 1 }
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Scaled resource allocation for growing organizations requiring priority infrastructure.',
    features: ['Unlimited Projects', 'Advanced Labs', 'Priority Support', 'Full API Access'],
    featureFlags: ALL_CAPABILITY_KEYS.map(cap => ({
      ...cap,
      enabled: ['access_control', 'cyber_training', 'network_diagrams', 'traffic_generator', 'api_sandbox', 'sso_oidc'].includes(cap.key)
    })),
    defaultQuotas: { seats: 50, labs: 20, concurrency: 10 }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Mission-critical tier with dedicated node support and absolute resource dominance.',
    features: ['Custom Labs Architecture', 'Dedicated Support Node', 'Custom Branding (Full)', 'Advanced Audit Export'],
    featureFlags: ALL_CAPABILITY_KEYS.map(cap => ({
      ...cap,
      enabled: true // All features unlocked
    })),
    defaultQuotas: { seats: 500, labs: 100, concurrency: 50 }
  }
];

export const MOCK_ORGS: Organization[] = [
  {
    id: 'ORG-001',
    name: 'Acme Corp',
    licenseKey: 'ACME-7722-A1B2-9900',
    status: 'active',
    planId: 'enterprise',
    expiryDate: '2025-12-31',
    quotas: {
      seats: { current: 420, total: 500 },
      labs: { current: 85, total: 100 },
      concurrency: { current: 12, total: 50 }
    }
  },
  {
    id: 'ORG-002',
    name: 'Globex IT',
    licenseKey: 'GLOB-1234-C3D4-5678',
    status: 'expired',
    planId: 'pro',
    expiryDate: '2024-01-15',
    quotas: {
      seats: { current: 50, total: 50 },
      labs: { current: 18, total: 20 },
      concurrency: { current: 2, total: 10 }
    }
  },
  {
    id: 'ORG-003',
    name: 'Umbrella Tech',
    licenseKey: 'UMBR-9988-E5F6-1122',
    status: 'suspended',
    planId: 'enterprise',
    expiryDate: '2026-06-30',
    quotas: {
      seats: { current: 120, total: 500 },
      labs: { current: 40, total: 100 },
      concurrency: { current: 5, total: 50 }
    }
  },
  {
    id: 'ORG-004',
    name: 'Stark Industries',
    licenseKey: 'IRON-4444-G7H8-3333',
    status: 'active',
    planId: 'pro',
    expiryDate: '2025-05-20',
    quotas: {
      seats: { current: 15, total: 50 },
      labs: { current: 5, total: 20 },
      concurrency: { current: 1, total: 10 }
    }
  }
];

export const MOCK_LOGS: AuditLog[] = [
  {
    id: 'LOG-1',
    actor: 'Admin John',
    action: 'Renew License',
    targetOrg: 'Acme Corp',
    timestamp: '2024-05-15 10:30:00',
    details: 'Extended expiry to 2025-12-31'
  },
  {
    id: 'LOG-2',
    actor: 'System',
    action: 'Auto Suspend',
    targetOrg: 'Umbrella Tech',
    timestamp: '2024-05-14 00:01:12',
    details: 'Billing failure - Stripe API error 402'
  },
  {
    id: 'LOG-3',
    actor: 'Admin Sarah',
    action: 'Upgrade Plan',
    targetOrg: 'Globex IT',
    timestamp: '2024-05-10 14:20:00',
    details: 'Upgraded from Free to Pro SLA profile'
  },
  {
    id: 'LOG-4',
    actor: 'Admin John',
    action: 'Quota Adjustment',
    targetOrg: 'Acme Corp',
    timestamp: '2024-04-20 09:15:33',
    details: 'Incremented seat count by 50 to accommodate new R&D hiring wave.'
  },
  {
    id: 'LOG-5',
    actor: 'System',
    action: 'License Provision',
    targetOrg: 'Stark Industries',
    timestamp: '2024-04-12 16:44:02',
    details: 'Initial deployment of Professional grid node for IRON-4444-G7H8-3333'
  },
  {
    id: 'LOG-6',
    actor: 'Security Bot',
    action: 'Integrity Check',
    targetOrg: 'Acme Corp',
    timestamp: '2024-04-01 03:00:00',
    details: 'Full grid node integrity audit completed. 0 vulnerabilities found.'
  },
  {
    id: 'LOG-7',
    actor: 'Admin Sarah',
    action: 'Key Regeneration',
    targetOrg: 'Umbrella Tech',
    timestamp: '2024-03-15 11:20:10',
    details: 'Regenerated AES-256 license key following internal security breach report.'
  },
  {
    id: 'LOG-8',
    actor: 'Admin John',
    action: 'SLA Modification',
    targetOrg: 'Acme Corp',
    timestamp: '2024-02-28 13:05:55',
    details: 'Enabled Traffic Generator and Cyber Training capability flags.'
  },
  {
    id: 'LOG-9',
    actor: 'Admin Sarah',
    action: 'Manual Override',
    targetOrg: 'Globex IT',
    timestamp: '2024-02-15 17:50:00',
    details: 'Forced license activation bypass for emergency maintenance window.'
  },
  {
    id: 'LOG-10',
    actor: 'System',
    action: 'Quota Warning',
    targetOrg: 'Acme Corp',
    timestamp: '2024-02-01 08:30:12',
    details: 'Utilization threshold reached (85% seats). Notification dispatched to authority email.'
  },
  {
    id: 'LOG-11',
    actor: 'Admin John',
    action: 'Revoke Access',
    targetOrg: 'Globex IT',
    timestamp: '2024-01-20 15:10:00',
    details: 'Temporary revocation of grid access due to suspicious outbound traffic patterns.'
  },
  {
    id: 'LOG-12',
    actor: 'Admin Sarah',
    action: 'Restore Access',
    targetOrg: 'Globex IT',
    timestamp: '2024-01-21 09:00:00',
    details: 'Access restored after verification of legitimate testing procedures.'
  }
];
