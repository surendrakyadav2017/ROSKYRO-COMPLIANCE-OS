/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { Button } from './Button';

interface AuthPageProps {
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBackToLanding }) => {
  const { setCurrentUser, showToast } = useAppHelper();
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('surendrakyadav2017@gmail.com');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up inputs
  const [suName, setSuName] = useState('');
  const [suFirm, setSuFirm] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suCity, setSuCity] = useState('');
  const [suReg, setSuReg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInEmail || !signInPassword) {
      showToast('Error: Please fill in all fields', 'error');
      return;
    }

    // Sign in CA with credentials
    const dummyCAUser = {
      id: 'ca_user_1',
      name: signInEmail === 'surendrakyadav2017@gmail.com' ? 'Surendra K. Yadav' : signInEmail.split('@')[0],
      firmName: signInEmail === 'surendrakyadav2017@gmail.com' ? 'Yadav & Associates' : 'My CA Firm',
      email: signInEmail,
      phone: '+91 98765 43210',
      city: 'Mumbai',
      state: 'Maharashtra',
      plan: 'Starter' as const,
      planExpiresAt: '2027-06-18',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200',
      caRegistrationNumber: 'FRN-402831',
      membershipCouncil: 'ICAI' as const,
      onboardingDone: true, // If default is signed in, onboarding is complete!
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(dummyCAUser);
    showToast('Welcome back to ROSKYRO!', 'success');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!suName || !suFirm || !suEmail || !suPhone) {
      showToast('Error: Please complete required fields', 'error');
      return;
    }

    const newCAUser = {
      id: `ca_user_${Date.now()}`,
      name: suName,
      firmName: suFirm,
      email: suEmail,
      phone: suPhone,
      city: suCity || 'Mumbai',
      state: 'Maharashtra',
      plan: 'Starter' as const, // Start on Starter plan (up to 5 clients)
      planExpiresAt: '2027-06-18',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200',
      caRegistrationNumber: suReg || `FRN-${Math.floor(100000 + Math.random() * 900000)}`,
      membershipCouncil: 'ICAI' as const,
      onboardingDone: false, // Forces App to show the OnboardingWizard!
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newCAUser);
    showToast('Account registered! Starting first-time onboard wizard.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h3
          onClick={onBackToLanding}
          className="text-center text-3xl font-extrabold text-slate-800 font-display cursor-pointer hover:opacity-85"
        >
          ROSKYRO <span className="text-[#1E3A5F]">Compliance-OS</span>
        </h3>
        <p className="mt-2 text-center text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          CA Practitioner Login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 rounded-2xl border border-slate-200/80 shadow-xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-4 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 text-center py-2 text-sm font-bold border-b-2 cursor-pointer ${
                !isSignUp
                  ? 'border-[#1E3A5F] text-[#1E3A5F]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 text-center py-2 text-sm font-bold border-b-2 cursor-pointer ${
                isSignUp
                  ? 'border-[#1E3A5F] text-[#1E3A5F]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Register Practice
            </button>
          </div>

          {!isSignUp ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  CA Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={e => setSignInEmail(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
                <p className="mt-1.5 text-[10px] text-slate-400 font-medium">
                  We preloaded demo practitioner details. Click sign in below to use them.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full font-bold">
                  Enter Practice Workspace
                </Button>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={suName}
                    onChange={e => setSuName(e.target.value)}
                    placeholder="e.g. Rajat Shah"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    CA Firm Name
                  </label>
                  <input
                    type="text"
                    required
                    value={suFirm}
                    onChange={e => setSuFirm(e.target.value)}
                    placeholder="e.g. Shah & Co"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  CA Email Address
                </label>
                <input
                  type="email"
                  required
                  value={suEmail}
                  onChange={e => setSuEmail(e.target.value)}
                  placeholder="e.g. rajat@shahco.in"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={suPhone}
                    onChange={e => setSuPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={suCity}
                    onChange={e => setSuCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  ICAI Registration (FRN / MRN)
                </label>
                <input
                  type="text"
                  value={suReg}
                  onChange={e => setSuReg(e.target.value)}
                  placeholder="e.g. FRN-128421"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="accent" className="w-full font-bold">
                  Register Practice Firm
                </Button>
              </div>
            </form>
          )}

          <div className="mt-5 pt-3.5 border-t border-slate-100 text-center">
            <button
              onClick={onBackToLanding}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              ← Back to Main Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
