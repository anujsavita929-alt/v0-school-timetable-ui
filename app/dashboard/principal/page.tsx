"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Bell, 
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Coffee,
  Plus,
  School as SchoolIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  read: boolean;
}

export default function PrincipalDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Listen for notifications in localStorage
  useEffect(() => {
    const loadNotifications = () => {
      const stored = localStorage.getItem("admin_notifications");
      if (stored) {
        setNotifications(JSON.parse(stored).reverse());
      }
    };

    loadNotifications();

    // Listen for storage changes (for cross-tab support)
    window.addEventListener("storage", loadNotifications);
    
    // Check every few seconds as well for same-tab updates
    const interval = setInterval(loadNotifications, 3000);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      clearInterval(interval);
    };
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: "450",
      description: "+12 from last month",
      icon: Users,
      color: "bg-red-500",
      href: "/dashboard/principal/students"
    },
    {
      title: "Total Teachers",
      value: "35",
      description: "2 on leave today",
      icon: BookOpen,
      color: "bg-emerald-500",
      href: "/dashboard/principal/teachers"
    },
    {
      title: "Active Classes",
      value: "12",
      description: "85% occupancy",
      icon: Clock,
      color: "bg-orange-500",
      href: "/dashboard/principal/classes"
    },
    {
      title: "This Month",
      value: "98",
      description: "+2% increase",
      icon: TrendingUp,
      color: "bg-pink-500",
      href: "#"
    }
  ];

  const markAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem("admin_notifications", JSON.stringify(updated.reverse()));
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100">Principal Dashboard</h1>
          <p className="text-slate-500 dark:text-gray-400">Welcome back, Principal. Here's what's happening at SchoolTime today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 dark:border-[#333] dark:text-gray-300 dark:hover:bg-[#1a1a1a]">
            <Calendar className="w-4 h-4" />
            March 22, 2026
          </Button>
          <Button className="bg-slate-900 dark:bg-red-600 dark:hover:bg-red-700 gap-2" asChild>
            <Link href="/dashboard/principal/timetable/generate">
              <Clock className="w-4 h-4" />
              Generate Timetable
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-[#222] dark:bg-[#111111] cursor-pointer group h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-400">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-gray-100">{stat.value}</div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Today's Schedule - Left Column */}
        <Card className="md:col-span-2 shadow-sm border-slate-200 dark:border-[#222] dark:bg-[#111111]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold dark:text-gray-100">Today's Schedule</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/dashboard/principal/timetable/generate">Generate Timetable</Link>
              </Button>
              <Button size="sm" variant="outline" className="dark:border-[#333] dark:text-gray-300" asChild>
                <Link href="/timetable">View Full Schedule</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Morning Assembly & Period 3", time: "10:00 AM - 10:50 AM", location: "Main Hall", icon: Clock },
              { title: "Lunch Break", time: "10:50 AM - 11:35 AM", location: "Cafeteria", icon: Coffee, isBreak: true },
              { title: "Class 10-A Mathematics", time: "12:35 PM - 01:25 PM", location: "Room 101", icon: SchoolIcon },
            ].map((event, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200/50 dark:border-[#222] bg-slate-50/50 dark:bg-[#1a1a1a] hover:bg-slate-50 dark:hover:bg-[#222] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${event.isBreak ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-gray-100">{event.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-widest font-bold">{event.location}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-gray-200">
                  {event.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions - Right Column */}
        <Card className="shadow-sm border-slate-200 dark:border-[#222] dark:bg-[#111111]">
          <CardHeader>
            <CardTitle className="text-xl font-bold dark:text-gray-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full h-12 justify-start bg-red-500 hover:bg-red-600 text-white font-bold gap-3" 
              asChild
            >
              <Link href="/dashboard/principal/students">
                <Users className="w-5 h-5" />
                Manage Students
              </Link>
            </Button>
            <Button 
              className="w-full h-12 justify-start bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-3" 
              asChild
            >
              <Link href="/dashboard/principal/teachers">
                <BookOpen className="w-5 h-5" />
                Manage Teachers
              </Link>
            </Button>
            <Button 
              className="w-full h-12 justify-start bg-orange-500 hover:bg-orange-600 text-white font-bold gap-3" 
              asChild
            >
              <Link href="/timetable">
                <Clock className="w-5 h-5" />
                Edit Timetable
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
