/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { ShieldCheck, ArrowRight, CheckCircle2, UserPlus, Info } from 'lucide-react';
import { ClientType } from './types';
import { CLIENT_TYPES, INDIAN_STATES } from './constants';

export const OnboardingWizard: React.FC = () => {
  const { currentUser, setCurrentUser, addClient, clients, tasks, showToast, setActiveTab } = useAppHelper();
  const [step, setStep] = useState(1);

  // Step 1: Practice details
  const [firmName, setFirmName] = useState(currentUser?.firmName || '');
  const [caName, setCaName] = useState(currentUser?.name || '');
  const [icaiNum, setIcaiNum] = useState(currentUser?.caRegistrationNumber || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || 'Maharashtra');
  const [plan, setPlan] = useState<'Starter' | 'Growth' | 'Pro'>(currentUser?.plan || 'Starter');

  // Step 2: Add first client details
  const [clientName, setClientName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [clientType, setClientType] = useState<ClientType>('Private Limited');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const plans = [
    {
      id: 'Starter' as const,
      name: 'Starter Plan',
      price: '₹999/mo',
      limit: 'Max 5 Clients',
      features: ['Auto compliance files', 'Google Drive upload', 'WhatsApp friendly nudges', 'Core Reporting'],
    },
    {
      id: 'Growth' as const,
      name: 'Growth Plan',
      price: '₹2,499/mo',
      limit: 'Max 25 Clients',
      features: ['Everything in Starter', 'Client Portal access', 'Multiple Team Members', 'Reports Export CSV'],
    },
    {
      id: 'Pro' as const,
      name: 'Pro Plan',
      price: '₹4,999/mo',
      limit: 'Unlimited Clients',
      features: ['Everything in Growth', 'Priority API keys', 'Custom firm branding', 'Automated backup logs'],
    },
  ];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName || !caName || !icaiNum) {
      showToast('Error: Please complete mandatory fields.', 'error');
      return;
    }

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        firmName,
        name: caName,
        caRegistrationNumber: icaiNum,
        city,
        state,
        plan,
      });
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // GSTIN simple live character length validation
    if (gstin && gstin.length !== 15) {
      showToast('Error: Indian GSTIN must be exactly 15 alphanumeric characters.', 'error');
      return;
    }

    if (!clientName || !phone || !email) {
      showToast('Error: Please complete Client Name, Phone, and Email.', 'error');
      return;
    }

    // Add first client with default empty values
    addClient({
      name: clientName,
      tradeName: tradeName || clientName,
      type: clientType,
      gstin: gstin || '27AAACG' + Math.floor(1000 + Math.random() * 9000) + 'A1Z' + Math.floor(1 + Math.random() * 9),
      pan: gstin ? gstin.substring(2, 12) : 'AABCS' + Math.floor(1000 + Math.random() * 9000) + 'K',
      tan: 'MUMS' + Math.floor(10000 + Math.random() * 90000) + 'A',
      phone,
      email,
      contactPersonName: clientName.split(' ')[0],
      address: 'Industrial Plot 44, Midc Area',
      city: city || 'Mumbai',
      state: state || 'Maharashtra',
      pincode: '400013',
      incorporationDate: '2020-04-01',
      financialYearEnd: 'March',
      gstRegistrationDate: '2020-05-01',
      gstReturnType: 'Monthly',
      status: 'active',
      complianceScore: 100,
      totalSavedPenalty: 0,
      notes: 'Initial client added during onboarding setup.',
      tags: ['onboarding', 'new-client'],
      reminderEnabled: true,
      reminderChannels: ['email'],
      reminderDays: [7, 3, 1, 0],
      portalAccessEnabled: true,
      portalEmail: email,
      portalPasswordHash: 'client123',
      lastActivityAt: new Date().toISOString(),
    });

    setStep(3);
  };

  const handleSkipClient = () => {
    setStep(3);
  };

  const handleCompleteOnboarding = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        onboardingDone: true,
      });
    }
    showToast('Practice OS workspace is fully operational! Welcome aboard.', 'success');
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-8 font-sans flex flex-col justify-center select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-[#1E3A5F] font-display">
          Yadav & Associates Compliance-OS
        </h2>
        <p className="mt-1 text-sm text-slate-400 font-semibold font-mono uppercase tracking-wider">
          Practice Setup Assistant • Step {step} of 3
        </p>

        {/* Progress horizontal steps indicator */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className={`w-16 h-1.5 rounded-full ${step >= 1 ? 'bg-[#1E3A5F]' : 'bg-slate-200'}`} />
          <div className={`w-16 h-1.5 rounded-full ${step >= 2 ? 'bg-[#1E3A5F]' : 'bg-slate-200'}`} />
          <div className={`w-16 h-1.5 rounded-full ${step >= 3 ? 'bg-[#1E3A5F]' : 'bg-slate-200'}`} />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-8">
          {step === 1 && (
            /* Step 1: Profile and Plan Setup */
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Let's set up your practice
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete your master profile details to generate custom client reminders.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Name (CA Practitioner) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={caName}
                    onChange={e => setCaName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    CA Firm Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={e => setFirmName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    ICAI FRN / MRN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={icaiNum}
                    onChange={e => setIcaiNum(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Plans section */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Select Billing Subscription Tier
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setPlan(p.id)}
                      className={`border p-4 rounded-xl cursor-pointer text-left flex flex-col justify-between transition-all ${
                        plan === p.id
                          ? 'border-[#1E3A5F] ring-2 ring-[#1E3A5F]/15 bg-[#1E3A5F]/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{p.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded-md font-bold">
                            {p.limit}
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-[#1E3A5F] font-mono mt-1.5">
                          {p.price}
                        </p>
                      </div>
                      <ul className="mt-4 space-y-1 text-[10px] text-slate-500 font-semibold leading-normal">
                        {p.features.map(f => (
                          <li key={f} className="flex items-center gap-1">
                            <span className="text-emerald-600 font-extrabold">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-end">
                <Button type="submit" className="flex items-center gap-1.5 font-bold">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            /* Step 2: Add First Client */
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Step 2: Add Your First Client Account
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ROSKYRO will instantly auto-generate 18-24 recurring legal compliance calendars.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSkipClient}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 cursor-pointer"
                >
                  Skip client for now
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Official Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Verma Logistics Pvt Ltd"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Trade / Display Name
                  </label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={e => setTradeName(e.target.value)}
                    placeholder="e.g. Verma Cargo Services"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Client Legal Entity Type
                  </label>
                  <select
                    value={clientType}
                    onChange={e => setClientType(e.target.value as ClientType)}
                    className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  >
                    {CLIENT_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    GSTIN Monospace Monolith
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={e => setGstin(e.target.value.toUpperCase())}
                    maxLength={15}
                    placeholder="15 Characters (e.g. 27AABCS1234A1Z5)"
                    className="w-full text-xs font-bold font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Primary Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 993..."
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Client Primary Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. contact@vermacargo.co.in"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  ← Back to Step 1
                </Button>
                <Button type="submit" variant="accent" className="flex items-center gap-1.5 font-bold">
                  <UserPlus className="w-4 h-4" />
                  <span>Generate Calendar & Continue</span>
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            /* Step 3: Complete / Summary and Dashboard Launcher */
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-10 h-10 text-[#0F766E]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1E3A5F] font-display">
                  Your Workspace is Ready!
                </h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Practice master databases and cloud triggers are completely provisioned.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200/50 p-6 text-left max-w-lg mx-auto space-y-3.5">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">
                  Setup Provision Summary
                </h4>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-slate-600 font-semibold font-sans">
                  <div>Practice Name</div>
                  <div className="font-bold text-[#1E3A5F] text-right">{firmName}</div>

                  <div>Assigned Plan Billing</div>
                  <div className="font-bold text-emerald-700 text-right">{plan} Tier (Active)</div>

                  <div>Clients Connected</div>
                  <div className="font-bold text-slate-800 text-right font-mono">
                    {clients.length} Master Accounts
                  </div>

                  <div>Compliance Calendar Items</div>
                  <div className="font-extrabold text-slate-800 text-right font-mono text-[#F97316]">
                    {tasks.length} Automated Tracks
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 max-w-lg mx-auto">
                <Button onClick={handleCompleteOnboarding} className="w-full font-bold flex items-center justify-center gap-2 py-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Open Operational Dashboard</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
