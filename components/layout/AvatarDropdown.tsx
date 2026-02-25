'use client';

import { useState } from 'react';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface AvatarDropdownProps {
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export function AvatarDropdown({
  userName = 'John Doe',
  userRole = 'Student',
  userInitials = 'JD',
}: AvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Profile', icon: User, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
    { label: 'Help', icon: HelpCircle, href: '#' },
    { label: 'Logout', icon: LogOut, href: '#', color: '#E74C3C' },
  ];

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#E74C3C] text-white flex items-center justify-center font-semibold hover:bg-red-700 transition-colors"
      >
        {userInitials}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 z-40 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-600">{userRole}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                      style={item.color ? { color: item.color } : undefined}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
