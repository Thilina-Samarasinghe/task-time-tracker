'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { User, LogOut, ChevronDown } from 'lucide-react';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setShowLogoutDialog(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutDialog(true);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push('/dashboard/profile');
  };

  // Get user initials
  const getInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-full hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* Profile Circle with border and human icon - SINGLE CIRCLE ONLY */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          
          {/* User Name (hidden on mobile) */}
          <span className="font-medium text-gray-700 hidden md:inline max-w-37.5 truncate">
            {user?.name || 'User'}
          </span>
          
          {/* Chevron Icon (hidden on mobile) */}
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu - Opens on LEFT side */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Section - SIMPLIFIED (only email) */}
            <div className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-white/80 mt-1 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 bg-white">
              {/* My Profile */}
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">My Profile</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}