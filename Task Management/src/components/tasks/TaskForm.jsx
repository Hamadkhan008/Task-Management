import { useState } from 'react';
import { STATUSES, PRIORITIES, DEFAULT_CATEGORIES } from '../../utils/seed.js';
import { validateTask } from '../../utils/taskUtils.js';

const empty = { title: '', description: '', status: 'To Do', priority: 'Medium', category: DEFAULT_CATEGORIES[0], dueDate: '', tags: [] };

function Field({ label, error, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...empty, ...initial });
  const [tagText, setTagText] = useState((initial?.tags ?? []).join(', '));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateTask(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    const tags = tagText.split(',').map((t) => t.trim()).filter(Boolean);
    onSubmit({ ...values, title: values.title.trim(), description: values.description.trim(), tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Title *" htmlFor="title" error={errors.title}>
        <input id="title" className="input" value={values.title} onChange={set('title')} placeholder="e.g. Prepare demo" />
      </Field>
      <Field label="Description" htmlFor="description">
        <textarea id="description" rows={3} className="input" value={values.description} onChange={set('description')} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status" htmlFor="status">
          <select id="status" className="input" value={values.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field label="Priority" htmlFor="priority">
          <select id="priority" className="input" value={values.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
        </Field>
        <Field label="Category" htmlFor="category">
          <select id="category" className="input" value={values.category} onChange={set('category')}>{DEFAULT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label="Due date" htmlFor="dueDate" error={errors.dueDate}>
          <input id="dueDate" type="date" className="input" value={values.dueDate} onChange={set('dueDate')} />
        </Field>
      </div>
      <Field label="Tags (comma separated)" htmlFor="tags">
        <input id="tags" className="input" value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="ux, urgent" />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary">{initial?.id ? 'Save changes' : 'Create task'}</button>
      </div>
    </form>
  );
}
