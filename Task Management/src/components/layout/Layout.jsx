import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, LayoutGrid, Menu, Plus, Search, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext.jsx';
import TaskModal from '../tasks/TaskModal.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/kanban', label: 'Kanban Board', icon: LayoutGrid },
];
const TITLES = { '/': 'Dashboard', '/tasks': 'My Tasks', '/kanban': 'Kanban Board' };

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const { toasts } = useTasks();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/tasks?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="flex min-h-screen">
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar p-4 text-slate-300 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold text-white">
          <CheckCircle2 className="text-brand-500" /> Task Management
        </div>
        <nav className="space-y-1" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <button className="rounded p-2 hover:bg-slate-100 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <h1 className="hidden text-lg font-semibold sm:block">{TITLES[pathname] ?? 'Task Management'}</h1>
          <form onSubmit={handleSearch} className="relative ml-auto max-w-xs flex-1" role="search">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input className="input pl-9" placeholder="Search tasks…" aria-label="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
          <button className="btn-primary" onClick={() => setCreating(true)}><Plus size={16} /> <span className="hidden sm:inline">Add Task</span></button>
        </header>
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>

      {creating && <TaskModal onClose={() => setCreating(false)} />}

      <div className="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-lg px-4 py-2 text-sm text-white shadow-lg ${t.type === 'error' ? 'bg-red-600' : 'bg-slate-800'}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
