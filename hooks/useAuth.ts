import { AuthService } from "../services";
import React, { useState } from "react";

/**
 * Hook to get current auth state
 */
export const useAuth = () => {
  const [user, setUser] = useState(AuthService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isAuthenticated()
  );

  const login = (userData: any) => {
    AuthService.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = () => {
    setUser(AuthService.getUser());
    setIsAuthenticated(AuthService.isAuthenticated());
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };
};
