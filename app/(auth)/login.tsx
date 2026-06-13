import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput as TextInputType,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useToast, useKeyboardAvoidance } from '../../src/hooks';
import { FormField } from '../../src/components';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  age: z.string()
    .refine(val => {
      const num = Number(val);
      return !isNaN(num) && num >= 18;
    }, 'You must be at least 18 years old'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { showToast } = useToast();

  const usernameRef = useRef<TextInputType>(null);
  const phoneRef = useRef<TextInputType>(null);
  const ageRef = useRef<TextInputType>(null);
  const passwordRef = useRef<TextInputType>(null);

  const { scrollViewRef, keyboardHeight, handleFieldLayout, scrollToField } =
    useKeyboardAvoidance();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      username: '',
      phone: '',
      age: '',
      password: '',
    },
  });

  // Query Mutation for authenticating credentials
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await login(data.email, data.password);
    },
    onSuccess: (data, variables) => {
      showToast(
        `Welcome back, ${data.user.name || 'User'}!\nUser: ${variables.username} (Age: ${variables.age})`,
        'success'
      );
    },
    onError: (error: Error) => {
      showToast(error.message || 'Login failed. Please try again.', 'error');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1 bg-[#020202]"
        edges={['top', 'left', 'right']}>
        <View
          className="flex-1"
          style={{ paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0 }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardHeight > 0 ? keyboardHeight : 24,
            }}
            className="bg-[#020202]"
            keyboardShouldPersistTaps="handled">
            <View className="flex-1 justify-center px-6 py-12 bg-[#020202]">
              {/* Header section */}
              <View className="mb-10 items-center">
                <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                  <Text className="text-white text-3xl font-extrabold">🚀</Text>
                </View>
                <Text className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome Back
                </Text>
                <Text className="text-slate-400 mt-2 text-center">
                  Please enter your details to sign in
                </Text>
              </View>
              {/* Form inputs */}
              <View className="space-y-4">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      label="Email Address"
                      value={value}
                      onChangeText={onChange}
                      placeholder="name@example.com"
                      error={errors.email?.message}
                      keyboardType="email-address"
                      returnKeyType="next"
                      onSubmitEditing={() => usernameRef.current?.focus()}
                      onLayout={handleFieldLayout('email')}
                      onFieldFocus={() => scrollToField('email')}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      label="Username"
                      value={value}
                      onChangeText={onChange}
                      placeholder="john_doe"
                      error={errors.username?.message}
                      returnKeyType="next"
                      onSubmitEditing={() => phoneRef.current?.focus()}
                      inputRef={usernameRef}
                      onLayout={handleFieldLayout('username')}
                      onFieldFocus={() => scrollToField('username')}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      label="Phone Number"
                      value={value}
                      onChangeText={onChange}
                      placeholder="1234567890"
                      error={errors.phone?.message}
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => ageRef.current?.focus()}
                      inputRef={phoneRef}
                      onLayout={handleFieldLayout('phone')}
                      onFieldFocus={() => scrollToField('phone')}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="age"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      label="Age"
                      value={value}
                      onChangeText={onChange}
                      placeholder="25"
                      error={errors.age?.message}
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      inputRef={ageRef}
                      onLayout={handleFieldLayout('age')}
                      onFieldFocus={() => scrollToField('age')}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <FormField
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      placeholder="••••••••"
                      error={errors.password?.message}
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      inputRef={passwordRef}
                      onLayout={handleFieldLayout('password')}
                      onFieldFocus={() => scrollToField('password')}
                    />
                  )}
                />

                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={loginMutation.isPending}
                  className="mt-6 w-full bg-blue-600 active:bg-blue-700 disabled:bg-blue-400 py-4 rounded-xl items-center justify-center shadow-md shadow-blue-500/20">
                  {loginMutation.isPending ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text className="text-white text-base font-bold">Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Hint Footer */}
              <View className="mt-8 p-4 bg-[#161616] rounded-xl border border-[#222222]">
                <Text className="text-xs text-slate-300 font-semibold text-center mb-1">
                  💡 Boilerplate Credentials Hint
                </Text>
                <Text className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Email: <Text className="font-mono">any@email.com</Text> | Password:{' '}
                  <Text className="font-mono">password123</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
