import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = { Low: '#94a3b8', Medium: '#f59e0b', High: '#ef4444' };
const dayKey = (d) => d.toISOString().slice(0, 10);

export default function Charts({ tasks }) {
  const priorityData = useMemo(
    () => ['Low', 'Medium', 'High'].map((name) => ({ name, value: tasks.filter((t) => t.priority === name).length })).filter((d) => d.value > 0),
    [tasks]
  );

  // Last 7 days: tasks created vs. completed (completion approximated by last update time).
  const weekly = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { key: dayKey(d), label: d.toLocaleDateString(undefined, { weekday: 'short' }), Created: 0, Completed: 0 };
    });
    const byKey = Object.fromEntries(days.map((d) => [d.key, d]));
    tasks.forEach((t) => {
      const c = byKey[(t.createdAt || '').slice(0, 10)];
      if (c) c.Created += 1;
      const u = byKey[(t.updatedAt || '').slice(0, 10)];
      if (u && t.status === 'Completed') u.Completed += 1;
    });
    return days;
  }, [tasks]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card">
        <h3 className="mb-3 font-semibold">Priority distribution</h3>
        {priorityData.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No data yet.</p> : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {priorityData.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
      <section className="card">
        <h3 className="mb-3 font-semibold">Weekly productivity</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" /><YAxis allowDecimals={false} /><Tooltip /><Legend />
              <Bar dataKey="Created" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
