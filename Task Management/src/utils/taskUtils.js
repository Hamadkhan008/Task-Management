import { STATUSES, PRIORITIES } from './seed.js';

export const isValidDate = (s) => typeof s === 'string' && s !== '' && !Number.isNaN(new Date(s).getTime());

export const isOverdue = (task) =>
  task.status !== 'Completed' && isValidDate(task.dueDate) &&
  new Date(task.dueDate + 'T23:59:59') < new Date();

export const formatDate = (s) =>
  isValidDate(s) ? new Date(s + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';

// Drops malformed entries from LocalStorage instead of crashing the app.
export const sanitizeTasks = (data) => {
  if (!Array.isArray(data)) return null;
  return data
    .filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string' && t.title.trim())
    .map((t) => ({
      description: '', category: '', tags: [], dueDate: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      ...t,
      status: STATUSES.includes(t.status) ? t.status : 'To Do',
      priority: PRIORITIES.includes(t.priority) ? t.priority : 'Medium',
      tags: Array.isArray(t.tags) ? t.tags : [],
    }));
};

export const validateTask = (v) => {
  const errors = {};
  if (!v.title.trim()) errors.title = 'Title is required.';
  else if (v.title.length > 80) errors.title = 'Title must be 80 characters or fewer.';
  if (v.dueDate && !isValidDate(v.dueDate)) errors.dueDate = 'Enter a valid date.';
  return errors;
};
