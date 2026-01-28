
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrgDetail } from './pages/OrgDetail';
import { AdminPlans } from './pages/AdminPlans';
import { AdminLogs } from './pages/AdminLogs';
import { OrgPortal } from './pages/OrgPortal';
import { OrgUsage } from './pages/OrgUsage';
import { MOCK_ORGS } from './constants';
import { UserRole } from './types';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | 'none'>('none');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setActiveView('dashboard');
    // For portal, we default to the first org
    if (role === 'org_user') {
      setSelectedOrgId(MOCK_ORGS[0].id);
    }
  };

  const handleLogout = () => {
    setUserRole('none');
    setSelectedOrgId(null);
    setActiveView('dashboard');
  };

  if (userRole === 'none') {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // Admin Views
    if (userRole === 'admin') {
      if (activeView === 'org-detail' && selectedOrgId) {
        const org = MOCK_ORGS.find(o => o.id === selectedOrgId);
        return org ? <OrgDetail org={org} onBack={() => setActiveView('dashboard')} /> : null;
      }

      switch (activeView) {
        case 'dashboard': // This acts as "Organizations" list for Admin
          return <AdminDashboard onSelectOrg={(id) => { setSelectedOrgId(id); setActiveView('org-detail'); }} />;
        case 'plans':
          return <AdminPlans />;
        case 'logs':
          return <AdminLogs />;
        default:
          return <AdminDashboard onSelectOrg={(id) => { setSelectedOrgId(id); setActiveView('org-detail'); }} />;
      }
    }

    // Portal (Org User) Views
    if (userRole === 'org_user') {
      const org = MOCK_ORGS.find(o => o.id === selectedOrgId) || MOCK_ORGS[0];
      
      switch (activeView) {
        case 'dashboard':
          return <OrgPortal org={org} />;
        case 'usage':
          return <OrgUsage org={org} />;
        case 'activation':
          return <OrgPortal org={org} focusActivation={true} />;
        default:
          return <OrgPortal org={org} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white font-body selection:bg-primary/30">
      <Navbar 
        role={userRole === 'admin' ? 'admin' : 'org'} 
        onSwitchRole={(r) => { 
          const mappedRole = r === 'admin' ? 'admin' : 'org_user';
          setUserRole(mappedRole);
          if (mappedRole === 'org_user') setSelectedOrgId(MOCK_ORGS[0].id);
          setActiveView('dashboard');
        }} 
        onLogout={handleLogout} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          role={userRole} 
          activeView={activeView} 
          onNavigate={setActiveView} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <footer className="py-3 px-6 text-center text-neutral-600 text-[10px] border-t border-neutral-900 bg-background-darker/50 flex items-center justify-between">
        <p>© 2025 NovaLicense Enterprise v2.5.1</p>
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> All Systems Operational</span>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
