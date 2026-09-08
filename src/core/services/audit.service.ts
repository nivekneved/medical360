/**
 * Med360 Administrative & Security Audit Logging Service
 * Records mutations, security alerts, SEO updates, and system configuration toggles.
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: 'create' | 'update' | 'delete' | 'toggle_maintenance' | 'update_seo' | 'login' | 'export' | 'bulk_action' | string;
  entityType: 'hospital' | 'specialty' | 'doctor' | 'case_study' | 'inquiry' | 'seo' | 'system' | 'auth' | string;
  entityId?: string;
  entityName?: string;
  details: string;
  ipAddress?: string;
  // Backward compatibility fields for legacy feed
  user?: string;
  category?: string;
  checksum?: string;
}

const STORAGE_KEY = 'med360_audit_logs';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorName: 'Deven Admin',
    actorRole: 'super_admin',
    user: 'Deven Admin',
    category: 'AUTH_SESSION',
    checksum: 'a8f9c1',
    action: 'login',
    entityType: 'auth',
    details: 'Authenticated successfully via secure admin gateway',
    ipAddress: '102.115.42.18 (Mauritius)',
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actorName: 'Deven Admin',
    actorRole: 'super_admin',
    user: 'Deven Admin',
    category: 'SEO_OVERRIDE',
    checksum: 'e4b2d9',
    action: 'update_seo',
    entityType: 'seo',
    details: 'Modified French meta title & description for /specialties/cardiology',
    ipAddress: '102.115.42.18 (Mauritius)',
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actorName: 'Deven Admin',
    actorRole: 'super_admin',
    user: 'Deven Admin',
    category: 'MAINTENANCE_TOGGLE',
    checksum: 'f7c81a',
    action: 'toggle_maintenance',
    entityType: 'system',
    details: 'Verified emergency hotline numbers & generated client preview token',
    ipAddress: '102.115.42.18 (Mauritius)',
  },
];

class AuditService {
  private logs: AuditLogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.logs = JSON.parse(raw);
      } else {
        this.logs = [...INITIAL_AUDIT_LOGS];
        this.persist();
      }
    } catch {
      this.logs = [...INITIAL_AUDIT_LOGS];
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      const capped = this.logs.slice(0, 500);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
    } catch {}
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      ipAddress: entry.ipAddress || 'Client Session (Direct)',
      user: entry.user || entry.actorName || 'Administrator',
      category: entry.category || entry.entityType.toUpperCase(),
      checksum: entry.checksum || Math.random().toString(16).slice(2, 8),
    };

    this.logs.unshift(newEntry);
    this.persist();
    return newEntry;
  }

  public getLogs(filters?: {
    action?: string;
    entityType?: string;
    search?: string;
  }): AuditLogEntry[] {
    let result = [...this.logs];

    if (filters?.action && filters.action !== 'all') {
      result = result.filter((l) => l.action === filters.action);
    }

    if (filters?.entityType && filters.entityType !== 'all') {
      result = result.filter((l) => l.entityType === filters.entityType);
    }

    if (filters?.search?.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.details.toLowerCase().includes(q) ||
          l.actorName.toLowerCase().includes(q) ||
          (l.entityName && l.entityName.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public clearLogs(): void {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  public exportCsv(): string {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Entity Type', 'Details', 'IP/Origin'];
    const rows = this.logs.map((l) => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.entityType}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress || 'N/A'}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const auditService = new AuditService();

// ── Legacy Compatibility Helpers ─────────────────────────────────────────────
export function logSecurityEvent(
  action: string,
  category: string,
  details: string = '',
  actorName: string = 'System'
): void {
  auditService.log({
    actorName,
    actorRole: 'system',
    action,
    entityType: 'system',
    category,
    details: typeof details === 'string' ? details : JSON.stringify(details),
  });
}

export function getAuditLog(): AuditLogEntry[] {
  return auditService.getLogs();
}
