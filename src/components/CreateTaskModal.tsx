import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../store/useTaskStore';
import { useToast } from '../hooks/useToast';

interface CreateTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isVisible, onClose }: CreateTaskModalProps) {
  const { addTask } = useTaskStore();
  const { showToast } = useToast();

  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
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

  const handleCreate = () => {
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

    addTask({
      title: description.trim(),
      dueDate: dateString,
      status: 'Pending',
      emoji: '🍄',
    });

    showToast('Task created successfully', 'success');
    setDescription('');
    setSelectedDate(null);
    onClose();
  };

  const formatDate = (date: Date) => {
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${monthName} ${day}, ${year}`;
  };

  // Generate calendar days for the grid
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Shift firstDayOfMonth for Monday start (0=Monday, 6=Sunday)
    // Javascript getDay() is 0=Sunday, 1=Monday...
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
              <Text className="text-white text-lg font-bold">Create New Task</Text>
            </View>

            {/* Form */}
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-[300px]">
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
                    <Text
                      className={
                        selectedDate ? 'text-white text-[15px]' : 'text-[#555555] text-[15px]'
                      }>
                      {selectedDate ? formatDate(selectedDate) : 'Pick a date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#888888" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleCreate}
                  className="mt-6 w-full bg-white active:bg-slate-200 py-4 rounded-xl items-center justify-center shadow-md">
                  <Text className="text-black text-base font-bold">Create Task</Text>
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
    </Modal>
  );
}
