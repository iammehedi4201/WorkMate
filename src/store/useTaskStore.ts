import { create } from 'zustand';
import { taskService } from '../services/taskService';
import { useAuthStore } from './useAuthStore';
import { EmployeeTask } from '../types/task';

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO string format "YYYY-MM-DD"
  status: 'Pending' | 'In Progress' | 'Completed' | 'Archived';
  emoji: string;
}

interface TaskState {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const mapBackendTaskToTask = (bt: EmployeeTask): Task => ({
  id: bt._id,
  title: bt.name,
  dueDate: bt.date ? bt.date.split('T')[0] : '',
  status: bt.isActive === false ? 'Archived' : (bt.status as 'Pending' | 'In Progress' | 'Completed'),
  emoji: '🍄',
});

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  fetchTasks: async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;

      // Fetch all active and archived tasks for the logged in user
      const activeTasks = await taskService.getTasks({ employeeId: user.id });
      const archivedTasks = await taskService.getTasks({ employeeId: user.id, tab: 'Archived' });

      const allMapped = [
        ...activeTasks.map(mapBackendTaskToTask),
        ...archivedTasks.map(mapBackendTaskToTask),
      ];

      set({ tasks: allMapped });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  },

  addTask: async (task) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;

      const created = await taskService.createTask({
        name: task.title,
        date: task.dueDate,
        employee: user.id,
      });

      const mapped = mapBackendTaskToTask(created);
      set({ tasks: [...get().tasks, mapped] });
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  updateTask: async (id, updatedFields) => {
    try {
      const payload: any = {};
      if (updatedFields.title !== undefined) payload.name = updatedFields.title;
      if (updatedFields.dueDate !== undefined) payload.date = updatedFields.dueDate;
      if (updatedFields.status !== undefined && updatedFields.status !== 'Archived') {
        payload.status = updatedFields.status;
      }

      if (updatedFields.status === 'Archived') {
        // Call archive endpoint
        await taskService.archiveTask(id);
      } else {
        // Call general update endpoint
        await taskService.updateTask(id, payload);
      }

      // Re-fetch to keep local state perfectly in sync
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      // For tasks "delete" means archiving on the backend
      await taskService.archiveTask(id);
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to delete/archive task:', error);
      throw error;
    }
  },
}));
