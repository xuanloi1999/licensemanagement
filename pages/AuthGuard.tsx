import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = AuthService.isAuthenticated();

      if (!hasToken) {
        // Save current location for redirect after login
        const callbackUrl = encodeURIComponent(
          location.pathname + location.search
        );
        navigate(`/login?callback_url=${callbackUrl}`, { replace: true });
      } else {
        setIsAuthenticated(true);
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, location]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-800 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-sm font-medium">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
