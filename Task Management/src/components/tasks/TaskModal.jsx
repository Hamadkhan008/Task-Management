import Modal from '../common/Modal.jsx';
import TaskForm from './TaskForm.jsx';
import { useTasks } from '../../context/TaskContext.jsx';

// Used for both create (task = null) and edit.
export default function TaskModal({ task, onClose }) {
  const { addTask, updateTask } = useTasks();
  const handleSubmit = (data) => {
    task ? updateTask(task.id, data) : addTask(data);
    onClose();
  };
  return (
    <Modal title={task ? 'Edit task' : 'New task'} onClose={onClose}>
      <TaskForm initial={task} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
