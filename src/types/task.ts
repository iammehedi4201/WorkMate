export interface TaskUserRef {
  _id: string;
  name: string;
  nickName?: string;
  dp?: string;
}

export interface EmployeeTask {
  _id: string;
  name: string;
  date: string; // ISO string or simple date string
  status: 'Pending' | 'Completed';
  isActive: boolean;
  employee: TaskUserRef | string;
  assignedBy: TaskUserRef | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTasksParams {
  employeeId?: string;
  tab?: 'Pending' | 'Completed' | 'Archived';
  viewType?: 'team' | 'personal';
  sbu?: string;
}

export interface CreateTaskPayload {
  name: string;
  date: string;
  employee: string;
  assignedBy?: string;
}

export interface UpdateTaskPayload {
  name?: string;
  date?: string;
  status?: 'Pending' | 'Completed';
  isActive?: boolean;
}
