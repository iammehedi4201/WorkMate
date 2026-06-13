import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO string format "YYYY-MM-DD"
  status: 'Pending' | 'Completed' | 'Archived';
  emoji: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'hello',
    dueDate: '2026-06-27',
    status: 'Pending',
    emoji: '🍄',
  },
  {
    id: '2',
    title: 'watching one piece',
    dueDate: '2026-06-27',
    status: 'Pending',
    emoji: '🍄',
  },
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substring(2, 9),
            },
          ],
        })),
      updateTask: (id, updatedFields) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'app-tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
