const offset = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const make = (i, title, description, status, priority, category, dueOffset, tags) => ({
  id: `demo-${i}`, title, description, status, priority, category, tags,
  dueDate: offset(dueOffset),
  createdAt: new Date(Date.now() - i * 36e5 * 5).toISOString(),
  updatedAt: new Date(Date.now() - i * 36e5 * 2).toISOString(),
});

export const getSeedTasks = () => [
  make(1, 'Design onboarding flow', 'Sketch the first-run experience and review with the team.', 'In Progress', 'High', 'Design', 2, ['ux', 'figma']),
  make(2, 'Fix login redirect bug', 'Users land on a blank page after session expiry.', 'To Do', 'High', 'Development', -2, ['bug']),
  make(3, 'Write release notes', 'Summarise v1.2 changes for the changelog.', 'To Do', 'Low', 'Marketing', 5, ['docs']),
  make(4, 'Set up CI pipeline', 'Run lint and build on every pull request.', 'Completed', 'Medium', 'Development', -4, ['devops']),
  make(5, 'Plan sprint retrospective', 'Collect feedback and prepare talking points.', 'In Progress', 'Medium', 'Planning', 1, ['team']),
  make(6, 'Update pricing page copy', 'Align copy with the new plan structure.', 'Completed', 'Low', 'Marketing', -1, ['copy']),
  make(7, 'Audit accessibility', 'Check contrast and keyboard navigation on core pages.', 'To Do', 'Medium', 'Design', 7, ['a11y']),
];

export const STATUSES = ['To Do', 'In Progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];
export const DEFAULT_CATEGORIES = ['Development', 'Design', 'Marketing', 'Planning'];
