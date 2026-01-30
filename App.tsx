import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { OrgDetail } from "./pages/OrgDetail";
import { AdminPlans } from "./pages/AdminPlans";
import { AdminLogs } from "./pages/AdminLogs";
import { UserRole, Organization } from "./types";
import AuthService from "./services/AuthService";
import OrganizationService from "./services/OrganizationService";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Organization state
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Fetch organization when selectedOrgId changes
  const fetchOrganization = useCallback(async (orgId: string) => {
    setIsLoadingOrg(true);
    setOrgError(null);

    try {
      const response = await OrganizationService.getById(orgId);
      const orgData = response.data.data;

      // Transform API response to match Organization type
      const org: Organization = {
        id: orgData.organization_id || orgData.id,
        name: orgData.organization_name || orgData.name,
        status: orgData.status || "active",
        planId: orgData.subscription_plan || "pro",
        licenseKey: orgData.license_key || "",
        expiryDate: orgData.expiry_date || "2025-12-31",
        quotas: orgData.quotas || {
          seats: { current: 0, total: 50 },
          labs: { current: 0, total: 10 },
          concurrency: { current: 0, total: 5 },
        },
      };

      setSelectedOrg(org);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load organization details.";
      setOrgError(errorMessage);
      console.error("Failed to fetch organization:", error);
    } finally {
      setIsLoadingOrg(false);
    }
  }, []);

  // Fetch org when navigating to org-detail
  useEffect(() => {
    if (activeView === "org-detail" && selectedOrgId) {
      fetchOrganization(selectedOrgId);
    } else {
      setSelectedOrg(null);
      setOrgError(null);
    }
  }, [activeView, selectedOrgId, fetchOrganization]);

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setActiveView("dashboard");
    setSelectedOrgId(null);

    // Handle callback URL redirect if present
    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get("callback_url");
    if (callbackUrl) {
      // Clear the URL params
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  const handleLogout = () => {
    // Clear auth data
    AuthService.logout();

    // Reset app state
    setIsLoggedIn(false);
    setSelectedOrgId(null);
    setSelectedOrg(null);
    setActiveView("dashboard");
    setIsSidebarOpen(false);
  };

  const handleSelectOrg = (id: string) => {
    setSelectedOrgId(id);
    setActiveView("org-detail");
  };

  const handleBackFromOrg = () => {
    setActiveView("dashboard");
    setSelectedOrgId(null);
    setSelectedOrg(null);
    setOrgError(null);
  };

  const handleOrgUpdate = (updatedOrg: Organization) => {
    setSelectedOrg(updatedOrg);
  };

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-primary-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 animate-pulse">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">
              Hack<span className="text-primary">Grid</span>
            </h1>
            <p className="text-neutral-500 text-xs uppercase tracking-widest">
              Initializing secure session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // Organization Detail View
    if (activeView === "org-detail" && selectedOrgId) {
      // Loading state
      if (isLoadingOrg) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-neutral-800 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-neutral-500 text-sm font-medium">
                Loading organization details...
              </p>
            </div>
          </div>
        );
      }

      // Error state
      if (orgError) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">
                Failed to load organization
              </h3>
              <p className="text-neutral-500 text-sm">{orgError}</p>
              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={handleBackFromOrg}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={() => fetchOrganization(selectedOrgId)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary-600 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Organization not found
      if (!selectedOrg) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">
                Organization not found
              </h3>
              <p className="text-neutral-500 text-sm">
                The requested organization could not be found or you don't have
                permission to view it.
              </p>
              <button
                onClick={handleBackFromOrg}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary text-white hover:bg-primary-600 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );
      }

      // Success - show org detail
      return (
        <OrgDetail
          org={selectedOrg}
          onBack={handleBackFromOrg}
          onUpdate={handleOrgUpdate}
        />
      );
    }

    // Other views
    switch (activeView) {
      case "dashboard":
        return <AdminDashboard onSelectOrg={handleSelectOrg} />;
      case "plans":
        return <AdminPlans />;
      case "logs":
        return <AdminLogs />;
      default:
        return <AdminDashboard onSelectOrg={handleSelectOrg} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-white font-body selection:bg-primary/30 overflow-hidden">
      <Navbar
        onLogout={handleLogout}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          activeView={activeView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={(view) => {
            setActiveView(view);
            setSelectedOrgId(null);
            setSelectedOrg(null);
          }}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar bg-background-darker/20">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      <footer className="hidden sm:flex py-2.5 px-8 text-[9px] uppercase font-bold tracking-[0.2em] border-t border-neutral-900 bg-background-darker items-center justify-between text-neutral-600 shrink-0">
        <div className="flex items-center gap-4">
          <p>© 2025 HACKGRID SYSTEMS</p>
          <div className="hidden md:block w-px h-3 bg-neutral-800"></div>
          <p className="hidden md:block">STABLE BUILD 3.0.1</p>
        </div>
        <div className="flex gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(30,185,128,0.6)]"></span>
            <span className="hidden xs:inline">ENCRYPTED LINK ACTIVE</span>
          </div>
          <a href="#" className="hover:text-primary transition-colors">
            SUPPORT NODE
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
