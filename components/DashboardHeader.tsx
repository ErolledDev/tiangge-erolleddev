'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getUserStore } from '@/lib/store';
import { Menu, Bell, User, Copy, ExternalLink, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function DashboardHeader({ isSidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const { user, userProfile } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [storeSlug, setStoreSlug] = useState<string>('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load user store slug
  useEffect(() => {
    const loadStoreSlug = async () => {
      if (!user) return;
      
      try {
        const store = await getUserStore(user.uid);
        if (store) {
          setStoreSlug(store.slug);
        }
      } catch (error) {
        console.error('Error loading store slug:', error);
      }
    };

    loadStoreSlug();
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showError('Failed to copy to clipboard');
    }
  };

  const storeUrl = storeSlug ? `${window.location.origin}/${storeSlug}` : '';

  return (
    <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white shadow-sm border-b border-gray-200 z-30">
      <div className="flex items-center justify-between h-full px-3 sm:px-4">
        {/* Left Side - Hamburger Menu */}
        <div className="flex items-center">
          <button
            id="hamburger-button"
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Right Side - Notifications and User Info */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification Bell */}
          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Notification badge placeholder */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
              aria-label="User menu"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-[80vh] overflow-y-auto">
                {/* User Info Section */}
                <div className="px-3 sm:px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {userProfile?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userProfile?.email}
                      </p>
                      {userProfile?.role === 'admin' && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          Administrator
                        </span>
                      )}
                      {userProfile?.isPremium && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          Premium User
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Details Section */}
                <div className="px-3 sm:px-4 py-3 space-y-3">
                  {/* Email with Copy */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Email Address</p>
                      <p className="text-xs sm:text-sm text-gray-900 truncate">{userProfile?.email}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(userProfile?.email || '', 'Email')}
                      className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Copy email"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Store URL with Copy and Visit */}
                  {storeSlug && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Store URL</p>
                        <p className="text-xs sm:text-sm text-gray-900 truncate">{storeUrl}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-1 sm:ml-2">
                        <button
                          onClick={() => copyToClipboard(storeUrl, 'Store URL')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Copy store URL"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <a
                          href={storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Visit store"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* User ID with Copy (for support purposes) */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">User ID</p>
                      <p className="text-xs sm:text-sm text-gray-900 font-mono truncate">{user?.uid}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(user?.uid || '', 'User ID')}
                      className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Copy user ID"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
