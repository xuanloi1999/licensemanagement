import api from "../axios";

export interface AuditLog {
  id: string | number;
  resource: string;
  action: string;
  actor: string;
  details?: Record<string, unknown>;
  timestamp: string;
  created_at?: string;
}

export interface AuditLogListParams {
  resource?: string;
  action?: string;
  actor?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  total?: number;
  limit?: number;
  offset?: number;
}

class AuditLogService {
  private readonly basePath = "/api/v1/audit-logs";

  /**
   * List audit logs with optional filtering
   */
  list(params?: AuditLogListParams) {
    // Remove empty/undefined params
    const cleanParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        )
      : undefined;

    return api.get<AuditLogListResponse>(this.basePath, {
      params: cleanParams,
    });
  }

  /**
   * Get audit logs by resource type
   */
  getByResource(
    resource: string,
    params?: Omit<AuditLogListParams, "resource">
  ) {
    return this.list({ ...params, resource });
  }

  /**
   * Get audit logs by action type
   */
  getByAction(action: string, params?: Omit<AuditLogListParams, "action">) {
    return this.list({ ...params, action });
  }

  /**
   * Get audit logs by actor
   */
  getByActor(actor: string, params?: Omit<AuditLogListParams, "actor">) {
    return this.list({ ...params, actor });
  }
}

export default new AuditLogService();
