import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Task } from '../../store/useTaskStore';

interface ToDoSectionProps {
  pendingTasks: Task[];
  pendingCount: number;
  setIsCreateVisible: (v: boolean) => void;
  setIsAllTasksVisible: (v: boolean) => void;
  setEditingTask: (t: Task | null) => void;
}

export default function ToDoSection({
  pendingTasks,
  pendingCount,
  setIsCreateVisible,
  setIsAllTasksVisible,
  setEditingTask,
}: ToDoSectionProps) {
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

  return (
    <View className="bg-[#161616] border border-[#222222] rounded-lg">
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
      {pendingCount === 0 ? (
        <View className="py-8 items-center justify-center">
          <Text className="text-[#555555] font-semibold text-[14px]">All caught up!</Text>
        </View>
      ) : (
        <ScrollView
          style={{ maxHeight: 200, height: 200 }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}>
          <View className="flex flex-col gap-y-3 p-3">
            {pendingTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                onPress={() => setEditingTask(task)}
                activeOpacity={0.8}
                className="flex-row justify-between items-center bg-[#111111] border border-[#222222] p-4 rounded-xl active:bg-[#1a1a1a]">
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
          </View>
        </ScrollView>
      )}
    </View>
  );
}
