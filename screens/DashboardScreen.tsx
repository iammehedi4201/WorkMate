import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import CreateTaskModal from '../src/components/CreateTaskModal';
import DashboardTasksModal from '../src/components/DashboardTasksModal';
import UpdateTaskModal from '../src/components/UpdateTaskModal';
import { useAuth } from '../src/hooks/useAuth';
import { useHeader } from '../src/context/HeaderContext';
import { Task, useTaskStore } from '../src/store/useTaskStore';
import ProfileCard from '../src/components/dashboard/ProfileCard';
import ShortcutsSection from '../src/components/dashboard/ShortcutsSection';
import ToDoSection from '../src/components/dashboard/ToDoSection';

interface DashboardScreenProps {
  onNavigateAttendance: () => void;
}

export default function DashboardScreen({ onNavigateAttendance }: DashboardScreenProps) {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTaskStore();

  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isAllTasksVisible, setIsAllTasksVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useHeader({
    showLogo: true,
    showMenu: true,
    activeScreen: 'Dashboard',
    onNavigate: screen => {
      if (screen === 'Attendance') {
        onNavigateAttendance();
      }
    },
  });

  // Get pending / in progress tasks
  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
  const pendingCount = pendingTasks.length;

  // Format date remaining text
  const getDaysRemainingText = (dueDateStr: string) => {
    try {
      const today = new Date();
      const due = new Date(dueDateStr);

      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return `${absDays} ${absDays === 1 ? 'DAY' : 'DAYS'} AGO`;
      } else if (diffDays === 0) {
        return 'DUE TODAY';
      } else {
        return `IN ${diffDays} DAYS`;
      }
    } catch (e: any) {
      console.log(e.message);
      return 'DUE DATE';
    }
  };

  console.log('user -- >', user);

  return (
    <View className="flex-1 bg-[#020202]">
      {/* Main Content Scroll */}
      <ScrollView
        className="flex-1 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <ProfileCard user={user} />
        <ShortcutsSection onNavigateAttendance={onNavigateAttendance} />
        <ToDoSection
          pendingTasks={pendingTasks}
          pendingCount={pendingCount}
          setIsCreateVisible={setIsCreateVisible}
          setIsAllTasksVisible={setIsAllTasksVisible}
          setEditingTask={setEditingTask}
        />
      </ScrollView>

      {/* Create Task Modal */}
      <CreateTaskModal isVisible={isCreateVisible} onClose={() => setIsCreateVisible(false)} />

      {/* All Tasks Modal */}
      <DashboardTasksModal
        isVisible={isAllTasksVisible}
        onClose={() => setIsAllTasksVisible(false)}
      />

      {/* Edit/Update Task Modal */}
      <UpdateTaskModal
        isVisible={editingTask !== null}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
    </View>
  );
}
