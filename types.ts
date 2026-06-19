/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  firmName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  plan: 'Starter' | 'Growth' | 'Pro';
  planExpiresAt: string;
  avatar: string;
  caRegistrationNumber: string;
  membershipCouncil: 'ICAI';
  onboardingDone: boolean;
  createdAt: string;
  role?: 'client' | 'ca';
}

export type ClientStatus = 'active' | 'at_risk' | 'compliant' | 'inactive';

export type ClientType =
  | 'Private Limited'
  | 'LLP'
  | 'Partnership'
  | 'Proprietorship'
  | 'Doctor / Clinic'
  | 'Dentist'
  | 'IVF Center'
  | 'Hospital'
  | 'Restaurant'
  | 'Retail / Shop'
  | 'Manufacturing'
  | 'NGO / Trust'
  | 'Other';

export interface Client {
  id: string;
  name: string;
  tradeName: string;
  type: ClientType;
  gstin: string; // 15-char
  pan: string; // 10-char
  tan: string;
  phone: string;
  email: string;
  contactPersonName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  incorporationDate: string;
  financialYearEnd: 'March' | 'December';
  gstRegistrationDate: string;
  gstReturnType: 'Monthly' | 'Quarterly';
  status: ClientStatus;
  complianceScore: number;
  totalSavedPenalty: number;
  notes: string;
  tags: string[];
  reminderEnabled: boolean;
  reminderChannels: ('whatsapp' | 'email')[];
  reminderDays: number[]; // e.g. [15, 7, 3, 1, 0]
  portalAccessEnabled: boolean;
  portalEmail: string;
  portalPasswordHash: string; // bcrypt-style simulated hash
  createdAt: string;
  lastActivityAt: string;
}

export type TaskType =
  | 'GST'
  | 'TDS'
  | 'ROC'
  | 'Labour'
  | 'License'
  | 'Advance Tax'
  | 'Professional Tax'
  | 'Default';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export type PriorityType = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  shortCode: string; // e.g. "GSTR-3B", "TDS-Q2"
  type: TaskType;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: PriorityType;
  assignedTo: string;
  completedAt: string | null;
  completedBy: string | null;
  penaltyPerDay: number;
  totalPenaltyAccrued: number;
  reminderSent: boolean;
  filingPeriod: string;
  governmentAckNumber: string;
  notes: string;
  attachmentIds: string[];
  createdAt: string;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  category: 'GST' | 'TDS' | 'ROC' | 'License' | 'Identity' | 'Financial' | 'Other';
  fileName: string;
  fileSize: string;
  mimeType: string;
  content: string; // base64 string
  uploadedBy: string;
  uploadDate: string;
  expiryDate: string; // YYYY-MM-DD (empty = no expiry)
  isVisibleToClient: boolean;
  description: string;
  tags: string[];
  createdAt: string;
}

export interface ReminderLog {
  id: string;
  clientId: string;
  clientName: string;
  taskName: string;
  taskDueDate: string;
  penaltyWarningAmount: number;
  message: string;
  channel: 'whatsapp' | 'email' | 'both';
  sentAt: string;
  status: 'delivered' | 'failed' | 'pending';
  templateUsed: string;
}

export interface ActivityLog {
  id: string;
  type:
    | 'client_added'
    | 'client_updated'
    | 'client_deleted'
    | 'task_completed'
    | 'task_created'
    | 'task_overdue_flagged'
    | 'doc_uploaded'
    | 'doc_deleted'
    | 'doc_shared_with_client'
    | 'reminder_sent'
    | 'note_added'
    | 'portal_login'
    | 'portal_doc_viewed'
    | 'settings_changed'
    | 'manual_entry';
  description: string;
  actor: string; // CA name or 'System'/ 'Client'
  timestamp: string;
  clientId?: string;
  clientName?: string;
  metadata?: Record<string, string | number>;
}

export interface Invoice {
  id: string;
  caId: string;
  caFirmName: string;
  amount: number;
  plan: 'Starter' | 'Growth' | 'Pro';
  status: 'paid' | 'pending' | 'overdue' | 'refunded';
  invoiceDate: string;
  dueDate: string;
  paymentMethod: 'UPI' | 'NEFT' | 'Card' | 'Razorpay';
  razorpayOrderId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AdminAuditLog {
  timestamp: string;
  actor: string;
  event: string;
  ip: string;
}
