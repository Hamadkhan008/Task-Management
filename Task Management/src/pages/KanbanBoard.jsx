import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTasks } from '../context/TaskContext.jsx';
import { STATUSES } from '../utils/seed.js';
import KanbanColumn from '../components/kanban/KanbanColumn.jsx';
import { CardBody } from '../components/kanban/KanbanCard.jsx';
import TaskModal from '../components/tasks/TaskModal.jsx';

export default function KanbanBoard() {
  const { tasks, updateTask } = useTasks();
  const [activeId, setActiveId] = useState(null);
  const [editing, setEditing] = useState(null);
  // A small drag distance lets a plain click open the editor instead of starting a drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const active = tasks.find((t) => t.id === activeId);

  const handleDragEnd = ({ active: a, over }) => {
    setActiveId(null);
    const task = tasks.find((t) => t.id === a.id);
    if (task && over && over.id !== task.status) updateTask(task.id, { status: over.id });
  };

  return (
    <>
      <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map((s) => (
            <KanbanColumn key={s} status={s} tasks={tasks.filter((t) => t.status === s)} onOpen={setEditing} />
          ))}
        </div>
        <DragOverlay>
          {active && <div className="rounded-lg border border-brand-500 bg-white p-3 shadow-xl"><CardBody task={active} /></div>}
        </DragOverlay>
      </DndContext>
      {editing && <TaskModal task={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
