/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, Task, ClientDocument, ReminderLog, ActivityLog, Invoice, User } from './types';
import { PENALTY_RATES } from './constants';

export const ANCHOR_DATE = '2026-06-15';

export function formatINR(amount: number): string {
  const value = Math.round(amount);
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

export function calculateComplianceScore(tasks: Task[]): number {
  const now = new Date(ANCHOR_DATE);
  const relevantTasks = tasks.filter(t => new Date(t.dueDate) <= now);
  if (!relevantTasks.length) return 100;
  const completed = relevantTasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / relevantTasks.length) * 100);
}

export function generateComplianceTasks(client: Client): Task[] {
  const tasks: Task[] = [];
  const years = [2025, 2026];
  
  // MONTHLY tasks: GSTR-1, GSTR-3B, TDS Challan, Professional Tax
  // April 2025 to March 2026
  const startYear = 2025;
  const startMonth = 3; // April (0-indexed behavior but let's use direct month matching)
  
  for (let m = 0; m < 12; m++) {
    // Determine year and month
    const curMonth = (startMonth + m) % 12;
    const curYear = startYear + Math.floor((startMonth + m) / 12);
    
    const monthStr = String(curMonth + 1).padStart(2, '0');
    const periodName = new Date(curYear, curMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // GSTR-1 (due 11th of each month)
    const gstr1Due = `${curYear}-${monthStr}-11`;
    tasks.push(createBaseTask(client, 'GSTR-1', 'GSTR-1', 'GST', `GST Return filing for ${periodName}`, gstr1Due, periodName));

    // GSTR-3B (due 20th of each month)
    const gstr3bDue = `${curYear}-${monthStr}-20`;
    tasks.push(createBaseTask(client, 'GSTR-3B', 'GSTR-3B', 'GST', `GSTR-3B summary return for ${periodName}`, gstr3bDue, periodName));

    // TDS Challan (due 7th of each month)
    const tdsDue = `${curYear}-${monthStr}-07`;
    tasks.push(createBaseTask(client, 'TDS Challan', 'TDS Challan', 'TDS', `TDS Payment Challan for ${periodName}`, tdsDue, periodName));

    // Professional Tax (due 15th of each month)
    const ptDue = `${curYear}-${monthStr}-15`;
    tasks.push(createBaseTask(client, 'Professional Tax', 'Professional Tax', 'Professional Tax', `Professional Tax return for ${periodName}`, ptDue, periodName));
  }

  // QUARTERLY tasks: Advance Tax Q1 (June 15), Q2 (Sept 15), Q3 (Dec 15), Q4 (March 15)
  tasks.push(createBaseTask(client, 'Advance Tax Q1', 'Advance Tax', 'Advance Tax', 'Advance Tax Installment 1', '2025-06-15', 'Q1 FY25-26'));
  tasks.push(createBaseTask(client, 'Advance Tax Q2', 'Advance Tax', 'Advance Tax', 'Advance Tax Installment 2', '2025-09-15', 'Q2 FY25-26'));
  tasks.push(createBaseTask(client, 'Advance Tax Q3', 'Advance Tax', 'Advance Tax', 'Advance Tax Installment 3', '2025-12-15', 'Q3 FY25-26'));
  tasks.push(createBaseTask(client, 'Advance Tax Q4', 'Advance Tax', 'Advance Tax', 'Advance Tax Installment 4', '2026-03-15', 'Q4 FY25-26'));

  // CORPORATE ONLY: Private Limited or LLP
  if (client.type === 'Private Limited' || client.type === 'LLP') {
    // ROC MGT-7
    tasks.push(createBaseTask(client, 'ROC MGT-7', 'ROC MGT-7', 'ROC', 'Annual Return filed with MCA', '2025-11-29', 'FY24-25'));
    // ROC AOC-4
    tasks.push(createBaseTask(client, 'ROC AOC-4', 'ROC AOC-4', 'ROC', 'Filing of Financial Statements with MCA', '2025-10-30', 'FY24-25'));
    // DIR-3 KYC
    tasks.push(createBaseTask(client, 'DIR-3 KYC', 'DIR-3 KYC', 'ROC', 'Director KYC Verification', '2025-09-30', 'FY25-26'));
    // Quarterly TDS Returns: Q1 (July 31, 2025), Q2 (Oct 31, 2025), Q3 (Jan 31, 2026), Q4 (May 31, 2026)
    tasks.push(createBaseTask(client, 'TDS Quarterly Q1', 'TDS Return', 'TDS', 'Quarterly TDS Return filing Q1', '2025-07-31', 'Q1 FY25-26'));
    tasks.push(createBaseTask(client, 'TDS Quarterly Q2', 'TDS Return', 'TDS', 'Quarterly TDS Return filing Q2', '2025-10-31', 'Q2 FY25-26'));
    tasks.push(createBaseTask(client, 'TDS Quarterly Q3', 'TDS Return', 'TDS', 'Quarterly TDS Return filing Q3', '2026-01-31', 'Q3 FY25-26'));
    tasks.push(createBaseTask(client, 'TDS Quarterly Q4', 'TDS Return', 'TDS', 'Quarterly TDS Return filing Q4', '2026-05-31', 'Q4 FY25-26'));
  }

  // MEDICAL: Doctor/Clinic, IVF Center, Hospital
  if (['Doctor / Clinic', 'IVF Center', 'Hospital'].includes(client.type)) {
    // Bio-Medical Waste NOC
    tasks.push(createBaseTask(client, 'Medical NOC', 'Bio-Medical Waste', 'License', 'Bio-Medical Waste Management Consent', '2025-04-30', 'FY25-26'));
    // IVF Center only -> PCPNDT Compliance
    if (client.type === 'IVF Center') {
      tasks.push(createBaseTask(client, 'PCPNDT Comp', 'PCPNDT', 'License', 'PCPNDT Act annual filing', '2025-12-31', 'FY25-26'));
    }
  }

  // RESTAURANT / FOOD
  if (client.type === 'Restaurant') {
    tasks.push(createBaseTask(client, 'FSSAI Renewal', 'FSSAI License', 'License', 'Annual Food Safety License renewal', '2026-03-31', 'FY25-26'));
    tasks.push(createBaseTask(client, 'FSSAI Audit', 'FSSAI Half-Year Audit', 'License', 'Half-year Food Safety Audit compliance', '2025-09-30', 'FY25-26'));
  }

  // RETAIL / SHOP
  if (client.type === 'Retail / Shop') {
    tasks.push(createBaseTask(client, 'Shop License', 'Shop License', 'License', 'Shop and Establishment Act Renewal', '2026-01-31', 'FY25-26'));
  }

  return tasks;
}

function createBaseTask(
  client: Client,
  shortCode: string,
  name: string,
  type: Task['type'],
  description: string,
  dueDate: string,
  filingPeriod: string
): Task {
  const penaltyPerDay = PENALTY_RATES[name] || PENALTY_RATES['Default'];
  return {
    id: `task_${client.id}_${shortCode}_${dueDate}`,
    clientId: client.id,
    clientName: client.name,
    name,
    shortCode,
    type,
    description,
    dueDate,
    status: 'pending',
    priority: getPriorityForTaskType(type),
    assignedTo: 'Unassigned',
    completedAt: null,
    completedBy: null,
    penaltyPerDay,
    totalPenaltyAccrued: 0,
    reminderSent: false,
    filingPeriod,
    governmentAckNumber: '',
    notes: '',
    attachmentIds: [],
    createdAt: '2025-04-01T10:00:00Z',
  };
}

function getPriorityForTaskType(type: Task['type']): Task['priority'] {
  switch (type) {
    case 'GST': return 'high';
    case 'TDS': return 'medium';
    case 'ROC': return 'high';
    case 'Advance Tax': return 'critical';
    case 'License': return 'medium';
    case 'Professional Tax': return 'low';
    default: return 'medium';
  }
}

// Generates Seed Data
export function getSeedData() {
  const users: User[] = [
    {
      id: 'ca_user_1',
      name: 'Surendra K. Yadav',
      firmName: 'Yadav & Associates',
      email: 'surendrakyadav2017@gmail.com',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      state: 'Maharashtra',
      plan: 'Starter', // Starter plan supports up to 5 clients
      planExpiresAt: '2027-06-18',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200',
      caRegistrationNumber: 'FRN-402831',
      membershipCouncil: 'ICAI',
      onboardingDone: true,
      createdAt: '2026-01-01T09:00:00Z',
    },
  ];

  const clients: Client[] = [
    {
      id: 'client_1',
      name: 'Sharma Multi-Specialty Clinic',
      tradeName: 'Sharma Clinic & Diagnostic',
      type: 'Doctor / Clinic',
      gstin: '27AABCS1234A1Z5',
      pan: 'AABCS1234A',
      tan: 'MUMS12345A',
      phone: '+91 91234 56789',
      email: 'sharma.clinic@gmail.com',
      contactPersonName: 'Dr. Vivek Sharma',
      address: '405, Medical Square, Link Road, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      incorporationDate: '2015-04-12',
      financialYearEnd: 'March',
      gstRegistrationDate: '2018-07-01',
      gstReturnType: 'Quarterly',
      status: 'at_risk',
      complianceScore: 78,
      totalSavedPenalty: 42000,
      notes: 'Requires close attention to Monthly Professional Tax filings.',
      tags: ['priority', 'medical'],
      reminderEnabled: true,
      reminderChannels: ['email', 'whatsapp'],
      reminderDays: [7, 3, 1],
      portalAccessEnabled: true,
      portalEmail: 'sharma.clinic@gmail.com',
      portalPasswordHash: 'client123', // simulated
      createdAt: '2025-04-01T08:00:00Z',
      lastActivityAt: '2026-06-12T11:45:00Z',
    },
    {
      id: 'client_2',
      name: 'Gupta Traders Pvt Ltd',
      tradeName: 'Gupta Steel & Cement',
      type: 'Private Limited',
      gstin: '07AAACG5678F1ZA',
      pan: 'AAACG5678F',
      tan: 'DELS98765F',
      phone: '+91 98111 22233',
      email: 'finance@guptatraders.co.in',
      contactPersonName: 'Raman Gupta',
      address: 'GF-12, Sector 15, Connaught Place',
      city: 'Delhi',
      state: 'Delhi (NCT)',
      pincode: '110001',
      incorporationDate: '2019-11-20',
      financialYearEnd: 'March',
      gstRegistrationDate: '2019-12-05',
      gstReturnType: 'Monthly',
      status: 'compliant',
      complianceScore: 100,
      totalSavedPenalty: 124000,
      notes: 'Extremely proactive client. Always sends bank statements by 3rd of every month.',
      tags: ['vip', 'active'],
      reminderEnabled: true,
      reminderChannels: ['email'],
      reminderDays: [15, 7, 1],
      portalAccessEnabled: true,
      portalEmail: 'finance@guptatraders.co.in',
      portalPasswordHash: 'gupta123',
      createdAt: '2025-04-01T08:00:00Z',
      lastActivityAt: '2026-06-15T09:30:00Z',
    },
    {
      id: 'client_3',
      name: 'Patel Family Restaurant',
      tradeName: 'The Spicy Gujarati Thali',
      type: 'Restaurant',
      gstin: '24AABCP9012K2ZB',
      pan: 'AABCP9012K',
      tan: 'AHDS12121K',
      phone: '+91 99099 88776',
      email: 'pankaj@patelrest.com',
      contactPersonName: 'Pankaj Patel',
      address: '101-104, Ashram Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009',
      incorporationDate: '2021-08-15',
      financialYearEnd: 'March',
      gstRegistrationDate: '2021-09-01',
      gstReturnType: 'Monthly',
      status: 'active',
      complianceScore: 92,
      totalSavedPenalty: 15500,
      notes: 'Need to track half-year FSSAI hygiene audit.',
      tags: ['restaurant', 'recurring'],
      reminderEnabled: true,
      reminderChannels: ['whatsapp'],
      reminderDays: [3, 0],
      portalAccessEnabled: true,
      portalEmail: 'pankaj@patelrest.com',
      portalPasswordHash: 'patel123',
      createdAt: '2025-04-01T08:00:00Z',
      lastActivityAt: '2026-06-14T18:10:00Z',
    },
    {
      id: 'client_4',
      name: 'Mehra Dental & IVF Center',
      tradeName: 'Mehra Family Dental & IVF',
      type: 'IVF Center',
      gstin: '29AABCM3456R1ZH',
      pan: 'AABCM3456R',
      tan: 'BLRS23232R',
      phone: '+91 94440 12345',
      email: 'info@mehradentalivf.com',
      contactPersonName: 'Dr. Shruti Mehra',
      address: '22, MG Road, opposite Metro Pillar 45',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      incorporationDate: '2017-06-10',
      financialYearEnd: 'March',
      gstRegistrationDate: '2017-07-15',
      gstReturnType: 'Quarterly',
      status: 'at_risk',
      complianceScore: 64,
      totalSavedPenalty: 8000,
      notes: 'PCPNDT and Bio-Medical compliance have complex filings. They often miss due dates.',
      tags: ['at_risk', 'medical', 'critical'],
      reminderEnabled: true,
      reminderChannels: ['email', 'whatsapp'],
      reminderDays: [15, 7, 3, 1, 0],
      portalAccessEnabled: true,
      portalEmail: 'info@mehradentalivf.com',
      portalPasswordHash: 'mehra123',
      createdAt: '2025-04-01T08:00:00Z',
      lastActivityAt: '2026-06-10T14:22:00Z',
    },
    {
      id: 'client_5',
      name: 'RoyalCraft Retail LLP',
      tradeName: 'RoyalCraft Furniture & Decor',
      type: 'LLP',
      gstin: '08AABFI8989Q1ZM',
      pan: 'AABFI8989Q',
      tan: 'JPUR11223Q',
      phone: '+91 95095 12121',
      email: 'sales@royalcraft.in',
      contactPersonName: 'Vikram Singh',
      address: 'B-40, Industrial Area, Phase II',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302005',
      incorporationDate: '2022-02-02',
      financialYearEnd: 'March',
      gstRegistrationDate: '2022-03-10',
      gstReturnType: 'Monthly',
      status: 'active',
      complianceScore: 89,
      totalSavedPenalty: 38000,
      notes: 'Filing is smooth, but they delay sending document scans.',
      tags: ['furniture', 'retail'],
      reminderEnabled: true,
      reminderChannels: ['email'],
      reminderDays: [7, 1],
      portalAccessEnabled: true,
      portalEmail: 'sales@royalcraft.in',
      portalPasswordHash: 'royal123',
      createdAt: '2025-04-01T08:00:00Z',
      lastActivityAt: '2026-06-13T16:00:00Z',
    },
  ];

  // Helper to construct exact seeds matching the instructions:
  // "Each client must have: 18-24 tasks, at least 3 tasks historically completed, at least 2 tasks overdue"
  const allTasks: Task[] = [];
  const anchorDateObj = new Date(ANCHOR_DATE);

  clients.forEach(client => {
    const defaultTasks = generateComplianceTasks(client);
    
    // Sort tasks chronologically
    defaultTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    let completedCount = 0;
    let overdueCount = 0;

    const modifiedTasks = defaultTasks.map((t) => {
      const taskDate = new Date(t.dueDate);
      const isPast = taskDate <= anchorDateObj;

      if (isPast) {
        // We enforce at least 3 completed tasks for everyone
        if (completedCount < 4) {
          completedCount++;
          const compDate = new Date(taskDate);
          compDate.setDate(compDate.getDate() - 2); // completed 2 days early
          return {
            ...t,
            status: 'completed' as const,
            completedAt: compDate.toISOString().split('T')[0] + ' 15:30:00',
            completedBy: 'Surendra K. Yadav',
            governmentAckNumber: `ACK${Math.floor(100000000 + Math.random() * 900000000)}`,
          };
        }
        // Enforce at least 2 overdue tasks for client 1 and 4 (at_risk clients), and some historical for others.
        else if (overdueCount < 2 && (client.id === 'client_1' || client.id === 'client_4')) {
          overdueCount++;
          // overdue tasks: status = 'overdue', and some totalPenaltyAccrued
          const diffTime = Math.abs(anchorDateObj.getTime() - taskDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const penaltyAccrued = diffDays * t.penaltyPerDay;
          return {
            ...t,
            status: 'overdue' as const,
            totalPenaltyAccrued: penaltyAccrued,
          };
        }
        else {
          // Others can be completed or pending
          if (Math.random() > 0.3) {
            const compDate = new Date(taskDate);
            compDate.setDate(compDate.getDate() - 1);
            return {
              ...t,
              status: 'completed' as const,
              completedAt: compDate.toISOString().split('T')[0] + ' 11:00:00',
              completedBy: 'Surendra K. Yadav',
              governmentAckNumber: `ACK${Math.floor(100000000 + Math.random() * 900000000)}`,
            };
          } else {
            const diffTime = Math.abs(anchorDateObj.getTime() - taskDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const penaltyAccrued = diffDays * t.penaltyPerDay;
            return {
              ...t,
              status: 'overdue' as const,
              totalPenaltyAccrued: penaltyAccrued,
            };
          }
        }
      } else {
        // future tasks
        return {
          ...t,
          status: 'pending' as const,
        };
      }
    });

    // recalculate compliance score dynamically
    const score = calculateComplianceScore(modifiedTasks);
    client.complianceScore = score;
    if (score >= 90) {
      client.status = 'compliant';
    } else if (score >= 75) {
      client.status = 'active';
    } else {
      client.status = 'at_risk';
    }

    // calculate running total penalty saved: sum penalty savings from completed-on-time
    const onTimeCompleted = modifiedTasks.filter(tk => tk.status === 'completed');
    client.totalSavedPenalty = onTimeCompleted.reduce((sum, tk) => sum + (tk.penaltyPerDay * 12), 4800); // base simulated savings

    allTasks.push(...modifiedTasks);
  });

  // Simulated Base64 files for documents
  const samplePdfContent = 'JVBERi0xLjQKJSDi48clN0YXJ0b2ZPYmplY3QKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2Jq...';

  const documents: ClientDocument[] = [
    {
      id: 'doc_1',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
      name: 'GST Registration Certificate',
      category: 'Identity',
      fileName: 'GST_Reg_Certificate_Sharma.pdf',
      fileSize: '1.2 MB',
      mimeType: 'application/pdf',
      content: samplePdfContent,
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: '2025-04-05',
      expiryDate: '', // no expiry
      isVisibleToClient: true,
      description: 'Official GST REG-06 registration form.',
      tags: ['gst', 'permanent'],
      createdAt: '2025-04-05T14:30:00Z',
    },
    {
      id: 'doc_2',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
      name: 'Trade License 25-26',
      category: 'License',
      fileName: 'Trade_License_Expired_Soon.pdf',
      fileSize: '840 KB',
      mimeType: 'application/pdf',
      content: samplePdfContent,
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: '2025-05-10',
      expiryDate: '2026-07-20', // expires soon (less than 90 days from June 15, 2026!)
      isVisibleToClient: true,
      description: 'Municipal trade license for clinic premisis.',
      tags: ['license'],
      createdAt: '2025-05-10T11:15:00Z',
    },
    {
      id: 'doc_3',
      clientId: 'client_3',
      clientName: 'Patel Family Restaurant',
      name: 'FSSAI Food License 2026',
      category: 'License',
      fileName: 'FSSAI_Patel_Restaurant.pdf',
      fileSize: '2.3 MB',
      mimeType: 'application/pdf',
      content: samplePdfContent,
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: '2025-04-12',
      expiryDate: '2026-06-29', // 14 days left from June 15, 2026! (Patel Restaurant - FSSAI License, 14 days left)
      isVisibleToClient: true,
      description: 'FSSAI State license renewal copy.',
      tags: ['fssai', 'critical'],
      createdAt: '2025-04-12T09:20:00Z',
    },
    {
      id: 'doc_4',
      clientId: 'client_2',
      clientName: 'Gupta Traders Pvt Ltd',
      name: 'Incorporation Certificate',
      category: 'Identity',
      fileName: 'COI_Gupta_Traders.pdf',
      fileSize: '3.4 MB',
      mimeType: 'application/pdf',
      content: samplePdfContent,
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: '2025-04-02',
      expiryDate: '',
      isVisibleToClient: true,
      description: 'MCA Certificate of Incorporation.',
      tags: ['roc', 'permanent'],
      createdAt: '2025-04-02T10:10:00Z',
    },
    {
      id: 'doc_5',
      clientId: 'client_4',
      clientName: 'Mehra Dental & IVF Center',
      name: 'PCPNDT Form F Filing Q4',
      category: 'Financial',
      fileName: 'PCPNDT_FormF_Q4.pdf',
      fileSize: '1.8 MB',
      mimeType: 'application/pdf',
      content: samplePdfContent,
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: '2026-04-10',
      expiryDate: '2026-08-31', // within 90 days
      isVisibleToClient: false, // private CA document
      description: 'Copy of clinical records submitted to state authorites.',
      tags: ['medical', 'restricted'],
      createdAt: '2026-04-10T12:00:00Z',
    },
  ];

  const reminderLogs: ReminderLog[] = [
    {
      id: 'rem_1',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
      taskName: 'GSTR-3B filings',
      taskDueDate: '2026-06-20',
      penaltyWarningAmount: 600,
      message: 'Hi Dr. Vivek Sharma, a gentle reminder that GSTR-3B summary return is due on 2026-06-20. Please share financial spreadsheets.',
      channel: 'whatsapp',
      sentAt: '2026-06-15 10:32 AM',
      status: 'delivered',
      templateUsed: 'Friendly Nudge',
    },
    {
      id: 'rem_2',
      clientId: 'client_3',
      clientName: 'Patel Family Restaurant',
      taskName: 'FSSAI License Renewal',
      taskDueDate: '2026-06-29',
      penaltyWarningAmount: 2000,
      message: 'URGENT: FSSAI License Renewal due in 14 days. Penalty of ₹2000/day applies after 2026-06-29. Please renew ASAP.',
      channel: 'email',
      sentAt: '2026-06-15 10:33 AM',
      status: 'delivered',
      templateUsed: 'Urgent Warning',
    },
    {
      id: 'rem_3',
      clientId: 'client_4',
      clientName: 'Mehra Dental & IVF Center',
      taskName: 'PCPNDT Compliance filing',
      taskDueDate: '2025-12-31',
      penaltyWarningAmount: 10000,
      message: 'PCPNDT Compliance is OVERDUE by 166 days. Penalty accrued: ₹1,660,000. Please contact us immediately to resolve.',
      channel: 'both',
      sentAt: '2026-06-14 09:15 AM',
      status: 'pending',
      templateUsed: 'Overdue Alert',
    },
  ];

  const activityLogs: ActivityLog[] = [
    {
      id: 'act_1',
      type: 'client_added',
      description: 'Client "Sharma Multi-Specialty Clinic" was added and compliance calendar generated.',
      actor: 'Surendra K. Yadav',
      timestamp: '2026-06-15T10:30:05Z',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
    },
    {
      id: 'act_2',
      type: 'reminder_sent',
      description: 'WhatsApp reminder for "GSTR-3B" sent to Dr. Vivek Sharma (Sharma Multi-Specialty Clinic).',
      actor: 'System',
      timestamp: '2026-06-15T10:32:00Z',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
    },
    {
      id: 'act_3',
      type: 'doc_uploaded',
      description: 'Document "FSSAI Food License 2026" uploaded for Patel Family Restaurant.',
      actor: 'Surendra K. Yadav',
      timestamp: '2026-06-15T09:15:00Z',
      clientId: 'client_3',
      clientName: 'Patel Family Restaurant',
    },
    {
      id: 'act_4',
      type: 'portal_login',
      description: 'Client Dr. Vivek Sharma logged into the self-service web portal.',
      actor: 'Client',
      timestamp: '2026-06-15T11:45:00Z',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
    },
    {
      id: 'act_5',
      type: 'portal_doc_viewed',
      description: 'Client viewed document "GST Registration Certificate".',
      actor: 'Client',
      timestamp: '2026-06-15T11:50:00Z',
      clientId: 'client_1',
      clientName: 'Sharma Multi-Specialty Clinic',
    },
    {
      id: 'act_6',
      type: 'task_completed',
      description: 'Task GSTR-1 for Gupta Traders Pvt Ltd was marked complete.',
      actor: 'Surendra K. Yadav',
      timestamp: '2026-06-15T09:30:00Z',
      clientId: 'client_2',
      clientName: 'Gupta Traders Pvt Ltd',
    },
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv_1',
      caId: 'ca_user_1',
      caFirmName: 'Yadav & Associates',
      amount: 999,
      plan: 'Starter',
      status: 'paid',
      invoiceDate: '2026-06-01',
      dueDate: '2026-06-15',
      paymentMethod: 'Razorpay',
      razorpayOrderId: 'order_Opx84J2Kds9',
    },
    {
      id: 'inv_2',
      caId: 'ca_user_1',
      caFirmName: 'Yadav & Associates',
      amount: 999,
      plan: 'Starter',
      status: 'paid',
      invoiceDate: '2026-05-01',
      dueDate: '2026-05-15',
      paymentMethod: 'UPI',
    },
    {
      id: 'inv_3',
      caId: 'ca_user_1',
      caFirmName: 'Yadav & Associates',
      amount: 999,
      plan: 'Starter',
      status: 'paid',
      invoiceDate: '2026-04-01',
      dueDate: '2026-04-15',
      paymentMethod: 'NEFT',
    }
  ];

  return {
    user: users[0],
    clients,
    tasks: allTasks,
    documents,
    reminderLogs,
    activityLogs,
    invoices,
  };
}
