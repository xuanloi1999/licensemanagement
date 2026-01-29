import api from "@/axios";
import type { Organization, Plan } from "../types";

export const licenseAPI = {
  getOrganizations: async (): Promise<Organization[]> => {
    const res = await api.get<Organization[]>("/organizations");
    return res.data;
  },

  getOrganization: async (id: string): Promise<Organization> => {
    const res = await api.get<Organization>(`/organizations/${id}`);
    return res.data;
  },

  renewLicense: async (
    orgId: string,
    payload: { expiresAt: string; planId?: string; quotas?: any }
  ) => {
    const res = await api.post(`/organizations/${orgId}/renew`, payload);
    return res.data;
  },

  activateLicense: async (key: string) => {
    const res = await api.post("/licenses/activate", { key });
    return res.data;
  },

  getPlans: async (): Promise<Plan[]> => {
    const res = await api.get<Plan[]>("/plans");
    return res.data;
  },
};
