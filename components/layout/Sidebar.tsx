'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Clock, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStorage } from '@/lib/session';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  role?: 'principal' | 'teacher' | 'student';
}

export function Sidebar({ role = 'student' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const getNavItems = () => {
    const commonItems = [
      { href: `/dashboard/${role}`, label: 'Dashboard', icon: Home },
      { href: '/timetable', label: 'Timetable', icon: Clock },
    ];

    if (role === 'principal') {
      return [
        ...commonItems,
        { href: '/dashboard/principal/students', label: 'Students', icon: Users },
        { href: '/dashboard/principal/teachers', label: 'Teachers', icon: Users },
        { href: '/dashboard/principal/classes', label: 'Classes', icon: Users },
        { href: '/dashboard/principal/setup', label: 'School Setup', icon: Settings },
        { href: '/dashboard/principal/timetable/generate', label: 'Timetable Generator', icon: Settings },
      ];
    } else if (role === 'teacher') {
      return [
        ...commonItems,
        { href: '/dashboard/teacher/my-classes', label: 'My Classes', icon: Users },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0e0e0e] border-r border-gray-200 dark:border-[#222] h-screen sticky top-0">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E74C3C] rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">SchoolTime</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-[#E74C3C] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-[#222] space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
            onClick={() => router.push('/dashboard')}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
            onClick={() => {
              sessionStorage.clear();
              router.push('/role-selection');
            }}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg"
      >
        {isOpen ? (
          <X className="w-6 h-6 dark:text-gray-100" />
        ) : (
          <Menu className="w-6 h-6 dark:text-gray-100" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <aside className="absolute left-0 top-0 w-64 bg-white dark:bg-[#0e0e0e] h-screen flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200 dark:border-[#222]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">SchoolTime</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-[#E74C3C] text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-[#222] space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={() => {
                  setIsOpen(false);
                  sessionStorage.clear();
                  router.push('/role-selection');
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
