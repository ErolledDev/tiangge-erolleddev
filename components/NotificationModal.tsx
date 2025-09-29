'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/useToast';
import { markNotificationAsRead, Notification } from '@/lib/store';
import { X, Bell, Check, Calendar } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  userId: string;
  isRead: boolean;
  onMarkAsRead: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  notification,
  userId,
  isRead,
  onMarkAsRead
}: NotificationModalProps) {
  const { showSuccess, showError } = useToast();
  const [markingAsRead, setMarkingAsRead] = useState(false);

  const handleMarkAsRead = async () => {
    if (!notification || isRead) return;

    setMarkingAsRead(true);
    try {
      await markNotificationAsRead(userId, notification.id!);
      onMarkAsRead();
      showSuccess('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showError('Failed to mark notification as read');
    } finally {
      setMarkingAsRead(false);
    }
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Bell className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {notification.title}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {notification.createdAt.toLocaleDateString()} at {notification.createdAt.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{notification.description}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            {isRead ? (
              <div className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Read</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
                <Bell className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Unread</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm min-h-[44px]"
            >
              Close
            </button>
            {!isRead && (
              <button
                onClick={handleMarkAsRead}
                disabled={markingAsRead}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm min-h-[44px]"
              >
                {markingAsRead ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Marking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Read
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}