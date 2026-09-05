import React from 'react';
import { Inbox, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface DashboardStatWidgetsProps {
  stats: {
    total: number;
    new: number;
    inProgress: number;
    completed: number;
  };
}

export const DashboardStatWidgets: React.FC<DashboardStatWidgetsProps> = ({ stats }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'rgba(6, 95, 70, 0.1)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Inbox size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Inquiries
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {stats.total}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'rgba(26, 107, 255, 0.1)',
          color: '#1a6bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Clock size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            New Requests
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a6bff', lineHeight: 1.1 }}>
            {stats.new}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'rgba(200, 138, 0, 0.1)',
          color: '#c88a00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            In Progress
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#c88a00', lineHeight: 1.1 }}>
            {stats.inProgress}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'rgba(5, 150, 105, 0.1)',
          color: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <CheckCircle size={24} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Confirmed / Completed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1.1 }}>
            {stats.completed}
          </div>
        </div>
      </div>
    </div>
  );
};
