import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/storageService.js';
import { getSeedTasks } from '../utils/seed.js';
import { sanitizeTasks } from '../utils/taskUtils.js';

const TaskContext = createContext(null);

const loadTasks = () => sanitizeTasks(storageService.get('tasks')) ?? getSeedTasks();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasks);
  const [toasts, setToasts] = useState([]);

  useEffect(() => storageService.set('tasks', tasks), [tasks]);

  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const addTask = useCallback((data) => {
    const now = new Date().toISOString();
    setTasks((prev) => [{ ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now }, ...prev]);
    notify('Task created');
  }, [notify]);

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t)));
    notify('Task updated');
  }, [notify]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    notify('Task deleted');
  }, [notify]);

  const resetDemoData = useCallback(() => {
    setTasks(getSeedTasks());
    notify('Demo data restored');
  }, [notify]);

  const value = useMemo(
    () => ({ tasks, toasts, notify, addTask, updateTask, deleteTask, resetDemoData }),
    [tasks, toasts, notify, addTask, updateTask, deleteTask, resetDemoData]
  );
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
};
