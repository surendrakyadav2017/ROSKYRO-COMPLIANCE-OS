/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { ClientCard } from './ClientCard';
import { Button } from './Button';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Search, UserPlus, SlidersHorizontal, Info, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { CLIENT_TYPES, INDIAN_STATES } from './constants';
import { ClientType, Client, ClientStatus } from './types';

export const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, showToast, setSelectedClientId, sendReminder } = useAppHelper();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('All');
  const [selectedHealthFilter, setSelectedHealthFilter] = useState('All');

  // Modal controller
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Remind state
  const [remindClientModal, setRemindClientModal] = useState<Client | null>(null);
  const [remindTask, setRemindTask] = useState('Monthly filings portfolio');
  const [remindTemplate, setRemindTemplate] = useState('Friendly Nudge');
  const [remindChannel, setRemindChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');

  // Multi-step form state
  const [formStep, setFormStep] = useState(1);
  const [clientName, setClientName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [clientType, setClientType] = useState<ClientType>('Private Limited');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [tan, setTan] = useState('');
  const [incDate, setIncDate] = useState('2022-04-01');
  const [gstDate, setGstDate] = useState('2022-05-15');

  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [fyEnd, setFyEnd] = useState<'March' | 'December'>('March');
  const [gstReturnType, setGstReturnType] = useState<'Monthly' | 'Quarterly'>('Monthly');

  const [portalAccessEnabled, setPortalAccessEnabled] = useState(true);
  const [portalEmail, setPortalEmail] = useState('');
  const [portalPassword, setPortalPassword] = useState('');

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderChannels, setReminderChannels] = useState<('whatsapp' | 'email')[]>(['email', 'whatsapp']);
  const [reminderDays, setReminderDays] = useState<number[]>([15, 7, 3, 1, 0]);

  // Validation feedback
  const [gstValidationError, setGstValidationError] = useState('');

  // Handle GSTIN live validation & auto-fill PAN (middle 10 chars, indices 2-11)
  const handleGstinChange = (val: string) => {
    const upperVal = val.toUpperCase();
    setGstin(upperVal);
    
    // Auto populate PAN based on GSTIN: index 2 to 12 represents the 10 char PAN
    if (upperVal.length >= 12) {
      const derivedPan = upperVal.substring(2, 12);
      setPan(derivedPan);
    }

    // GSTIN Regex
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (upperVal.length === 15) {
      if (!regex.test(upperVal)) {
        setGstValidationError('Warning: Not a valid Indian standard GSTIN characters map.');
      } else {
        setGstValidationError('');
      }
    } else {
      setGstValidationError('');
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormStep(1);
    setEditingClientId(null);
    setGstValidationError('');

    // Clear form inputs
    setClientName('');
    setTradeName('');
    setClientType('Private Limited');
    setGstin('');
    setPan('');
    setTan('');
    setIncDate('2022-04-01');
    setGstDate('2022-05-15');
    setContactName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('');
    setState('Maharashtra');
    setPincode('');
    setFyEnd('March');
    setGstReturnType('Monthly');
    setPortalAccessEnabled(true);
    setPortalEmail('');
    setPortalPassword(`ROSKYRO-${Math.floor(1000 + Math.random() * 9000)}`);
    setReminderEnabled(true);
    setReminderChannels(['email', 'whatsapp']);
    setReminderDays([15, 7, 3, 1, 0]);

    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setIsEditMode(true);
    setEditingClientId(client.id);
    setFormStep(1);
    setGstValidationError('');

    setClientName(client.name);
    setTradeName(client.tradeName);
    setClientType(client.type);
    setGstin(client.gstin);
    setPan(client.pan);
    setTan(client.tan);
    setIncDate(client.incorporationDate);
    setGstDate(client.gstRegistrationDate);
    setContactName(client.contactPersonName);
    setPhone(client.phone);
    setEmail(client.email);
    setAddress(client.address);
    setCity(client.city);
    setState(client.state);
    setPincode(client.pincode);
    setFyEnd(client.financialYearEnd);
    setGstReturnType(client.gstReturnType);
    setPortalAccessEnabled(client.portalAccessEnabled);
    setPortalEmail(client.portalEmail);
    setPortalPassword(client.portalPasswordHash || 'client123');
    setReminderEnabled(client.reminderEnabled);
    setReminderChannels(client.reminderChannels);
    setReminderDays(client.reminderDays);

    setIsAddModalOpen(true);
  };

  const handleNextStep = () => {
    // Basic validation per step
    if (formStep === 1) {
      if (!clientName) {
        showToast('Error: Name is required', 'error');
        return;
      }
      if (gstin && gstin.length !== 15) {
        showToast('Error: GSTIN must be exactly 15 characters', 'error');
        return;
      }
    }
    if (formStep === 2) {
      if (!contactName || !phone || !email) {
        showToast('Error: Contact Name, Phone and Email are required', 'error');
        return;
      }
    }
    if (formStep === 3) {
      if (portalAccessEnabled && !portalEmail) {
        setPortalEmail(email); // default to client email
      }
    }

    setFormStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
  };

  const handleToggleChannel = (ch: 'whatsapp' | 'email') => {
    setReminderChannels(prev =>
      prev.includes(ch) ? prev.filter(item => item !== ch) : [...prev, ch]
    );
  };

  const handleToggleDay = (day: number) => {
    setReminderDays(prev =>
      prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day].sort((a,b) => b-a)
    );
  };

  const handleSaveClientSubmit = () => {
    const rawClientObj: Omit<Client, 'id' | 'createdAt'> = {
      name: clientName,
      tradeName: tradeName || clientName,
      type: clientType,
      gstin: gstin || '27AAACG' + Math.floor(1000 + Math.random() * 9000) + 'A1Z' + Math.floor(1 + Math.random() * 9),
      pan: pan || (gstin ? gstin.substring(2, 12) : 'AABCS' + Math.floor(1000 + Math.random() * 9000) + 'K'),
      tan: tan || 'MUMS' + Math.floor(10000 + Math.random() * 90000) + 'A',
      phone,
      email,
      contactPersonName: contactName,
      address,
      city,
      state,
      pincode,
      incorporationDate: incDate,
      financialYearEnd: fyEnd,
      gstRegistrationDate: gstDate,
      gstReturnType,
      status: isEditMode ? (clients.find(c => c.id === editingClientId)?.status || 'active') : 'active',
      complianceScore: isEditMode ? (clients.find(c => c.id === editingClientId)?.complianceScore || 100) : 100,
      totalSavedPenalty: isEditMode ? (clients.find(c => c.id === editingClientId)?.totalSavedPenalty || 0) : 0,
      notes: isEditMode ? (clients.find(c => c.id === editingClientId)?.notes || '') : 'Active Client portfolio connected.',
      tags: isEditMode ? (clients.find(c => c.id === editingClientId)?.tags || ['imported']) : ['new-client'],
      reminderEnabled,
      reminderChannels,
      reminderDays,
      portalAccessEnabled,
      portalEmail: portalEmail || email,
      portalPasswordHash: portalPassword,
      lastActivityAt: new Date().toISOString(),
    };

    if (isEditMode && editingClientId) {
      updateClient(editingClientId, rawClientObj);
    } else {
      addClient(rawClientObj);
    }
    setIsAddModalOpen(false);
  };

  const handleTriggerLogReminder = () => {
    if (!remindClientModal) return;
    sendReminder({
      clientId: remindClientModal.id,
      clientName: remindClientModal.name,
      taskName: remindTask,
      taskDueDate: '2026-06-25',
      penaltyWarningAmount: remindClientModal.type === 'Private Limited' ? 1200 : 500,
      message: `ALERT: ${remindTask} is approaching due date. Sent template ${remindTemplate} via ${remindChannel.toUpperCase()}.`,
      channel: remindChannel,
      status: 'delivered',
      templateUsed: remindTemplate,
    });
    setRemindClientModal(null);
  };

  // Filters logic application
  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedEntityFilter === 'All' || c.type === selectedEntityFilter;
    const matchesHealth = selectedHealthFilter === 'All' || c.status === selectedHealthFilter;

    return matchesSearch && matchesType && matchesHealth;
  });

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      {/* Header and Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
            Clients Directory list
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage practice accounts & verify active compliance statuses.
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-1.5 font-bold shrink-0 shadow-xs">
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </Button>
      </div>

      {/* Filter strip */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-center justify-between select-none">
        {/* Search */}
        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, trade, GSTIN, PAN..."
            className="w-full text-xs font-semibold pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F] rounded-lg"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Dropdown Filters and status keys */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedEntityFilter}
            onChange={e => setSelectedEntityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-bold text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="All">All Entities</option>
            {CLIENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedHealthFilter}
            onChange={e => setSelectedHealthFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg font-bold text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="All">All Health Status</option>
            <option value="compliant">Compliant</option>
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid count summary feedback */}
      <div className="text-xs text-slate-400 font-bold select-none">
        Showing {filteredClients.length} of {clients.length} clients registered
      </div>

      {/* Clients card list grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {filteredClients.length === 0 ? (
          <div className="col-span-2 py-16 bg-white border border-[#E2E8F0] rounded-xl text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <ShieldAlert className="w-10 h-10 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Clients matched filters</h4>
            <p className="text-xs max-w-sm">Try refinement adjustments or trigger the add new client button to generate tailored compliance files.</p>
          </div>
        ) : (
          filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onSelect={setSelectedClientId}
              onEdit={handleOpenEditModal}
              onRemind={setRemindClientModal}
            />
          ))
        )}
      </div>

      {/* Add / Edit Multi-step modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isEditMode ? 'Modify CA Client Account' : 'Register New Client Profile'}
        size="lg"
      >
        {/* Horizontal steps bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 text-xs font-bold text-slate-400">
          {['Identity', 'Contact', 'Portal Access', 'Reminders', 'Confirm'].map((lbl, idx) => (
            <div key={lbl} className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono ${
                formStep > idx + 1
                  ? 'bg-emerald-600 text-white'
                  : formStep === idx + 1
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span className={formStep === idx + 1 ? 'text-slate-800' : ''}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* Form elements by steps */}
        <div className="space-y-4">
          {formStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Client Trade Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Gupta Traders Pvt Ltd"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Business Display Name (Trade Name)
                  </label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={e => setTradeName(e.target.value)}
                    placeholder="e.g. Gupta Steel & Cement"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Legal Type
                  </label>
                  <select
                    value={clientType}
                    onChange={e => setClientType(e.target.value as ClientType)}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  >
                    {CLIENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={e => handleGstinChange(e.target.value)}
                    maxLength={15}
                    placeholder="e.g. 27AABCS1234A1Z5"
                    className="w-full text-xs font-bold font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                  {gstValidationError && (
                    <span className="text-[10px] text-amber-600 font-bold mt-1 block">
                      {gstValidationError}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    PAN (Auto Derived from GSTIN)
                  </label>
                  <input
                    type="text"
                    required
                    value={pan}
                    onChange={e => setPan(e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="10 length uppercase map"
                    className="w-full text-xs font-bold font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    TAN (Legal Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={tan}
                    onChange={e => setTan(e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="e.g. MUMS12345A"
                    className="w-full text-xs font-bold font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Incorporation Date
                  </label>
                  <input
                    type="date"
                    value={incDate}
                    onChange={e => setIncDate(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    GST Registration Date
                  </label>
                  <input
                    type="date"
                    value={gstDate}
                    onChange={e => setGstDate(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. Raman Gupta"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full text-xs font-bold p-2 BG-WHITE border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    FY End
                  </label>
                  <select
                    value={fyEnd}
                    onChange={e => setFyEnd(e.target.value as 'March' | 'December')}
                    className="w-full text-xs font-bold p-2 BG-WHITE border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                  >
                    <option value="March">March</option>
                    <option value="December">December</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  GST Return Frequency
                </label>
                <select
                  value={gstReturnType}
                  onChange={e => setGstReturnType(e.target.value as 'Monthly' | 'Quarterly')}
                  className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                >
                  <option value="Monthly">Monthly normal filings (GSTR-1, GSTR-3B)</option>
                  <option value="Quarterly">Quarterly QRMP option</option>
                </select>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-5 text-left font-sans select-none">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Enable Client Self-Service Portal access
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Provides white-labeled dashboard access for matching email coordinates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={portalAccessEnabled}
                  onChange={e => setPortalAccessEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#1E3A5F] cursor-pointer"
                />
              </div>

              {portalAccessEnabled && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Client Portal Login Email
                    </label>
                    <input
                      type="email"
                      required
                      value={portalEmail}
                      onChange={e => setPortalEmail(e.target.value)}
                      placeholder={email || 'client@example.co.in'}
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Temporary Plaintexts Password (Generated Once)
                    </label>
                    <input
                      type="text"
                      required
                      value={portalPassword}
                      onChange={e => setPortalPassword(e.target.value)}
                      className="w-full text-xs font-mono font-bold px-3 py-2 border border-amber-200 bg-amber-50/20 rounded-lg text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-1.5 leading-normal">
                      Note: "Your client will use this to log in and view their documents and task status."
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {formStep === 4 && (
            <div className="space-y-6 select-none leading-normal text-left font-sans">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Enable Automated Reminders broadcast
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Triggers SMS, WhatsApp & email notifications before statutory deadlines.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={e => setReminderEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#1E3A5F] cursor-pointer"
                />
              </div>

              {reminderEnabled && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Channels selection chips */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Active Communication Channels
                    </label>
                    <div className="flex gap-2">
                      {['whatsapp', 'email'].map((ch) => {
                        const active = reminderChannels.includes(ch as any);
                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => handleToggleChannel(ch as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              active
                                ? 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/30'
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {ch.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interval threshold selection chips */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Days threshold intervals to send alerts before due dates
                    </label>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      {[15, 7, 3, 1, 0].map((d) => {
                        const isSel = reminderDays.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => handleToggleDay(d)}
                            className={`px-3 py-2 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                              isSel
                                ? 'bg-[#1E3A5F] text-white border-transparent'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            {isSel && <Check className="w-3.5 h-3.5 text-white" />}
                            <span>{d === 0 ? 'DUE DAY (0)' : `${d} Days Before`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {formStep === 5 && (
            <div className="space-y-4 font-sans text-left">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Summary Preview
              </h4>
              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-y-2 border-b border-slate-200/55 pb-2 font-semibold">
                  <div className="text-slate-400">Client Official Name</div>
                  <div className="font-bold text-slate-800 text-right">{clientName}</div>
                  
                  <div className="text-slate-400">Trade Display Name</div>
                  <div className="font-bold text-slate-800 text-right">{tradeName || clientName}</div>

                  <div className="text-slate-400">Entity Type</div>
                  <div className="font-bold text-slate-800 text-right">{clientType}</div>

                  <div className="text-slate-400 font-mono">GSTIN Code</div>
                  <div className="font-mono text-slate-800 text-right">{gstin || 'None'}</div>
                </div>

                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-slate-400 font-semibold">Primary Contact Name</div>
                  <div className="font-bold text-slate-800 text-right">{contactName}</div>

                  <div className="text-slate-400 font-semibold text-xs">Phone & Email</div>
                  <div className="font-bold text-slate-800 text-right text-xs truncate">
                    {phone} • {email}
                  </div>

                  <div className="text-slate-400 font-semibold">Access enabled</div>
                  <div className="font-bold text-[#0F766E] text-right">
                    {portalAccessEnabled ? 'YES (Self-Service)' : 'NO (CA Only)'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#0F766E]/5 rounded-lg border border-[#0F766E]/10 flex gap-2 items-center text-[11px] text-[#0F766E]">
                <Info className="w-4 h-4 shrink-0 text-[#0F766E]" />
                <span className="font-semibold leading-relaxed">
                  Compliance generator will write recurring legal milestones for GST, ROC, TDS, and PT instantly into current calendar.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Form controls footer */}
        <div className="flex gap-2 justify-end pt-6 border-t border-slate-100 mt-6">
          {formStep > 1 && (
            <Button variant="ghost" size="sm" onClick={handlePrevStep}>
              Back
            </Button>
          )}
          {formStep < 5 ? (
            <Button variant="primary" size="sm" onClick={handleNextStep}>
              Next Step
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={handleSaveClientSubmit}>
              {isEditMode ? 'Apply Updates' : 'Save Client & Generate Calendar'}
            </Button>
          )}
        </div>
      </Modal>

      {/* Instant broadcast nudge modal */}
      {remindClientModal && (
        <Modal
          isOpen={!!remindClientModal}
          onClose={() => setRemindClientModal(null)}
          title={`Broadcast nudge - ${remindClientModal.name}`}
        >
          <div className="space-y-4 font-sans text-left text-xs font-semibold">
            <p className="text-[11px] text-slate-400 italic">
              Push immediate WhatsApp alerts to matching client phone number.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Target Compliance Task
              </label>
              <select
                value={remindTask}
                onChange={e => setRemindTask(e.target.value)}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-lg"
              >
                <option value="GSTR-1 GST filing">GSTR-1 GST filing</option>
                <option value="GSTR-3B monthly summary">GSTR-3B monthly summary</option>
                <option value="Quarterly TDS filing">Quarterly TDS filing</option>
                <option value="ROC AOC-4 balance sheets">ROC AOC-4 balance sheets</option>
                <option value="FSSAI Renewal NOC">FSSAI Renewal NOC</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Reminders Template Text
              </label>
              <select
                value={remindTemplate}
                onChange={e => setRemindTemplate(e.target.value)}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-lg"
              >
                <option value="Friendly Nudge">Friendly Nudge (Standard alert)</option>
                <option value="Urgent Warning">Urgent Warning (Accruing daily penalty warn)</option>
                <option value="Overdue Alert">Overdue Alert (Statutory compliance delay)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Delivery Channel
              </label>
              <div className="flex gap-2">
                {['whatsapp', 'email', 'both'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setRemindChannel(ch as any)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                      remindChannel === ch
                        ? 'bg-[#1E3A5F] text-white border-transparent'
                        : 'bg-white text-slate-500 border-slate-200'
                    }`}
                  >
                    {ch.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2 justify-end decoration-indigo-50 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setRemindClientModal(null)}>
                Cancel
              </Button>
              <Button variant="accent" size="sm" onClick={handleTriggerLogReminder}>
                Push Instant Broadcast Alert
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
