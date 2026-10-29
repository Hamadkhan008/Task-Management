const PRIORITY = { Low: 'bg-slate-100 text-slate-600', Medium: 'bg-amber-100 text-amber-700', High: 'bg-red-100 text-red-700' };
const STATUS = { 'To Do': 'bg-slate-100 text-slate-600', 'In Progress': 'bg-blue-100 text-blue-700', Completed: 'bg-emerald-100 text-emerald-700' };
const base = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium';

export const PriorityBadge = ({ value }) => <span className={`${base} ${PRIORITY[value]}`}>{value}</span>;
export const StatusBadge = ({ value }) => <span className={`${base} ${STATUS[value]}`}>{value}</span>;
