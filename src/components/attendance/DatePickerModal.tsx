import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MONTHS } from '../../constants/attendanceConstants';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  pickerYear: number;
  setPickerYear: React.Dispatch<React.SetStateAction<number>>;
  selectedMonth: number;
  selectedYear: number;
  onConfirm: (monthIdx: number) => void;
}

export default function DatePickerModal({
  visible,
  onClose,
  pickerYear,
  setPickerYear,
  selectedMonth,
  selectedYear,
  onConfirm,
}: DatePickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <View className="w-full bg-[#161616] border border-[#2a2a2a] rounded-[20px] p-5">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-white text-lg font-extrabold">Select Date</Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#222222] items-center justify-center">
              <Ionicons name="close" size={18} color="#888888" />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between bg-[#1e1e1e] rounded-xl px-3 py-2.5 mb-5">
            <Pressable
              onPress={() => setPickerYear(y => y - 1)}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] items-center justify-center">
              <Ionicons name="chevron-back" size={18} color="#888888" />
            </Pressable>
            <Text className="text-white font-extrabold text-[17px]">{pickerYear}</Text>
            <Pressable
              onPress={() => setPickerYear(y => y + 1)}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#888888" />
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {MONTHS.map((m, i) => {
              const isSelected = i === selectedMonth && pickerYear === selectedYear;
              return (
                <Pressable
                  key={m}
                  onPress={() => onConfirm(i)}
                  className={`items-center justify-center rounded-xl py-3.5 ${isSelected ? 'bg-white' : 'bg-[#1e1e1e]'}`}
                  style={{ width: '31.5%' }}>
                  <Text
                    className={`text-sm font-semibold ${isSelected ? 'text-black font-extrabold' : 'text-[#aaaaaa]'}`}>
                    {m}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
