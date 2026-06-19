/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Sparkles, TrendingUp, CheckSquare, Users, Globe, ExternalLink } from 'lucide-react';
import { formatINR } from './utils';

interface LandingPageProps {
  onStartAuth: () => void;
  onGoToPortal: (hash: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAuth, onGoToPortal }) => {
  const [calcClients, setCalcClients] = useState(3);
  const [calcOverdue, setCalcOverdue] = useState(2);

  // ROI math: average penalty is Rs. 100/day. Let's assume average delay is 15 days of 4 missed deadlines/yr.
  // Formula: clients * missedFilings * avgDaysLate * penaltyPerDay
  const estimatedPenalties = calcClients * calcOverdue * 18 * 120; // 120 avg penalty rate

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans select-none">
      {/* Navbar header */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-xs justify-items-stretch">
        <div className="flex items-center gap-3">
          <div className="bg-[#1E3A5F] text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold font-display text-2xl tracking-normal shadow-md">
            R
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-900 tracking-wide">
              ROSKYRO
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider font-extrabold">
              Compliance-OS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onGoToPortal('#/admin')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer"
          >
            SuperAdmin Login
          </button>
          <button
            onClick={() => onGoToPortal('#/client')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3.5 py-1.5 transition-colors cursor-pointer"
          >
            Client Portal Sign-In
          </button>
          <button
            onClick={onStartAuth}
            className="px-5 py-2.5 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#152a45] text-sm font-semibold transition-all cursor-pointer"
          >
            CA Practice Workspace
          </button>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-20 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 flex-1">
        <div className="flex-1 text-left flex flex-col gap-6">
          <span className="bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide w-fit flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            Unicorn-Ready & Day-1 Revenue Generation for Indian CAs
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold font-display leading-[1.1] tracking-tight text-slate-900">
            The operating system for every <span className="text-[#1E3A5F]">Chartered Accountant</span> in India.
          </h2>
          <p className="text-base text-slate-500 max-w-xl font-medium leading-relaxed">
            Notion meets TallyPrime meets Stripe. Manage client filings, secure a private cloud document vault, broadcast instant WhatsApp reminders, and offer white-labeled client self-service portals.
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={onStartAuth}
              className="px-7 py-3.5 bg-[#1E3A5F] text-white hover:bg-[#152a45] rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => onGoToPortal('#/client')}
              className="px-7 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Demo Customer Portal</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* ROI Penalty Savings Calculator Widget */}
        <div className="w-full lg:w-[450px] bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-6 relative">
          <div className="absolute top-4 right-4 bg-[#0F766E]/10 text-[#0F766E] text-[10px] font-bold px-2 py-0.5 rounded-full">
            ROI Tracker tool
          </div>
          <h3 className="text-base font-bold font-display text-slate-800 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#F97316]" />
            Justify Your Spend Instantly
          </h3>

          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Number of Active Clients</span>
                <span className="font-mono text-[#1E3A5F]">{calcClients}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={calcClients}
                onChange={e => setCalcClients(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Missed / Late Filings per Client / Year</span>
                <span className="font-mono text-[#1E3A5F]">{calcOverdue}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={calcOverdue}
                onChange={e => setCalcOverdue(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
              />
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-2 text-center flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                Estimated Penalty Savings / Year
              </span>
              <span className="text-2xl font-extrabold font-mono text-[#0F766E]">
                {formatINR(estimatedPenalties)}
              </span>
              <p className="text-[10px] text-slate-400 font-medium">
                Calculated on typical Indian GST, ROC compliance penalty averages of ₹50-₹200/day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="bg-white border-t border-slate-200 py-16 px-8 select-none">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <h3 className="text-xl font-bold font-display text-slate-900 text-center tracking-tight">
            Crafted for Chartered Accountants Who Think Like Founders
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
              <CheckSquare className="w-10 h-10 text-[#F97316] mb-4" />
              <h4 className="text-base font-bold text-slate-800 mb-2">
                Auto-Compliance Calendar
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Generate tailored compliance calendars matching organization structures (Private Ltd, LLP, Doctors, Retailers, Restaurants). Custom due dates tracked in list or calendar grids.
              </p>
            </div>

            <div className="border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
              <Users className="w-10 h-10 text-[#1E3A5F] mb-4" />
              <h4 className="text-base font-bold text-slate-800 mb-2">
                White-Labeled Portal
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Engage clients with a premium banking-grade client self-service portal. Let clients log in securely, download certificates, see active filings, and complete checklist actions directly.
              </p>
            </div>

            <div className="border border-[#E2E8F0] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
              <Globe className="w-10 h-10 text-[#0F766E] mb-4" />
              <h4 className="text-base font-bold text-slate-800 mb-2">
                GitHub Backup & Export
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Connect your workspace directly with GitHub! Back up client listings and documents automatically, or export compliance sheets and CSV reports straight to your GitHub repository.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-8 text-center text-xs mt-auto font-medium">
        <p>© 2026 ROSKYRO — Compliance-OS. Made for Chartered Accountants of India.</p>
        <p className="mt-1.5 text-slate-600 font-mono text-[10px]">Version 1.0.0 (Unicorn-Edition)</p>
      </footer>
    </div>
  );
};
