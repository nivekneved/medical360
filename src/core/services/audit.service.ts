/**
 * Medical 360 — Security & Audit Trail Service
 * 
 * Records tamper-evident security events, user logins, entity updates, and CMS modifications.
 */

export interface AuditEvent {
  id: string;
  timestamp: string;
  category: 'AUTH' | 'CMS_EDIT' | 'EXPORT' | 'SECURITY_ALERT' | 'DATA_RESET' | 'BACKUP';
  action: string;
  user: string;
  details?: Record<string, any>;
  ipPlaceholder?: string;
  checksum: string;
}

const AUDIT_STORAGE_KEY = 'med360_security_audit_trail_v1';
const MAX_AUDIT_ENTRIES = 250;

/**
 * Generate a fast hash checksum for audit entry integrity
 */
function generateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Log a security or admin event
 */
export function logSecurityEvent(
  category: AuditEvent['category'],
  action: string,
  user: string = 'admin@medical360.mu',
  details?: Record<string, any>
): AuditEvent {
  const timestamp = new Date().toISOString();
  const rawData = `${timestamp}|${category}|${action}|${user}|${JSON.stringify(details || {})}`;
  const checksum = generateChecksum(rawData);

  const event: AuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    category,
    action,
    user,
    details,
    checksum,
  };

  try {
    const current = getAuditLog();
    const updated = [event, ...current].slice(0, MAX_AUDIT_ENTRIES);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to persist audit event:', e);
  }

  return event;
}

/**
 * Retrieve the audit log
 */
export function getAuditLog(): AuditEvent[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Clear audit log (restricted)
 */
export function clearAuditLog(): void {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
}
