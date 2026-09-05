/**
 * Med360 — Coordinator Task & Action Items Service
 * Manages clinical follow-ups, coordinator to-do items, and triage tasks.
 */

export interface CoordinatorTask {
  id: string;
  title: string;
  description?: string;
  category: 'clinical_review' | 'patient_followup' | 'hospital_coordination' | 'logistics' | 'billing';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  completed: boolean;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  relatedInquiryId?: string;
}

const TASKS_STORAGE_KEY = 'med360_coordinator_tasks_v1';

const DEFAULT_TASKS: CoordinatorTask[] = [
  {
    id: 'task-1',
    title: 'Review DICOM CT Thorax scan for Cardiac Consultation',
    description: 'Dr. Wong requested coronary angiogram and pre-op clearance review.',
    category: 'clinical_review',
    priority: 'urgent',
    completed: false,
    assignedTo: 'Dr. V. Sharma (Lead)',
    dueDate: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    relatedInquiryId: 'inq-1',
  },
  {
    id: 'task-2',
    title: 'Dispatch Multi-Currency Cost Estimate ($ USD / MUR) to Patient',
    description: 'Patient comparing Apollo Hospitals (Chennai) vs Bumrungrad (Bangkok).',
    category: 'patient_followup',
    priority: 'high',
    completed: false,
    assignedTo: 'Sarah M. (Coordinator)',
    dueDate: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Confirm Aeromedical Concierge & Airport Transfer in Delhi',
    description: 'Post-op wheelchair assistance and private interpreter for oncology patient.',
    category: 'logistics',
    priority: 'high',
    completed: false,
    assignedTo: 'Dev K. (Operations)',
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Verify NGO Enn Rêv Enn Sourir Treatment Subsidy Approval',
    description: 'Cross-check financial eligibility for urgent pediatric cardiac procedure.',
    category: 'hospital_coordination',
    priority: 'urgent',
    completed: true,
    assignedTo: 'Sarah M. (Coordinator)',
    dueDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Follow up WhatsApp consultation lead regarding IVF cycle in Thailand',
    description: 'Patient requested bilingual French/Creole medical coordinator contact.',
    category: 'patient_followup',
    priority: 'normal',
    completed: false,
    assignedTo: 'Sarah M. (Coordinator)',
    dueDate: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
];

export function getCoordinatorTasks(): CoordinatorTask[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveCoordinatorTasks(tasks: CoordinatorTask[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks to storage:', e);
  }
}

export function addCoordinatorTask(task: Omit<CoordinatorTask, 'id' | 'createdAt' | 'completed'>): CoordinatorTask {
  const newTask: CoordinatorTask = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    completed: false,
  };
  const current = getCoordinatorTasks();
  const updated = [newTask, ...current];
  saveCoordinatorTasks(updated);
  return newTask;
}

export function toggleCoordinatorTask(id: string): CoordinatorTask[] {
  const current = getCoordinatorTasks();
  const updated = current.map(t => {
    if (t.id === id) {
      const completed = !t.completed;
      return {
        ...t,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      };
    }
    return t;
  });
  saveCoordinatorTasks(updated);
  return updated;
}

export function deleteCoordinatorTask(id: string): CoordinatorTask[] {
  const current = getCoordinatorTasks();
  const updated = current.filter(t => t.id !== id);
  saveCoordinatorTasks(updated);
  return updated;
}
