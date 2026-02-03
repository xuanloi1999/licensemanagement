import { Organization, Plan, AuditLog } from "./types";

// Master list of all available system capabilities for comparison
export const ALL_CAPABILITY_KEYS = [
  { key: "access_control", label: "Access Control" },
  { key: "cyber_training", label: "Cyber Training" },
  { key: "live_battle", label: "Live Battle" },
  { key: "network_diagrams", label: "Network Diagrams" },
  { key: "traffic_generator", label: "Traffic Generator" },
  { key: "host_management", label: "Host Management" },
  { key: "incident_history", label: "Incident History" },
  { key: "api_sandbox", label: "API Backend Sandbox" },
  { key: "sso_oidc", label: "Identity SSO (OIDC)" },
  { key: "custom_branding", label: "Custom Branding" },
];
