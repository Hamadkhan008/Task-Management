import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useTasks } from '../context/TaskContext.jsx';
import { isOverdue, formatDate, isValidDate } from '../utils/taskUtils.js';
import Charts from '../components/dashboard/Charts.jsx';
import { PriorityBadge } from '../components/common/Badges.jsx';

function Stat({ label, value, icon: Icon, tone }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`rounded-lg p-2.5 ${tone}`}><Icon size={20} /></div>
      <div><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-slate-500">{label}</p></div>
    </div>
  );
}

export default function Dashboard() {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const overdue = tasks.filter(isOverdue).length;
    const upcoming = tasks
      .filter((t) => t.status !== 'Completed' && isValidDate(t.dueDate) && !isOverdue(t))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
    const recent = [...tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
    return { total: tasks.length, completed, pending: tasks.length - completed, overdue, upcoming, recent,
      percent: tasks.length ? Math.round((completed / tasks.length) * 100) : 0 };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back 👋</h2>
        <p className="text-slate-500">Here’s what’s happening with your tasks.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total tasks" value={stats.total} icon={ListChecks} tone="bg-brand-50 text-brand-600" />
        <Stat label="Completed" value={stats.completed} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" />
        <Stat label="Pending" value={stats.pending} icon={Clock} tone="bg-amber-50 text-amber-600" />
        <Stat label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="bg-red-50 text-red-600" />
      </div>

      <div className="card">
        <div className="mb-2 flex justify-between text-sm"><span className="font-medium">Completion progress</span><span>{stats.percent}%</span></div>
        <div className="h-2.5 rounded-full bg-slate-100" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${stats.percent}%` }} />
        </div>
      </div>

      <Charts tasks={tasks} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <h3 className="mb-3 font-semibold">Upcoming deadlines</h3>
          {stats.upcoming.length === 0 ? <p className="text-sm text-slate-500">No upcoming deadlines. 🎉</p> : (
            <ul className="divide-y divide-slate-100">
              {stats.upcoming.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{t.title}</span><span className="text-slate-500">{formatDate(t.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <div className="mb-3 flex justify-between"><h3 className="font-semibold">Recent activity</h3><Link to="/tasks" className="text-sm text-brand-600 hover:underline">View all</Link></div>
          {stats.recent.length === 0 ? <p className="text-sm text-slate-500">No tasks yet. Click “Add Task” to start.</p> : (
            <ul className="divide-y divide-slate-100">
              {stats.recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm"><span>{t.title}</span><PriorityBadge value={t.priority} /></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
