'use client';

import React from 'react';
import { useNotification } from '@/context/notifications';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'info':
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-900';
      case 'error':
        return 'text-red-900';
      case 'warning':
        return 'text-yellow-900';
      case 'info':
      default:
        return 'text-blue-900';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg pointer-events-auto ${getBgColor(
            notification.type
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm ${getTextColor(notification.type)}`}>
              {notification.title}
            </h3>
            <p className={`text-xs mt-1 ${getTextColor(notification.type)}`}>
              {notification.message}
            </p>
          </div>

          <button
            onClick={() => removeNotification(notification.id)}
            className={`flex-shrink-0 p-1 rounded hover:bg-black/10 transition`}
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
