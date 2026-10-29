import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pencil, Trash2, SearchX } from 'lucide-react';
import { useTasks } from '../context/TaskContext.jsx';
import { STATUSES, PRIORITIES } from '../utils/seed.js';
import { isOverdue, formatDate } from '../utils/taskUtils.js';
import { PriorityBadge, StatusBadge } from '../components/common/Badges.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

export default function MyTasks() {
  const { tasks, deleteTask, updateTask } = useTasks();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('due');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const q = (params.get('q') ?? '').toLowerCase();

  const visible = useMemo(() => {
    const list = tasks.filter((t) =>
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
      (!status || t.status === status) && (!priority || t.priority === priority));
    const sorters = {
      due: (a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'),
      priority: (a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority],
      created: (a, b) => b.createdAt.localeCompare(a.createdAt),
    };
    return list.sort(sorters[sort]);
  }, [tasks, q, status, priority, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input className="input max-w-xs" placeholder="Search…" aria-label="Search" value={params.get('q') ?? ''}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})} />
        <select className="input w-auto" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-auto" aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="input w-auto" aria-label="Sort tasks" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="due">Sort: Due date</option><option value="priority">Sort: Priority</option><option value="created">Sort: Newest</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center text-slate-500">
          <SearchX size={32} className="mb-2" />
          <p className="font-medium text-slate-700">No tasks match your filters</p>
          <p className="text-sm">Try clearing the search or filters, or add a new task.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((t) => (
            <li key={t.id} className="card flex flex-wrap items-center gap-3 !p-4">
              <input type="checkbox" aria-label={`Mark ${t.title} completed`} checked={t.status === 'Completed'}
                onChange={(e) => updateTask(t.id, { status: e.target.checked ? 'Completed' : 'To Do' })}
                className="h-4 w-4 rounded accent-brand-600" />
              <div className="min-w-0 flex-1">
                <p className={`font-medium ${t.status === 'Completed' ? 'text-slate-400 line-through' : ''}`}>{t.title}</p>
                <p className="truncate text-sm text-slate-500">{t.description}</p>
              </div>
              <span className={`text-xs ${isOverdue(t) ? 'font-semibold text-red-600' : 'text-slate-500'}`}>
                {isOverdue(t) ? 'Overdue · ' : ''}{formatDate(t.dueDate)}
              </span>
              <PriorityBadge value={t.priority} /><StatusBadge value={t.status} />
              <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Edit ${t.title}`} onClick={() => setEditing(t)}><Pencil size={16} /></button>
              <button className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label={`Delete ${t.title}`} onClick={() => setDeleting(t)}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}

      {editing && <TaskModal task={editing} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog title="Delete task?" message={`“${deleting.title}” will be permanently removed.`}
          onCancel={() => setDeleting(null)} onConfirm={() => { deleteTask(deleting.id); setDeleting(null); }} />
      )}
    </div>
  );
}
