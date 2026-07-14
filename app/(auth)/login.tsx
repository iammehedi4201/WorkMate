import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput as TextInputType,
  Image,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useToast, useKeyboardAvoidance } from '../../src/hooks';
import { useRouter } from 'expo-router';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await login(data.email, data.password);
    },
    onSuccess: data => {
      showToast(`Welcome back, ${data.user.name || 'User'}!`, 'success');
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
        style={{ flex: 1, backgroundColor: '#1a1a1a' }}
        edges={['top', 'left', 'right']}>
        <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0 }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardHeight > 0 ? keyboardHeight : 24,
            }}
            style={{ backgroundColor: '#1a1a1a' }}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingVertical: 48,
              }}>
              {/* Header: Logo + Title */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 22,
                    fontWeight: '700',
                    marginLeft: 5,
                    marginTop: 10,
                    letterSpacing: 0.3,
                  }}>
                  Ant App
                </Text>
              </View>

              {/* Card */}
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#232323',
                  borderRadius: 16,
                  padding: 24,
                }}>
                {/* Email Field */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <View style={{ marginBottom: 20 }} onLayout={handleFieldLayout('email')}>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 14,
                          fontWeight: '700',
                          marginBottom: 8,
                        }}>
                        Email
                      </Text>
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="name@example.com"
                        placeholderTextColor="#555"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        onFocus={() => scrollToField('email')}
                        style={{
                          backgroundColor: '#2c2c2c',
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: errors.email ? '#ef4444' : '#3a3a3a',
                          color: '#ffffff',
                          fontSize: 14,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                        }}
                      />
                      {errors.email && (
                        <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                          {errors.email.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                {/* Password Field */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <View style={{ marginBottom: 8 }} onLayout={handleFieldLayout('password')}>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 14,
                          fontWeight: '700',
                          marginBottom: 8,
                        }}>
                        Password
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#2c2c2c',
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: errors.password ? '#ef4444' : '#3a3a3a',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TextInput
                          ref={passwordRef}
                          value={value}
                          onChangeText={onChange}
                          placeholder="••••••••"
                          placeholderTextColor="#555"
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="done"
                          onSubmitEditing={handleSubmit(onSubmit)}
                          onFocus={() => scrollToField('password')}
                          style={{
                            flex: 1,
                            color: '#ffffff',
                            fontSize: 14,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={{ paddingHorizontal: 14 }}>
                          <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#888"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={loginMutation.isPending}
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                    opacity: loginMutation.isPending ? 0.7 : 1,
                  }}>
                  {loginMutation.isPending ? (
                    <ActivityIndicator color="#1a1a1a" size="small" />
                  ) : (
                    <Text style={{ color: '#1a1a1a', fontSize: 15, fontWeight: '700' }}>Login</Text>
                  )}
                </TouchableOpacity>

                {/* Forgot Password Link */}
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forgot-password')}
                  style={{ alignSelf: 'flex-end', marginTop: 14 }}>
                  <Text style={{ color: '#fff', fontSize: 13, textDecorationLine: 'underline' }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
