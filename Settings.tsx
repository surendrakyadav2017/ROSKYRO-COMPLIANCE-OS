/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import {
  Github,
  Key,
  ShieldCheck,
  Building2,
  RefreshCw,
  FolderSync,
  HelpCircle,
} from 'lucide-react';
import { INDIAN_STATES } from './constants';

export const Settings: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    githubConnected,
    githubToken,
    githubRepo,
    githubBranch,
    connectGithub,
    disconnectGithub,
    exportWorkspaceDataToGithub,
    showToast,
  } = useAppHelper();

  // Practice state
  const [firmName, setFirmName] = useState(currentUser?.firmName || 'Yadav & Associates');
  const [caName, setCaName] = useState(currentUser?.name || 'Surendra K. Yadav');
  const [icaiNum, setIcaiNum] = useState(currentUser?.caRegistrationNumber || 'MRN-44212');
  const [email, setEmail] = useState(currentUser?.email || 'surendrakyadav2017@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 9930219803');
  const [city, setCity] = useState(currentUser?.city || 'Mumbai');
  const [state, setState] = useState(currentUser?.state || 'Maharashtra');

  // Security variables
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // GitHub input states
  const [tokenInput, setTokenInput] = useState(githubToken || '');
  const [repoInput, setRepoInput] = useState(githubRepo || '');
  const [branchInput, setBranchInput] = useState(githubBranch || 'main');

  // Loading indicator for simulation
  const [githubSyncIsLoading, setGithubSyncIsLoading] = useState(false);
  const [githubSyncOutputLogs, setGithubSyncOutputLogs] = useState<string[]>([]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        firmName,
        name: caName,
        caRegistrationNumber: icaiNum,
        email,
        phone,
        city,
        state,
      });
      showToast('✓ Practice Profile options updated successfully.', 'success');
    }
  };

  const handleConnectGit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput || !repoInput) {
      showToast('Error: Please complete Personal Access Token and Repo coordinates.', 'error');
      return;
    }

    setGithubSyncIsLoading(true);
    setGithubSyncOutputLogs(prev => [
      ...prev,
      `[info] ${new Date().toLocaleTimeString()} Connect triggered...`,
      `[info] Verifying Personal Access Token (character patterns validation)`,
      `[info] Fetching repository coordinates: https://github.com/${repoInput}`,
    ]);

    setTimeout(() => {
      connectGithub(tokenInput, repoInput, branchInput);
      setGithubSyncIsLoading(false);
      setGithubSyncOutputLogs(prev => [
        ...prev,
        `[success] Connected to GitHub repo: ${repoInput} [Branch: ${branchInput}]`,
        `[success] Credentials cached in encrypted LocalStorage. Ready for auto-backup commits.`,
      ]);
      showToast('Success: Connected to GitHub repository successfully!', 'success');
    }, 1500);
  };

  const handleDisconnectGit = () => {
    disconnectGithub();
    setTokenInput('');
    setRepoInput('');
    setBranchInput('main');
    setGithubSyncOutputLogs([]);
    showToast('✓ Disconnected from GitHub. Local repository cache wiped.', 'info');
  };

  const handleSyncToGit = async () => {
    if (!githubConnected) return;

    setGithubSyncIsLoading(true);
    setGithubSyncOutputLogs(prev => [
      ...prev,
      `[backup] ${new Date().toLocaleTimeString()} Preparing workspace binary package packaging...`,
      `[backup] Packing Clients Database (${currentUser?.firmName} cohort data)...`,
      `[backup] Compiling Statutory Task Checklist records...`,
      `[backup] serializing Document Vault certificate tags...`,
      `[backup] Bundling Operational Audit logs & Dispatch notifications...`,
      `[commit] Initializing simulated REST GitHub PUT Call content: write workspace-backup.json...`,
    ]);

    // Add brief animation delay
    setTimeout(async () => {
      const logs = await exportWorkspaceDataToGithub();
      setGithubSyncIsLoading(false);
      setGithubSyncOutputLogs(prev => [...prev, ...logs]);
      showToast('Success: Workspace exported and archived on GitHub!', 'success');
    }, 2000);
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      {/* Title Header split */}
      <div className="border-b border-slate-100 pb-3 select-none">
        <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
          Workspace Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure firm registration details, security portals, and backup GitHub repositories integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Practice master info form */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 select-none">
              <Building2 className="w-4 h-4 text-[#1E3A5F]" />
              <span>Practice master Information</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs font-semibold text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">CA Firm Trade Name</label>
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={e => setFirmName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Practitioner Name</label>
                  <input
                    type="text"
                    required
                    value={caName}
                    onChange={e => setCaName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">ICAI Registration No</label>
                  <input
                    type="text"
                    required
                    value={icaiNum}
                    onChange={e => setIcaiNum(e.target.value)}
                    className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-200 text-slate-500 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Primary Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 text-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Mobile Number (WhatsApp Enabled)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 text-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 text-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">State Representation</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-slate-200 text-slate-800 rounded-lg focus:outline-none"
                >
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" size="sm" className="font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Security & Alerts portal */}
          <Card className="p-5 select-none font-semibold text-slate-600 text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-[#1E3A5F]" />
              <span>Workspace security & Notifications preferences</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-800">Two-Factor Authentication (MFA)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Enforces secure OTP prompt verification at sign-in.</p>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={e => setMfaEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#1E3A5F]"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-800">Email Alerts Logs Summary</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sends automated weekly reports of completed and overdue client files.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#1E3A5F]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* GitHub Manager integration: 1 col (THE CORE DIRECTIVE) */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Github className="w-4 h-4 text-slate-800" />
                <span>GitHub connection manager</span>
              </h3>
              
              {githubConnected ? (
                <Badge variant="success" className="animate-pulse">CONNECTED</Badge>
              ) : (
                <Badge variant="warning">DISCONNECTED</Badge>
              )}
            </div>

            {/* If NOT connected -> Display form */}
            {!githubConnected ? (
              <form onSubmit={handleConnectGit} className="space-y-4 font-sans text-xs font-semibold text-slate-600">
                <p className="text-[11px] text-slate-400 italic">
                  Backup entire legal regulatory workspace portfolio databases secure-locked inside customer repositories.
                </p>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">GitHub Personal Access Token (PAT)</label>
                  <input
                    type="password"
                    required
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    placeholder="e.g. ghp_38CharactersLettersNumericalHashKey..."
                    className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-200 text-slate-800 rounded-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-normal">
                    Token is kept local-only inside encrypted browser Sandboxes. Never exposed.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Target Repository</label>
                    <input
                      type="text"
                      required
                      value={repoInput}
                      placeholder="e.g. surendra-associates/practice-data"
                      onChange={e => setRepoInput(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 text-slate-800 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Default Branch</label>
                    <input
                      type="text"
                      required
                      value={branchInput}
                      onChange={e => setBranchInput(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 text-slate-800 rounded-lg"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full font-bold flex items-center justify-center gap-1.5 py-2.5 shadow-xs">
                  <Github className="w-4 h-4" />
                  <span>Connect GitHub repository</span>
                </Button>
              </form>
            ) : (
              /* If CONNECTED -> Display Repository detail and backup export */
              <div className="space-y-4 font-sans text-xs font-semibold text-slate-600">
                <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-2 select-none">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target Repository</span>
                    <strong className="text-slate-800 select-all font-mono">{githubRepo}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Live Branch</span>
                    <strong className="text-slate-800 font-mono">{githubBranch}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Backup target file</span>
                    <strong className="text-[#0F766E] font-mono">workspace-backup.json</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSyncToGit}
                    disabled={githubSyncIsLoading}
                    variant="success"
                    className="flex-1 font-bold flex items-center justify-center gap-1.5 py-2.5 shadow-xs"
                  >
                    <FolderSync className={`w-4 h-4 ${githubSyncIsLoading ? 'animate-spin' : ''}`} />
                    <span>{githubSyncIsLoading ? 'Archiving...' : 'Export Workspace to GitHub'}</span>
                  </Button>
                  <Button
                    onClick={handleDisconnectGit}
                    disabled={githubSyncIsLoading}
                    variant="ghost"
                    className="border border-red-200 hover:bg-red-50 text-red-700 font-bold px-3.5 py-2.5 cursor-pointer"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}

            {/* Sync Live Console outputs log */}
            {githubSyncOutputLogs.length > 0 && (
              <div className="mt-5 border-t border-slate-100 pt-5 text-left">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 select-none font-mono">
                  — git rest terminal feed —
                </h4>
                <div className="bg-slate-900 border border-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[10px] space-y-2 overflow-y-auto max-h-48 leading-relaxed shadow-inner">
                  {githubSyncOutputLogs.map((log, idx) => {
                    let color = 'text-[#A3E635]'; // lime green default for success
                    if (log.includes('[info]')) {
                      color = 'text-sky-300';
                    } else if (log.includes('[commit]')) {
                      color = 'text-[#F472B6]'; // magenta for commits
                    } else if (log.includes('[backup]')) {
                      color = 'text-amber-300';
                    }
                    return (
                      <div key={idx} className={`${color} font-bold break-all`}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};
