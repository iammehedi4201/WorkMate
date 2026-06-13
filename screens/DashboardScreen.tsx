import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../src/components/Header';
import CreateTaskModal from '../src/components/CreateTaskModal';
import DashboardTasksModal from '../src/components/DashboardTasksModal';
import TopSheetDrawer from '../src/components/TopSheetDrawer';
import UpdateTaskModal from '../src/components/UpdateTaskModal';
import { useAuth } from '../src/hooks/useAuth';
import { Task, useTaskStore } from '../src/store/useTaskStore';

interface DashboardScreenProps {
  onNavigateAttendance: () => void;
}

export default function DashboardScreen({ onNavigateAttendance }: DashboardScreenProps) {
  const { user } = useAuth();
  const { tasks } = useTaskStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isAllTasksVisible, setIsAllTasksVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get pending tasks
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
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
    } catch (e) {
      return 'DUE DATE';
    }
  };

  return (
    <View className="flex-1 bg-[#020202] ">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#020202" />

        {/* Header */}
        <Header showLogo showMenu onMenuPress={() => setIsDrawerOpen(true)} />

        {/* Main Content Scroll */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          {/* Profile Card */}
          <View className="bg-[#161616]  p-5 rounded-lg mb-3 flex-row gap-2 items-center space-x-4">
            <View className="w-20 h-20 rounded-lg overflow-hidden p-1  justify-center items-center">
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png',
                }}
                style={{ width: '100%', height: '100%', borderRadius: 20 }}
                contentFit="contain"
              />
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-[#888888] text-[13px] font-semibold">Hello,</Text>
              <Text
                className="text-white text-xl font-black mb-1.5 tracking-tight"
                numberOfLines={1}>
                {user?.name || 'Sheehan Rahman'}
              </Text>
              <View className="self-start border border-[#333333] px-3 py-1 rounded-lg bg-[#111111]/45">
                <Text className="text-[#888888] text-[11px] font-semibold uppercase tracking-wider">
                  software engineer
                </Text>
              </View>
            </View>
          </View>

          {/* Shortcuts */}
          <View className="bg-[#161616] border border-[#222222] p-5 rounded-lg mb-3">
            <Text className="text-white text-lg font-black mb-4 tracking-tight">Shortcuts</Text>
            <TouchableOpacity
              onPress={onNavigateAttendance}
              activeOpacity={0.8}
              className="flex-row items-center justify-between bg-[#111111] border border-[#222222] p-3 rounded-lg active:bg-[#1a1a1a]">
              <View className="flex-row gap-2 items-center space-x-3.5">
                <View className="w-10 h-10 bg-[#222222] border border-[#333333] rounded-lg items-center justify-center">
                  <Ionicons name="time-outline" size={20} color="#ffffff" />
                </View>
                <Text className="text-white font-bold text-[15px] ml-2">My Attendance</Text>
              </View>
              <Feather name="arrow-up-right" size={18} color="#888888" />
            </TouchableOpacity>
          </View>

          {/* To Do Section */}
          <View className="bg-[#161616] border border-[#222222]  rounded-lg">
            <View className="flex-row justify-between items-center mb-4 p-4 border-b border-[#222] ">
              <View>
                <Text className="text-white text-lg font-black tracking-tight">To Do</Text>
                <Text className="text-[#888888] text-[12px] font-medium mt-0.5">
                  {pendingCount} {pendingCount === 1 ? 'task' : 'tasks'} today
                </Text>
              </View>
              <View className="flex-row items-center space-x-2 ">
                <TouchableOpacity
                  onPress={() => setIsCreateVisible(true)}
                  className="w-10 h-10 bg-[#111111] border border-[#222222] rounded-xl items-center justify-center active:bg-[#222222] mr-2">
                  <Ionicons name="add" size={20} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsAllTasksVisible(true)}
                  className="flex-row items-center bg-[#111111] border border-[#222222] px-3.5 py-2.5 rounded-xl active:bg-[#222222]">
                  <Text className="text-white font-bold text-xs mr-1">All</Text>
                  <Feather name="arrow-up-right" size={12} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Task list items */}
            <View className="flex flex-col gap-y-3 p-3">
              {pendingTasks.slice(0, 3).map(task => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => setEditingTask(task)}
                  activeOpacity={0.8}
                  className="flex-row  justify-between items-center bg-[#111111] border border-[#222222] p-4 rounded-xl active:bg-[#1a1a1a]">
                  <View className="flex-row items-center flex-1">
                    <View className="w-2 h-2 rounded-full bg-[#888888] mr-3" />
                    <Text className="text-white font-bold text-[14px] flex-1" numberOfLines={1}>
                      {task.title?.length > 20 ? `${task.title.slice(0, 20)}...` : task.title}
                    </Text>
                  </View>
                  <View className="border border-[#333333] px-2 py-0.5 rounded-md">
                    <Text className="text-[#888888] font-bold text-[9px] uppercase tracking-wider">
                      {getDaysRemainingText(task.dueDate)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {pendingCount === 0 && (
                <View className="py-8 items-center justify-center">
                  <Text className="text-[#555555] font-semibold text-[14px]">All caught up!</Text>
                </View>
              )}
            </View>
          </View>
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
      </SafeAreaView>

      {/* Top Sheet Drawer */}
      <TopSheetDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen="Dashboard"
        onNavigate={screen => {
          if (screen === 'Attendance') {
            onNavigateAttendance();
          }
        }}
      />
    </View>
  );
}
