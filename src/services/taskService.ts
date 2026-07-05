import { apiClient } from './apiClient';
import { EmployeeTask, GetTasksParams, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

export interface TaskResponse<T> {
  message: string;
  data: T;
}

export const taskService = {
  /**
   * Get employee tasks based on filters.
   */
  async getTasks(params?: GetTasksParams): Promise<EmployeeTask[]> {
    const response = await apiClient.get<TaskResponse<EmployeeTask[]>>(
      '/employee/alpha/executions/employeeTask',
      { params }
    );
    return response.data.data;
  },

  /**
   * Create a new task.
   */
  async createTask(payload: CreateTaskPayload): Promise<EmployeeTask> {
    const response = await apiClient.post<TaskResponse<EmployeeTask>>(
      '/employee/alpha/executions/employeeTask',
      payload
    );
    return response.data.data;
  },

  /**
   * Update task details (e.g. status, name, etc.).
   */
  async updateTask(id: string, payload: UpdateTaskPayload): Promise<EmployeeTask> {
    const response = await apiClient.patch<TaskResponse<EmployeeTask>>(
      `/employee/alpha/executions/employeeTask/${id}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Archive a task by ID.
   */
  async archiveTask(id: string): Promise<void> {
    await apiClient.patch(`/employee/alpha/executions/employeeTask/archive/${id}`);
  },
};
