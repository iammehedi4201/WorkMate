import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore, Task } from '../store/useTaskStore';
import { useToast } from '../hooks/useToast';

interface UpdateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function UpdateTaskModal({ isVisible, onClose, task }: UpdateTaskModalProps) {
  const { updateTask } = useTaskStore();
  const { showToast } = useToast();

  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<Task['status']>('Pending');

  const [showCalendar, setShowCalendar] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June is index 5

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const statusOptions: Task['status'][] = ['Pending', 'Completed', 'Archived'];

  // Sync state with selected task
  useEffect(() => {
    if (task) {
      setDescription(task.title);
      setStatus(task.status);
      if (task.dueDate) {
        const parts = task.dueDate.split('-');
        if (parts.length === 3) {
          const date = new Date(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[2], 10),
          );
          setSelectedDate(date);
          setCurrentYear(date.getFullYear());
          setCurrentMonth(date.getMonth());
        }
      }
    }
  }, [task, isVisible]);

  const handleUpdate = () => {
    if (!task) return;
    if (!description.trim()) {
      showToast('Please enter a task description', 'error');
      return;
    }
    if (!selectedDate) {
      showToast('Please select a date', 'error');
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    updateTask(task.id, {
      title: description.trim(),
      dueDate: dateString,
      status,
    });

    showToast('Task updated successfully', 'success');
    onClose();
  };

  const formatDate = (date: Date) => {
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${monthName} ${day}, ${year}`;
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];
    for (let i = 0; i < emptySlots; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View className="flex-1 bg-black/60 justify-end">
        {/* Backdrop overlay press to close */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="w-full">
          <View className="bg-[#121212] border-t border-l border-r border-[#2a2a2a] w-full rounded-t-[32px] p-6 pb-10 relative">
            {/* Close button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="close" size={20} color="#888888" />
            </TouchableOpacity>

            {/* Title */}
            <View className="items-center pb-4 mb-5 border-b border-[#222222]">
              <Text className="text-white text-lg font-bold">Update Task</Text>
            </View>

            {/* Form */}
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-[380px]">
              <View className="space-y-5">
                <View>
                  <Text className="text-white font-bold text-[14px] mb-2">Task Description</Text>
                  <View className="border border-[#2a2a2a] rounded-xl bg-[#111111] overflow-hidden">
                    <TextInput
                      placeholder="What needs to be done?"
                      placeholderTextColor="#555555"
                      value={description}
                      onChangeText={setDescription}
                      className="text-white text-[15px] px-4 py-3.5"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View className="mt-4">
                  <Text className="text-white font-bold text-[14px] mb-2">Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowCalendar(true)}
                    className="flex-row items-center justify-between border border-[#2a2a2a] rounded-xl bg-[#111111] px-4 py-3.5">
                    <Text className="text-white text-[15px]">
                      {selectedDate ? formatDate(selectedDate) : 'Pick a date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#888888" />
                  </TouchableOpacity>
                </View>

                <View className="mt-4">
                  <Text className="text-white font-bold text-[14px] mb-2">Status</Text>
                  <TouchableOpacity
                    onPress={() => setShowStatusPicker(true)}
                    className="flex-row items-center justify-between border border-[#2a2a2a] rounded-xl bg-[#111111] px-4 py-3.5">
                    <Text className="text-white text-[15px]">{status}</Text>
                    <Ionicons name="chevron-down" size={18} color="#888888" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleUpdate}
                  className="mt-6 w-full bg-white active:bg-slate-200 py-4 rounded-xl items-center justify-center shadow-md">
                  <Text className="text-black text-base font-bold">Update Task</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Custom Calendar Dialog */}
      <Modal visible={showCalendar} transparent animationType="fade" statusBarTranslucent={true}>
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-[#161616] border border-[#2a2a2a] rounded-2xl w-full max-w-[320px] p-4">
            {/* Calendar Header */}
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={handlePrevMonth} className="p-1">
                <Ionicons name="chevron-back" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text className="text-white font-bold text-base">
                {months[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity onPress={handleNextMonth} className="p-1">
                <Ionicons name="chevron-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Weekdays */}
            <View className="flex-row mb-2">
              {weekDays.map((day, idx) => (
                <View key={idx} className="flex-1 items-center">
                  <Text className="text-[#888888] font-bold text-xs">{day}</Text>
                </View>
              ))}
            </View>

            {/* Days Grid */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, idx) => {
                const isSelected =
                  day &&
                  selectedDate &&
                  day.getDate() === selectedDate.getDate() &&
                  day.getMonth() === selectedDate.getMonth() &&
                  day.getFullYear() === selectedDate.getFullYear();

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={!day}
                    onPress={() => {
                      if (day) {
                        setSelectedDate(day);
                        setShowCalendar(false);
                      }
                    }}
                    className={`w-[14.28%] aspect-square justify-center items-center rounded-lg my-0.5 ${
                      isSelected ? 'bg-white' : ''
                    }`}>
                    {day ? (
                      <Text
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-black' : 'text-white'
                        }`}>
                        {day.getDate()}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Cancel Calendar Button */}
            <TouchableOpacity
              onPress={() => setShowCalendar(false)}
              className="mt-4 w-full bg-[#222222] py-2.5 rounded-lg items-center">
              <Text className="text-white font-semibold text-xs">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Status Picker Dialog */}
      <Modal
        visible={showStatusPicker}
        transparent
        animationType="fade"
        statusBarTranslucent={true}>
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-[#161616] border border-[#2a2a2a] rounded-2xl w-full max-w-[280px] p-4">
            <Text className="text-white font-bold text-base mb-4 text-center">Select Status</Text>

            <View className="space-y-2.5">
              {statusOptions.map(opt => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    setStatus(opt);
                    setShowStatusPicker(false);
                  }}
                  className={`w-full py-3 px-4 rounded-xl border border-transparent flex-row items-center justify-between ${
                    status === opt ? 'bg-white/10 border-white/20' : 'bg-[#111111]'
                  }`}>
                  <Text className="text-white font-semibold text-[15px]">{opt}</Text>
                  {status === opt && <Ionicons name="checkmark" size={18} color="#ffffff" />}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowStatusPicker(false)}
              className="mt-4 w-full bg-[#222222] py-2.5 rounded-lg items-center">
              <Text className="text-white font-semibold text-xs">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
