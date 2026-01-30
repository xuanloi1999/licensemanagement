import api from "../axios";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    user?: {
      id: string;
      username: string;
      role: string;
    };
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

class AuthService {
  private readonly basePath = "/api/v1/auth";
  private readonly userKey = "user";
  private readonly tokenKey = "access_token";

  /**
   * Login with username and password
   */
  login(payload: LoginPayload) {
    return api.post<LoginResponse>(`${this.basePath}/login`, payload);
  }

  /**
   * Change user password
   */
  changePassword(payload: ChangePasswordPayload) {
    return api.put(`${this.basePath}/password`, payload);
  }

  /**
   * Store user data in localStorage
   */
  setUser(user: LoginResponse["data"]) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    if (user.access_token) {
      localStorage.setItem(this.tokenKey, user.access_token);
    }
    return true;
  }

  /**
   * Get stored user data
   */
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get access token
   */
  getAccessToken(): string {
    return localStorage.getItem(this.tokenKey) || "";
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Clear user session
   */
  logout() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    window.location.href = "/login";
  }
}

export default new AuthService();
