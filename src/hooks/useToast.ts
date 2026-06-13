import { useContext } from 'react';
import { ToastContext, ToastContextType } from '../context/ToastContext';

/**
 * Custom hook to consume Toast notification system anywhere in components.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
