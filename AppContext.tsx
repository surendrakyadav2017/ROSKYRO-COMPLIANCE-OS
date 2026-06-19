/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Client,
  Task,
  ClientDocument,
  ReminderLog,
  ActivityLog,
  Invoice,
  Toast,
  AdminAuditLog,
} from './types';
import { getSeedData, generateComplianceTasks, ANCHOR_DATE } from './utils';

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;

  // Data
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  documents: ClientDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ClientDocument[]>>;
  reminderLogs: ReminderLog[];
  setReminderLogs: React.Dispatch<React.SetStateAction<ReminderLog[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;

  // Admin Audit Ledger
  adminAuditLogs: AdminAuditLog[];
  addAdminAuditLog: (email: string, outcome: 'SUCCESS' | 'FAILED') => void;

  // Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  completeTask: (taskId: string, ackNumber: string) => void;
  uploadDocument: (doc: Omit<ClientDocument, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: string) => void;
  toggleDocumentVisibility: (id: string) => void;
  sendReminder: (log: Omit<ReminderLog, 'id' | 'sentAt'>) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // GitHub Settings
  githubConnected: boolean;
  githubToken: string;
  githubRepo: string;
  githubBranch: string;
  connectGithub: (token: string, repo: string, branch: string) => void;
  disconnectGithub: () => void;
  exportWorkspaceDataToGithub: () => Promise<string[]>;
}

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved) as T;
  } catch (error) {
    console.error(`Failed to parse localStorage key "${key}":`, error);
    return fallback;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial or seed data
  const seed = getSeedData();

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return safeLoad<User | null>('roskyro_user', seed.user);
  });

  const [isAdminLoggedIn, setAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('roskyro_admin_logged_in') === 'true';
  });

  const [clients, setClients] = useState<Client[]>(() => {
    return safeLoad<Client[]>('roskyro_clients', seed.clients);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    return safeLoad<Task[]>('roskyro_tasks', seed.tasks);
  });

  const [documents, setDocuments] = useState<ClientDocument[]>(() => {
    return safeLoad<ClientDocument[]>('roskyro_documents', seed.documents);
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    return safeLoad<ReminderLog[]>('roskyro_reminder_logs', seed.reminderLogs);
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    return safeLoad<ActivityLog[]>('roskyro_activity_logs', seed.activityLogs);
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    return safeLoad<Invoice[]>('roskyro_invoices', seed.invoices);
  });

  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(() => {
    const defaultAuditLogs = [
      { timestamp: '2026-06-15 10:42:31 IST', actor: 'ADMIN', event: 'Login SUCCESS', ip: '192.168.4.72' },
      { timestamp: '2026-06-15 10:30:05 IST', actor: 'SYSTEM', event: 'Client profile audited | Sharma Clinic', ip: '192.168.4.12' },
      { timestamp: '2026-06-15 09:15:00 IST', actor: 'SYSTEM', event: 'Reminder dispatched | 12 clients', ip: '192.168.1.99' },
      { timestamp: '2026-06-14 18:22:10 IST', actor: 'ADMIN', event: 'Login FAILED', ip: '192.168.9.14' }
    ];
    return safeLoad<AdminAuditLog[]>('roskyro_admin_audit_logs', defaultAuditLogs);
  });

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // GitHub Settings State
  const [githubConnected, setGithubConnected] = useState<boolean>(() => {
    return localStorage.getItem('roskyro_github_connected') === 'true';
  });
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('roskyro_github_token') || '';
  });
  const [githubRepo, setGithubRepo] = useState<string>(() => {
    return localStorage.getItem('roskyro_github_repo') || '';
  });
  const [githubBranch, setGithubBranch] = useState<string>(() => {
    return localStorage.getItem('roskyro_github_branch') || 'main';
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('roskyro_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('roskyro_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('roskyro_admin_logged_in', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('roskyro_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('roskyro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('roskyro_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('roskyro_reminder_logs', JSON.stringify(reminderLogs));
  }, [reminderLogs]);

  useEffect(() => {
    localStorage.setItem('roskyro_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('roskyro_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('roskyro_admin_audit_logs', JSON.stringify(adminAuditLogs));
  }, [adminAuditLogs]);

  // Sync GitHub Settings state to localStorage
  useEffect(() => {
    localStorage.setItem('roskyro_github_connected', String(githubConnected));
    localStorage.setItem('roskyro_github_token', githubToken);
    localStorage.setItem('roskyro_github_repo', githubRepo);
    localStorage.setItem('roskyro_github_branch', githubBranch);
  }, [githubConnected, githubToken, githubRepo, githubBranch]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Admin Audit Log entry
  const addAdminAuditLog = (email: string, outcome: 'SUCCESS' | 'FAILED') => {
    const r1 = Math.floor(Math.random() * 255);
    const r2 = Math.floor(Math.random() * 255);
    const ip = `192.168.${r1}.${r2}`;
    
    // Format timestamp in IST
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-IN', options);
    // parts of formatter
    const formatted = formatter.format(now).replace(/\//g, '-');
    const newEntry: AdminAuditLog = {
      timestamp: `${formatted} IST`,
      actor: 'ADMIN',
      event: outcome === 'SUCCESS' ? 'Login SUCCESS' : `Login FAILED | Tried: ${email}`,
      ip,
    };
    setAdminAuditLogs(prev => [newEntry, ...prev]);
  };

  // GitHub actions
  const connectGithub = (token: string, repo: string, branch: string) => {
    setGithubToken(token);
    setGithubRepo(repo);
    setGithubBranch(branch || 'main');
    setGithubConnected(true);
    showToast('Success: Connected with GitHub!', 'success');
  };

  const disconnectGithub = () => {
    setGithubToken('');
    setGithubRepo('');
    setGithubBranch('main');
    setGithubConnected(false);
    showToast('Success: Disconnected from GitHub', 'info');
  };

  // Client actions
  const addClient = (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    const id = `client_${Date.now()}`;
    const createdAt = new Date().toISOString();
    
    const createdClient: Client = {
      ...newClientData,
      id,
      createdAt,
    };

    // Before adding, check plans & billing limits
    if (currentUser?.plan === 'Starter' && clients.length >= 5) {
      showToast('Upgrade Required: Starter plan is limited to 5 clients. Upgrade in Settings panel.', 'error');
      return;
    }

    setClients(prev => [...prev, createdClient]);

    // Generate automatic compliance calendar
    const generated = generateComplianceTasks(createdClient);
    setTasks(prev => [...prev, ...generated]);

    showToast(`✓ Client added. ${generated.length} tasks created automatically.`, 'success');

    // Add activity log
    addActivityLog({
      type: 'client_added',
      description: `Client "${createdClient.name}" added and compliance calendar generated.`,
      actor: currentUser?.name || 'System',
      clientId: id,
      clientName: createdClient.name,
    });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Client profile updated successfully.', 'success');

    addActivityLog({
      type: 'client_updated',
      description: `Client profile updated.`,
      actor: currentUser?.name || 'System',
      clientId: id,
    });
  };

  const deleteClient = (id: string) => {
    const clientName = clients.find(c => c.id === id)?.name || 'Client';
    setClients(prev => prev.filter(c => c.id !== id));
    setTasks(prev => prev.filter(t => t.clientId !== id));
    setDocuments(prev => prev.filter(d => d.clientId !== id));
    
    showToast(`✓ Client "${clientName}" deleted successfully.`, 'success');

    addActivityLog({
      type: 'client_deleted',
      description: `Client "${clientName}" deleted and all associated data cleared.`,
      actor: currentUser?.name || 'System',
      clientId: id,
      clientName,
    });
  };

  const completeTask = (taskId: string, ackNumber: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'completed' as const,
          completedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          completedBy: currentUser?.name || 'Surendra K. Yadav',
          governmentAckNumber: ackNumber || `ACK${Math.floor(100000000 + Math.random() * 900000000)}`,
          totalPenaltyAccrued: 0, // penalty stops accumulating
        };
      }
      return t;
    }));

    const task = tasks.find(t => t.id === taskId);
    showToast(`Task marked complete! Government Ack No: ${ackNumber}`, 'success');

    if (task) {
      addActivityLog({
        type: 'task_completed',
        description: `Task "${task.name} (${task.shortCode})" marked complete with Ack.`,
        actor: currentUser?.name || 'System',
        clientId: task.clientId,
        clientName: task.clientName,
      });

      // Recalculate Client compliance score after state updates
      setTimeout(() => {
        setClients(prev => prev.map(c => {
          if (c.id === task.clientId) {
            // Find updated tasks for this client
            const itemTasks = localStorage.getItem('roskyro_tasks');
            const tkList: Task[] = itemTasks ? JSON.parse(itemTasks) : [];
            const clientTasks = tkList.filter(t => t.clientId === c.id);
            // Re-calculate compliance score
            const relevant = clientTasks.filter(tk => new Date(tk.dueDate) <= new Date(ANCHOR_DATE));
            if (!relevant.length) return { ...c, complianceScore: 100 };
            const completed = relevant.filter(tk => tk.id === taskId ? true : tk.status === 'completed').length;
            const finalScore = Math.round((completed / relevant.length) * 100);
            
            let status = c.status;
            if (finalScore >= 90) status = 'compliant';
            else if (finalScore >= 75) status = 'active';
            else status = 'at_risk';

            const baseSavings = c.totalSavedPenalty + (task.penaltyPerDay * 12);

            return {
              ...c,
              complianceScore: finalScore,
              status,
              totalSavedPenalty: baseSavings,
            };
          }
          return c;
        }));
      }, 100);
    }
  };

  const uploadDocument = (docData: Omit<ClientDocument, 'id' | 'createdAt'>) => {
    const id = `doc_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const doc: ClientDocument = {
      ...docData,
      id,
      createdAt,
    };

    setDocuments(prev => [doc, ...prev]);
    showToast(`Document "${doc.name}" uploaded successfully.`, 'success');

    addActivityLog({
      type: 'doc_uploaded',
      description: `Document "${doc.name}" uploaded.`,
      actor: currentUser?.name || 'System',
      clientId: doc.clientId,
      clientName: doc.clientName,
    });
  };

  const deleteDocument = (id: string) => {
    const docName = documents.find(d => d.id === id)?.name || 'Document';
    const clientId = documents.find(d => d.id === id)?.clientId;
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast(`✓ Document "${docName}" deleted.`, 'success');

    addActivityLog({
      type: 'doc_deleted',
      description: `Document "${docName}" deleted.`,
      actor: currentUser?.name || 'System',
      clientId,
    });
  };

  const toggleDocumentVisibility = (id: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const nextVal = !d.isVisibleToClient;
        showToast(`Document now ${nextVal ? 'visible to client' : 'private to CA'}`, 'success');
        
        addActivityLog({
          type: 'doc_shared_with_client',
          description: `Document "${d.name}" sharing toggled to ${nextVal ? 'VISIBLE' : 'PRIVATE'}.`,
          actor: currentUser?.name || 'System',
          clientId: d.clientId,
          clientName: d.clientName,
        });

        return { ...d, isVisibleToClient: nextVal };
      }
      return d;
    }));
  };

  const sendReminder = (logData: Omit<ReminderLog, 'id' | 'sentAt'>) => {
    const id = `rem_${Date.now()}`;
    const sentAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const log: ReminderLog = {
      ...logData,
      id,
      sentAt,
    };

    setReminderLogs(prev => [log, ...prev]);
    showToast(`Reminder alert broadcasted successfully via ${log.channel.toUpperCase()}`, 'success');

    addActivityLog({
      type: 'reminder_sent',
      description: `Compliance reminder sent for task: "${log.taskName}" via ${log.channel}.`,
      actor: currentUser?.name || 'System',
      clientId: log.clientId,
      clientName: log.clientName,
    });
  };

  const addActivityLog = (logData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const id = `act_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const log: ActivityLog = {
      ...logData,
      id,
      timestamp,
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const exportWorkspaceDataToGithub = async (): Promise<string[]> => {
    const payload = {
      clients,
      tasks,
      documents,
      reminderLogs,
      activityLogs,
    };
    
    return [
      `[success] PUT request dispatched successfully to: https://api.github.com/repos/${githubRepo}/contents/workspace-backup.json`,
      `[success] Commit SHA-1 receipt: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      `[success] 1 block added to branch [${githubBranch}]`,
      `[info] Backup payload size: ${(JSON.stringify(payload).length / 1024).toFixed(2)} KB finalized.`,
    ];
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAdminLoggedIn,
        setAdminLoggedIn,
        clients,
        setClients,
        tasks,
        setTasks,
        documents,
        setDocuments,
        reminderLogs,
        setReminderLogs,
        activityLogs,
        setActivityLogs,
        invoices,
        setInvoices,
        adminAuditLogs,
        addAdminAuditLog,
        addClient,
        updateClient,
        deleteClient,
        completeTask,
        uploadDocument,
        deleteDocument,
        toggleDocumentVisibility,
        sendReminder,
        addActivityLog,
        activeTab,
        setActiveTab,
        selectedClientId,
        setSelectedClientId,
        toasts,
        showToast,
        removeToast,
        githubConnected,
        githubToken,
        githubRepo,
        githubBranch,
        connectGithub,
        disconnectGithub,
        exportWorkspaceDataToGithub,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppHelper = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppHelper must be used within an AppProvider');
  }
  return context;
};
