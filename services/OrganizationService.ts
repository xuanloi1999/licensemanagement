import api from "../axios";

export interface Organization {
  id: string;
  organization_id: string;
  organization_name: string;
  subscription_plan: string;
  license_key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrganizationPayload {
  organization_id: string;
  organization_name: string;
  subscription_plan: string;
}

export interface OrganizationListResponse {
  data: Organization[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface OrganizationResponse {
  data: Organization;
}

class OrganizationService {
  private readonly basePath = "/api/v1/organizations";

  /**
   * Create a new organization
   * Requires authentication
   */
  create(payload: CreateOrganizationPayload) {
    return api.post<OrganizationResponse>(this.basePath, payload);
  }

  /**
   * List all organizations
   */
  list(params?: { limit?: number; offset?: number }) {
    return api.get<OrganizationListResponse>(this.basePath, { params });
  }

  /**
   * Get organization by ID
   */
  getById(organizationId: string) {
    return api.get<OrganizationResponse>(`${this.basePath}/${organizationId}`);
  }

  /**
   * Regenerate organization license key
   * Requires authentication
   */
  regenerateLicenseKey(organizationId: string) {
    return api.put<OrganizationResponse>(
      `${this.basePath}/${organizationId}/license-key`
    );
  }
}

export default new OrganizationService();
