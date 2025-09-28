'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell, User } from 'lucide-react';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardHeader({ isSidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const { userProfile } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 z-30">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Side - Hamburger Menu */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Right Side - Notifications and User Info */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            {/* Notification badge placeholder */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {userProfile?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {userProfile?.email}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}