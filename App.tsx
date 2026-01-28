
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrgDetail } from './pages/OrgDetail';
import { AdminPlans } from './pages/AdminPlans';
import { AdminLogs } from './pages/AdminLogs';
import { MOCK_ORGS } from './constants';
import { UserRole } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setActiveView('dashboard');
    setSelectedOrgId(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedOrgId(null);
    setActiveView('dashboard');
    setIsSidebarOpen(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeView === 'org-detail' && selectedOrgId) {
      const org = MOCK_ORGS.find(o => o.id === selectedOrgId);
      return org ? (
        <OrgDetail 
          org={org} 
          onBack={() => {
            setActiveView('dashboard');
            setSelectedOrgId(null);
          }} 
        />
      ) : (
        <div className="p-12 text-center text-neutral-500">Resource identifier mismatch. Returning to directory...</div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <AdminDashboard 
            onSelectOrg={(id) => { 
              setSelectedOrgId(id); 
              setActiveView('org-detail'); 
            }} 
          />
        );
      case 'plans':
        return <AdminPlans />;
      case 'logs':
        return <AdminLogs />;
      default:
        return <AdminDashboard onSelectOrg={(id) => { setSelectedOrgId(id); setActiveView('org-detail'); }} />;
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
          }} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar bg-background-darker/20">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
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
          <a href="#" className="hover:text-primary transition-colors">SUPPORT NODE</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
