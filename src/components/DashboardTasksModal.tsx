import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Task, useTaskStore } from '../store/useTaskStore';
import CreateTaskModal from './CreateTaskModal';
import UpdateTaskModal from './UpdateTaskModal';

interface DashboardTasksModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DashboardTasksModal({ isVisible, onClose }: DashboardTasksModalProps) {
  const { tasks, deleteTask } = useTaskStore();
  const [activeTab, setActiveTab] = useState<Task['status']>('Pending');
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter(t => t.status === activeTab);

  // Format date remaining text
  const getDaysRemainingText = (dueDateStr: string) => {
    try {
      const today = new Date(); // Dynamic date
      const due = new Date(dueDateStr);

      // Reset hours to get precise date boundaries
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

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setEditingTask(item)}
      className="bg-[#161616] border border-[#222222] p-4 rounded-lg mb-3 flex-column">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center flex-1 pr-3">
          <Text className="text-xl mr-2.5">🍄</Text>
          <Text numberOfLines={1} className="text-white font-bold text-[15px] flex-1">
            {item.title}
          </Text>
        </View>
        <View className="border border-[#333333] px-2.5 py-1 rounded-lg bg-[#111111]/40">
          <Text className="text-[#888888] font-bold text-[10px] tracking-wider uppercase">
            {getDaysRemainingText(item.dueDate)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center border-t border-[#222222]/60 pt-3">
        <Text className="text-[#666666] font-bold text-[10px] tracking-widest uppercase">
          STATUS: {item.status}
        </Text>
        <TouchableOpacity onPress={() => deleteTask(item.id)} className="p-1">
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View className="flex-1 bg-black/90 justify-end ">
        <View className="bg-[#0c0c0c] border-t border-r border-l border-[#2a2a2a] w-full h-[90%] rounded-t-[32px] p-6 relative">
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-5 right-5 z-10 w-9 h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full items-center justify-center">
            <Ionicons name="close" size={18} color="#ffffff" />
          </TouchableOpacity>

          {/* Header Title */}
          <View className="pb-4 mb-4 border-b border-[#222222]">
            <Text className="text-white text-lg font-bold">Dashboard Tasks</Text>
          </View>

          {/* Current Tasks Title */}
          <Text className="text-white font-black text-xl mb-4 tracking-tight">Current Tasks</Text>

          {/* Tab Selector */}
          <View className="flex-row bg-[#161616] p-1.5 rounded-xl border border-[#222222] mb-5">
            {(['Pending', 'Completed', 'Archived'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-lg items-center ${
                    isActive ? 'bg-[#222222]' : ''
                  }`}>
                  <Text
                    className={`text-sm font-bold ${isActive ? 'text-white' : 'text-[#888888]'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Add New Task Button */}
          <TouchableOpacity
            onPress={() => setIsCreateVisible(true)}
            className="w-full bg-white active:bg-slate-200 py-3.5 rounded-xl flex-row items-center justify-center mb-5 shadow-sm">
            <Ionicons name="add" size={20} color="#000000" className="mr-1.5" />
            <Text className="text-black text-base font-bold ml-1">Add New Task</Text>
          </TouchableOpacity>

          {/* Task list */}
          <FlatList
            data={filteredTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View className="py-12 items-center justify-center">
                <Text className="text-[#555555] font-semibold text-[15px]">
                  No {activeTab.toLowerCase()} tasks found
                </Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Nested Modals */}
      <CreateTaskModal isVisible={isCreateVisible} onClose={() => setIsCreateVisible(false)} />

      <UpdateTaskModal
        isVisible={editingTask !== null}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
    </Modal>
  );
}
