import api from "../axios";

class AuthService {
  apiPath = "";
  userKey = "user";
  constructor() {
    if (true) {
      this.apiPath = "/admin";
    }
  }
  login(payload) {
    return api.post(this.apiPath + "/auth/login", payload);
  }
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return true;
  }
  getUser() {
    return JSON.parse(localStorage.getItem(this.userKey));
  }
  getAccessToken() {
    const user = this.getUser();
    return user ? user.access_token : "";
  }
  getUserId() {
    const user = this.getUser();
    return user ? user.id : "";
  }
  getPermission() {
    const user = this.getUser();
    return user ? user.permission : [];
  }
  getVendorId() {
    const user = this.getUser();
    return user ? user.vendor_id : [];
  }
  check() {
    return !!this.getUser();
  }
  clearUser() {
    localStorage.removeItem(this.userKey);
  }
  logout() {
    api
      .post(this.apiPath + "/auth/logout")
      .then(() => {
        localStorage.removeItem(this.userKey);
        window.location.href =
          "/login?callback_url=" + encodeURI(window.location.href);
        // window.location.assign("/login");
      })
      .finally(() => {
        localStorage.removeItem(this.userKey);
        window.location.href =
          "/login?callback_url=" + encodeURI(window.location.href);
        // window.location.assign("/login");
      });
    return true;
  }
  changePassword(payload) {
    return api.post(this.apiPath + "/auth/change-pass", payload);
  }
  sendResetPasswordLink(payload) {
    return api.post(this.apiPath + "/auth/send-reset-password", payload);
  }
  resetPassword(payload) {
    return api.put(this.apiPath + "/auth/reset-password", payload);
  }
  updateProfile(data) {
    return api.put(this.apiPath + "/auth/update-profile", data);
  }
}
export default new AuthService();
