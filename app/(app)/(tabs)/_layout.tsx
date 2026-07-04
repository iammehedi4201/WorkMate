import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { View, StatusBar } from 'react-native';
import { HeaderProvider, useHeader } from '../../../src/context/HeaderContext';
import Header from '../../../src/components/Header';
import TopSheetDrawer from '../../../src/components/TopSheetDrawer';

function TabsLayoutContent() {
  const insets = useSafeAreaInsets();
  const { config, isDrawerOpen, setIsDrawerOpen } = useHeader();

  return (
    <View className="flex-1 bg-[#020202]">
      <SafeAreaView className="bg-[#020202]" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#020202" />
        <Header
          title={config.title}
          showBack={config.showBack}
          onBackPress={config.onBackPress}
          showMenu={config.showMenu}
          onMenuPress={() => setIsDrawerOpen(true)}
          showLogo={config.showLogo}
        />
      </SafeAreaView>

      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#888888',
            tabBarStyle: {
              backgroundColor: '#0c0c0c',
              borderTopColor: '#111111',
              paddingBottom: insets.bottom || 5,
              paddingTop: 5,
              height: 60 + insets.bottom,
            },
            headerShown: false,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'home' : 'home-outline'} size={size || 22} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size || 22} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>

      <TopSheetDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen={config.activeScreen || 'Dashboard'}
        onNavigate={(screen) => {
          if (config.onNavigate) {
            config.onNavigate(screen);
          }
        }}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <HeaderProvider>
      <TabsLayoutContent />
    </HeaderProvider>
  );
}
