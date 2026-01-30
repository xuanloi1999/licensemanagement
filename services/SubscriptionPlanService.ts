import api from "../axios";

export interface SubscriptionPlanQuota {
  users: number;
  storage_gb: number;
  [key: string]: number; // Allow additional quota fields
}

export interface SubscriptionPlan {
  id: string | number;
  name: string;
  quota: SubscriptionPlanQuota;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  quota: SubscriptionPlanQuota;
}

export interface UpdateSubscriptionPlanPayload {
  name?: string;
  quota?: Partial<SubscriptionPlanQuota>;
}

export interface SubscriptionPlanListResponse {
  data: SubscriptionPlan[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface SubscriptionPlanResponse {
  data: SubscriptionPlan;
}

class SubscriptionPlanService {
  private readonly basePath = "/api/v1/subscription-plans";

  /**
   * List all subscription plans
   */
  list(params?: { limit?: number; offset?: number }) {
    return api.get<SubscriptionPlanListResponse>(this.basePath, { params });
  }

  /**
   * Get subscription plan by ID
   */
  getById(planId: string | number) {
    return api.get<SubscriptionPlanResponse>(`${this.basePath}/${planId}`);
  }

  /**
   * Create a new subscription plan
   * Requires authentication
   */
  create(payload: CreateSubscriptionPlanPayload) {
    return api.post<SubscriptionPlanResponse>(this.basePath, payload);
  }

  /**
   * Update an existing subscription plan
   * Requires authentication
   */
  update(planId: string | number, payload: UpdateSubscriptionPlanPayload) {
    return api.put<SubscriptionPlanResponse>(
      `${this.basePath}/${planId}`,
      payload
    );
  }

  /**
   * Delete a subscription plan
   * Requires authentication
   */
  delete(planId: string | number) {
    return api.delete(`${this.basePath}/${planId}`);
  }
}

export default new SubscriptionPlanService();
