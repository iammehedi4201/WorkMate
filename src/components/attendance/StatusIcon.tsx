import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AttendanceStatus, STATUS_CONFIG } from '../../constants/attendanceConstants';

export default function StatusIcon({ status, size = 16 }: { status: AttendanceStatus; size?: number }) {
  const cfg = STATUS_CONFIG[status];
  if (cfg.iconFamily === 'material') {
    return <MaterialCommunityIcons name={cfg.icon as any} size={size} color={cfg.color} />;
  }
  return <Ionicons name={cfg.icon as any} size={size} color={cfg.color} />;
}
