import api from "../axios";

export interface GenerateLicenseKeyPayload {
  organization_id: string;
}

export interface GenerateLicenseKeyResponse {
  data: {
    license_key: string;
    organization_id: string;
    generated_at: string;
  };
}

class LicenseGeneratorService {
  private readonly basePath = "/api/v1/generator";

  /**
   * Generate a license key for an organization
   * Note: This does not update the database
   * Requires authentication
   */
  generateLicenseKey(payload: GenerateLicenseKeyPayload) {
    return api.post<GenerateLicenseKeyResponse>(
      `${this.basePath}/license-key`,
      payload
    );
  }
}

export default new LicenseGeneratorService();
