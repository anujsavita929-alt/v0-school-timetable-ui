'use client';

import { Users, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PrincipalDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Students', value: 0, icon: Users, color: '#E74C3C' },
    { label: 'Total Teachers', value: 0, icon: BookOpen, color: '#27AE60' },
    { label: 'Active Classes', value: 0, icon: Clock, color: '#F39C12' },
    { label: 'This Month', value: 0, icon: TrendingUp, color: '#E83E8C' },
  ]);

  // Animate counter on mount
  useEffect(() => {
    const finalValues = [
      { label: 'Total Students', value: 450, icon: Users, color: '#E74C3C' },
      { label: 'Total Teachers', value: 35, icon: BookOpen, color: '#27AE60' },
      { label: 'Active Classes', value: 12, icon: Clock, color: '#F39C12' },
      { label: 'This Month', value: 98, icon: TrendingUp, color: '#E83E8C' },
    ];

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setStats(
        finalValues.map((stat) => ({
          ...stat,
          value: Math.floor(stat.value * progress),
        }))
      );

      if (progress === 1) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const todaysSchedule = [
    {
      id: 1,
      time: '10:00 AM',
      event: 'Morning Assembly',
      location: 'Main Hall',
      type: 'event',
    },
    {
      id: 2,
      time: '12:00 PM',
      event: 'Class 10-A Mathematics',
      location: 'Room 101',
      type: 'class',
    },
    {
      id: 3,
      time: '1:00 PM',
      event: 'Staff Meeting',
      location: 'Principal Office',
      type: 'meeting',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New student enrolled',
      description: 'Akshay Kumar joined Class 9-B',
      time: '2 hours ago',
      icon: Users,
    },
    {
      id: 2,
      action: 'Teacher assigned',
      description: 'Ms. Priya assigned to Physics',
      time: '4 hours ago',
      icon: BookOpen,
    },
    {
      id: 3,
      action: 'Schedule updated',
      description: 'Class 10-A schedule changed',
      time: '1 day ago',
      icon: Clock,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Principal Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your school overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2 count-up">
                    {stat.value}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="md:col-span-2">
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
              <Link href="/timetable">
                <Button variant="outline" size="sm">
                  View Full Schedule
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {todaysSchedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#E74C3C]/10 rounded-lg">
                      <Clock className="w-6 h-6 text-[#E74C3C]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.event}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/students" className="block">
                <Button className="w-full bg-[#E74C3C] hover:bg-red-700 text-white justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Students
                </Button>
              </Link>
              <Link href="/teachers" className="block">
                <Button className="w-full bg-[#27AE60] hover:bg-green-700 text-white justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Teachers
                </Button>
              </Link>
              <Link href="/timetable" className="block">
                <Button className="w-full bg-[#F39C12] hover:bg-orange-600 text-white justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Edit Timetable
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Organization & Administration */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Organization Creation */}
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Organization Management</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create or manage your school organization
          </p>
          <div className="space-y-3">
            <Link href="/organizations" className="block">
              <Button variant="outline" className="w-full justify-center">
                Create Organization
              </Button>
            </Link>
            <Link href="/organizations/manage" className="block">
              <Button variant="outline" className="w-full justify-center">
                Manage Organizations
              </Button>
            </Link>
          </div>
        </Card>

        {/* Email Notification Logs */}
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Email Notification Logs</h3>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">Total Sent</span>
              <span className="font-semibold text-gray-900">324</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">Successful</span>
              <span className="font-semibold text-[#27AE60]">318</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">Failed</span>
              <span className="font-semibold text-[#E74C3C]">6</span>
            </div>
          </div>
          <Link href="/dashboard/teacher/email-logs" className="block">
            <Button variant="outline" className="w-full justify-center">
              View Detailed Logs
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#E74C3C]/10 rounded-full">
                    <Icon className="w-5 h-5 text-[#E74C3C]" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
