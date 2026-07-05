import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useToast, useKeyboardAvoidance } from '../../src/hooks';
import { useRouter } from 'expo-router';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const { showToast } = useToast();
  const router = useRouter();

  const { scrollViewRef, keyboardHeight, handleFieldLayout, scrollToField } =
    useKeyboardAvoidance();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ForgotFormValues) => {
      // Simulate API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { email: data.email };
    },
    onSuccess: (_, variables) => {
      showToast(`Reset link sent to ${variables.email}`, 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to send reset link. Please try again.', 'error');
    },
  });

  const onSubmit = (data: ForgotFormValues) => {
    resetMutation.mutate(data);
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

            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 48,
            }}>

              {/* Header: Logo + Title */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 40 }}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={{ width: 52, height: 52, resizeMode: 'contain' }}
                />
                <Text style={{
                  color: '#ffffff',
                  fontSize: 22,
                  fontWeight: '700',
                  marginLeft: 12,
                  letterSpacing: 0.3,
                }}>
                  Forgot Password Ant App
                </Text>
              </View>

              {/* Card */}
              <View style={{
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
                    <View
                      style={{ marginBottom: 24 }}
                      onLayout={handleFieldLayout('email')}>
                      <Text style={{
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
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
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

                {/* Send Reset Link Button */}
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={resetMutation.isPending}
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    paddingVertical: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: resetMutation.isPending ? 0.7 : 1,
                  }}>
                  {resetMutation.isPending ? (
                    <ActivityIndicator color="#c8930a" size="small" />
                  ) : (
                    <Text style={{ color: '#c8930a', fontSize: 15, fontWeight: '600' }}>
                      Send Reset Link
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Back to Login */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, alignItems: 'center' }}>
                  <Text style={{ color: '#c8930a', fontSize: 13 }}>Want to sign in? </Text>
                  <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                    <Text style={{ color: '#c8930a', fontSize: 13, textDecorationLine: 'underline' }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
