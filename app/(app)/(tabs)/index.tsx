import React, { useState } from 'react';
import DashboardScreen from '../../../screens/DashboardScreen';
import AttendanceScreen from '../../../screens/AttendanceScreen';

export default function HomeScreen() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'attendance'>('dashboard');

  if (currentView === 'attendance') {
    return (
      <AttendanceScreen
        onNavigateDashboard={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <DashboardScreen
      onNavigateAttendance={() => setCurrentView('attendance')}
    />
  );
}
