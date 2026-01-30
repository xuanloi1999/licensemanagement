import api from "../axios";

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp?: string;
  services?: Record<string, "up" | "down">;
}

class HealthService {
  /**
   * Check API health status
   */
  check() {
    return api.get<HealthCheckResponse>("/health");
  }
}

export default new HealthService();
