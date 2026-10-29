import { useDraggable } from '@dnd-kit/core';
import { CalendarDays } from 'lucide-react';
import { PriorityBadge } from '../common/Badges.jsx';
import { formatDate, isOverdue } from '../../utils/taskUtils.js';

export function CardBody({ task }) {
  return (
    <>
      <p className="text-sm font-medium">{task.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <PriorityBadge value={task.priority} />
        {task.category && <span className="rounded bg-slate-100 px-1.5 py-0.5">{task.category}</span>}
        <span className={`ml-auto flex items-center gap-1 ${isOverdue(task) ? 'font-semibold text-red-600' : ''}`}>
          <CalendarDays size={12} />{formatDate(task.dueDate)}
        </span>
      </div>
    </>
  );
}

export default function KanbanCard({ task, onOpen }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} onClick={() => onOpen(task)}
      className={`cursor-grab touch-none rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md ${isDragging ? 'opacity-40' : ''}`}>
      <CardBody task={task} />
    </div>
  );
}
