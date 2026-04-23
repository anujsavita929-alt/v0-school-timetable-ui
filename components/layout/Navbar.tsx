'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { sessionStorage } from '@/lib/session';

interface NavbarProps {
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
}

export function Navbar({
  userName = 'John Doe',
  userRole = 'Teacher',
  userInitials = 'JD',
}: NavbarProps) {

  const router = useRouter();

  const [mounted, setMounted] = useState(false);   // ⭐ FIX
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  const [notifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Timetable updated',
      description: 'Class 10-A timetable has been updated.',
      time: 'Just now',
    },
    {
      id: '2',
      title: 'New student added',
      description: 'Arun Kumar has been added to class 10-A.',
      time: '10 min ago',
    },
  ]);

  useEffect(() => {
    setMounted(true);   // ⭐ FIX
  }, []);

  if (!mounted) return null;   // ⭐ prevents hydration mismatch

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    router.push(`/students?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-[#222] sticky top-0 z-40">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4">

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />

              <Input
                placeholder="Search students by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] rounded-lg focus:bg-white dark:focus:bg-[#222] dark:text-gray-100 dark:placeholder-gray-500"
              />

            </div>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Notifications */}
          <DropdownMenu
            onOpenChange={(open) => {
              if (open) setHasUnread(false);
            }}
          >
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />

                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#E74C3C] rounded-full" />
                )}

              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 dark:bg-[#111111] dark:border-[#333]">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-[#222]">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recent timetable and student updates
                </p>
              </div>

              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 py-2 cursor-default"
                >
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {notification.description}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {notification.time}
                  </p>
                </DropdownMenuItem>
              ))}

              {notifications.length === 0 && (
                <DropdownMenuItem className="text-xs text-gray-500 cursor-default">
                  No notifications
                </DropdownMenuItem>
              )}

            </DropdownMenuContent>
          </DropdownMenu>


          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>

              <button className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors">

                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
                </div>

                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                  />
                  <AvatarFallback className="bg-[#E74C3C] text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300 hidden md:block" />

              </button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 dark:bg-[#111111] dark:border-[#333]">

              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
              </div>

              <DropdownMenuSeparator className="dark:bg-[#222]" />

              <DropdownMenuItem className="cursor-pointer">
                View Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="dark:bg-[#222]" />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 dark:text-red-400"
                onClick={() => {
                  sessionStorage.clear();
                  router.push('/role-selection');
                }}
              >
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}