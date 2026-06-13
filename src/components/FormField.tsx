import React, { useState } from 'react';
import { View, Text, TextInput, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  returnKeyType?: 'next' | 'done' | 'go';
  onSubmitEditing?: () => void;
  multiline?: boolean;
  inputRef?: any;
  onFieldFocus?: () => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'next',
  onSubmitEditing,
  multiline = false,
  inputRef,
  onFieldFocus,
  onLayout,
  style,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-5" onLayout={onLayout} style={style}>
      <Text className="text-[13px] font-medium text-[#9ca3af] mb-2 tracking-[0.3px]">{label}</Text>

      <View
        className={`border rounded-xl bg-[#111111] ${
          error ? 'border-[#ef4444]' : isFocused ? 'border-[#6366f1]' : 'border-[#1f2937]'
        }`}>
        <TextInput
          ref={inputRef}
          className={`text-white text-[15px] px-3.5 py-3 ${
            multiline ? 'h-[100px] text-top pt-3' : ''
          }`}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setIsFocused(true);
            onFieldFocus?.();
          }}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#444"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          blurOnSubmit={!multiline}
        />
      </View>

      {error && <Text className="text-[12px] color-[#ef4444] mt-1.5 ml-0.5">{error}</Text>}
    </View>
  );
}
