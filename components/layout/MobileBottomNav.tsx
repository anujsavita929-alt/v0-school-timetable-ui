'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, Users, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  role?: 'principal' | 'teacher' | 'student';
}

export function MobileBottomNav({ role = 'student' }: MobileBottomNavProps) {
  const pathname = usePathname();

  const getNavItems = () => {
    const commonItems = [
      { href: '/dashboard', icon: Home, label: 'Dashboard' },
      { href: '/timetable', icon: Clock, label: 'Schedule' },
    ];

    if (role === 'principal') {
      return [
        ...commonItems,
        { href: '/students', icon: Users, label: 'Students' },
        { href: '/teachers', icon: Users, label: 'Teachers' },
      ];
    }

    return [...commonItems];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                active
                  ? 'text-[#E74C3C] border-t-2 border-[#E74C3C] -mt-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
