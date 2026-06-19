/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';

// Views
import { LandingPage } from './LandingPage';
import { AuthPage } from './AuthPage';
import { OnboardingWizard } from './OnboardingWizard';
import { Dashboard } from './Dashboard';
import { Clients } from './Clients';
import { ClientDetail } from './ClientDetail';
import { TaskCalendar } from './TaskCalendar';
import { DocumentVault } from './DocumentVault';
import { RemindersHub } from './RemindersHub';
import { Reports } from './Reports';
import { Settings } from './Settings';

// Client Views
import { ClientDashboard } from './ClientDashboard';
import { ClientDocuments } from './ClientDocuments';
import { ClientTasks } from './ClientTasks';

// Layouts
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from './Toast';

export default function App() {
  const {
    currentUser,
    setCurrentUser,
    activeTab,
    setActiveTab,
    selectedClientId,
    setSelectedClientId,
    clients,
  } = useAppHelper();

  // Route control when not authenticated
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Sign out helper
  const handleSignOut = () => {
    setCurrentUser(null);
    setSelectedClientId(null);
    setActiveTab('dashboard');
    setShowAuthForm(false);
  };

  // 1. Unauthenticated workflow
  if (!currentUser) {
    if (showAuthForm) {
      return (
        <div className="w-full min-h-screen bg-white">
          <AuthPage onBackToLanding={() => setShowAuthForm(false)} />
          <ToastContainer />
        </div>
      );
    } else {
      return (
        <div className="w-full min-h-screen bg-white">
          <LandingPage
            onStartAuth={() => setShowAuthForm(true)}
            onGoToPortal={(hash: string) => {
              if (hash === '#/client') {
                // Log in as client_2 (Gupta Traders)
                const client2 = clients.find(c => c.id === 'client_2') || clients[0];
                setCurrentUser({
                  id: client2.id,
                  name: client2.contactPersonName,
                  firmName: client2.name,
                  email: client2.portalEmail,
                  phone: client2.phone,
                  city: client2.city,
                  state: client2.state,
                  plan: 'Starter',
                  planExpiresAt: '',
                  avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200',
                  caRegistrationNumber: '',
                  membershipCouncil: 'ICAI',
                  onboardingDone: true,
                  createdAt: client2.createdAt,
                  role: 'client',
                });
                setActiveTab('client_dashboard');
              } else {
                // Default to admin/CA portal logic
                setShowAuthForm(true);
              }
            }}
          />
          <ToastContainer />
        </div>
      );
    }
  }

  // 2. Client Portal Role workflow
  if (currentUser.role === 'client') {
    // Client tabs: client_dashboard, client_tasks, client_documents
    const renderClientContent = () => {
      switch (activeTab) {
        case 'client_dashboard':
          return <ClientDashboard />;
        case 'client_tasks':
          return <ClientTasks />;
        case 'client_documents':
          return <ClientDocuments />;
        default:
          return <ClientDashboard />;
      }
    };

    return (
      <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
        {/* Sidebar for client */}
        <Sidebar onSignOut={handleSignOut} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onSignOut={handleSignOut} />
          
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {renderClientContent()}
          </div>

          <MobileNav />
        </div>
        
        <ToastContainer />
      </div>
    );
  }

  // 3. CA Practitioner Workflow
  // If onboarding not done, show Wizard
  if (!currentUser.onboardingDone) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC]">
        <OnboardingWizard />
        <ToastContainer />
      </div>
    );
  }

  // Onboarding Done, CA Operational dashboard workspace
  const renderCaContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return selectedClientId ? <ClientDetail /> : <Clients />;
      case 'calendar':
        return <TaskCalendar />;
      case 'vault':
        return <DocumentVault />;
      case 'reminders':
        return <RemindersHub />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar for CA */}
      <Sidebar onSignOut={handleSignOut} />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onSignOut={handleSignOut} />

        <div className="flex-1 overflow-hidden flex flex-col relative">
          {renderCaContent()}
        </div>

        <MobileNav />
      </div>

      <ToastContainer />
    </div>
  );
}
