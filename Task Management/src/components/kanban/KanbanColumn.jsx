import { useDroppable } from '@dnd-kit/core';
import { Inbox } from 'lucide-react';
import KanbanCard from './KanbanCard.jsx';

export default function KanbanColumn({ status, tasks, onOpen }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <section aria-label={status} className={`flex min-h-[18rem] flex-col rounded-xl border p-3 transition ${isOver ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-slate-100/60'}`}>
      <h3 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold">
        {status}<span className="rounded-full bg-white px-2 text-xs text-slate-500">{tasks.length}</span>
      </h3>
      <div ref={setNodeRef} className="flex-1 space-y-2">
        {tasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center text-xs text-slate-400">
            <Inbox size={24} className="mb-1" />Drop a task here
          </div>
        ) : tasks.map((t) => <KanbanCard key={t.id} task={t} onOpen={onOpen} />)}
      </div>
    </section>
  );
}
