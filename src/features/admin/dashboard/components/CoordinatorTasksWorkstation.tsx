import { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import {
  CoordinatorTask,
  getCoordinatorTasks,
  addCoordinatorTask,
  toggleCoordinatorTask,
  deleteCoordinatorTask,
} from '../../../../core/services/task.service';
import { formatRelativeTime } from '../../../../core/services/format.service';

const PRIORITY_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  urgent: { label: 'URGENT', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  high: { label: 'HIGH', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  normal: { label: 'NORMAL', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  low: { label: 'LOW', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' },
};

const CATEGORY_LABELS: Record<string, string> = {
  clinical_review: '🩺 Clinical Review',
  patient_followup: '📞 Patient Follow-up',
  hospital_coordination: '🏥 Hospital Liaison',
  logistics: '✈️ Logistics & Travel',
  billing: '💳 Estimate & Billing',
};

export function CoordinatorTasksWorkstation() {
  const [tasks, setTasks] = useState<CoordinatorTask[]>([]);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'pending' | 'completed'>('pending');
  const [showAddForm, setShowAddForm] = useState(false);

  // New task form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CoordinatorTask['category']>('patient_followup');
  const [newPriority, setNewPriority] = useState<CoordinatorTask['priority']>('high');
  const [newAssignee, setNewAssignee] = useState('Sarah M. (Coordinator)');
  const [newDueDateHours, setNewDueDateHours] = useState('8');

  useEffect(() => {
    setTasks(getCoordinatorTasks());
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleCoordinatorTask(id);
    setTasks(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteCoordinatorTask(id);
    setTasks(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const dueHours = parseInt(newDueDateHours) || 8;
    const dueDate = new Date(Date.now() + dueHours * 3600 * 1000).toISOString();

    addCoordinatorTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      assignedTo: newAssignee,
      dueDate,
    });

    setTasks(getCoordinatorTasks());
    setNewTitle('');
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'urgent') return t.priority === 'urgent' && !t.completed;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && !t.completed).length;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.85rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={18} color="var(--color-primary)" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            Coordinator Tasks & Action Items
          </h3>
          {urgentCount > 0 && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: '#ef4444',
              color: '#fff',
            }}>
              {urgentCount} URGENT
            </span>
          )}
        </div>

        {/* Inline Add Task Toggle Button (No popup/modal - strictly complies with AGENTS.md) */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-sm btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          {showAddForm ? <ChevronUp size={14} /> : <Plus size={14} />}
          {showAddForm ? 'Close Form' : 'New Action Item'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {(['pending', 'urgent', 'all', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: filter === f ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: filter === f ? 'var(--color-primary)' : 'var(--color-bg)',
              color: filter === f ? '#fff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f === 'pending' ? `Active Queue (${pendingCount})` : f}
          </button>
        ))}
      </div>

      {/* Inline Non-Modal Add Task Form (Embeds into flow) */}
      {showAddForm && (
        <form
          onSubmit={handleCreateTask}
          style={{
            background: 'var(--color-bg)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            + Create New Coordinator Action Item
          </div>
          <input
            type="text"
            placeholder="Task description (e.g. Schedule second opinion with Fortis)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
            className="form-input form-input--sm"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="form-select form-select--sm"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                Priority
              </label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="form-select form-select--sm"
              >
                <option value="urgent">Urgent (Immediate)</option>
                <option value="high">High (&lt; 12 Hours)</option>
                <option value="normal">Normal (24-48 Hours)</option>
                <option value="low">Low (Routine)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                Due In
              </label>
              <select
                value={newDueDateHours}
                onChange={e => setNewDueDateHours(e.target.value)}
                className="form-select form-select--sm"
              >
                <option value="4">4 Hours</option>
                <option value="8">8 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.78rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ fontSize: '0.78rem' }}
            >
              Save Action Item
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        overflowY: 'auto',
        maxHeight: '440px',
        paddingRight: '4px',
      }}>
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            No action items in this filter view.
          </div>
        ) : (
          filteredTasks.map(task => {
            const pBadge = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.normal;
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: task.completed ? 'var(--color-surface-2)' : 'var(--color-bg)',
                  border: task.priority === 'urgent' && !task.completed
                    ? '1.5px solid #ef4444'
                    : '1px solid var(--color-border)',
                  opacity: task.completed ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggle(task.id)}
                  title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    marginTop: '2px',
                    color: task.completed ? '#10b981' : 'var(--color-text-muted)',
                  }}
                >
                  {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: pBadge.bg,
                      color: pBadge.color,
                      border: `1px solid ${pBadge.color}30`,
                      flexShrink: 0,
                    }}>
                      {pBadge.label}
                    </span>
                  </div>

                  {task.description && (
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.35,
                    }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.65rem',
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      {CATEGORY_LABELS[task.category] || task.category}
                    </span>
                    <span>•</span>
                    <span><User size={11} style={{ display: 'inline', marginRight: '2px' }} />{task.assignedTo}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} />
                      Due {formatRelativeTime(task.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  title="Delete action item"
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--color-text-muted)', padding: '2px 4px' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
