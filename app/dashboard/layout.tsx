'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sessionStorage, type UserSession } from '@/lib/session';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  // Determine role from pathname
  const getRole = () => {
    if (pathname.includes('/principal')) return 'principal';
    if (pathname.includes('/teacher')) return 'teacher';
    return 'student';
  };

  const role = getRole() as 'principal' | 'teacher' | 'student';

  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(sessionStorage.get());
  }, []);

  const userName = session?.name || 'Loading...';
  const userInitials = session?.name 
    ? session.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2)
    : '??';

  const getRoleDisplayName = () => {
    switch (role) {
      case 'principal':
        return 'Principal';
      case 'teacher':
        return 'Teacher';
      default:
        return 'Student';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:pb-0 pb-20">
        <Navbar 
          userName={session ? userName : 'Loading...'}
          userRole={getRoleDisplayName()}
          userInitials={session ? userInitials : '--'}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav role={role} />
      </div>
    </div>
  );
}
