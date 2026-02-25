'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, BookOpen, Users, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboard() {
  const nextClasses = [
    {
      id: 1,
      subject: 'Mathematics',
      teacher: 'Mr. Smith',
      time: '10:00 AM',
      room: '101',
      color: '#E74C3C',
    },
    {
      id: 2,
      subject: 'English',
      teacher: 'Ms. Johnson',
      time: '11:00 AM',
      room: '102',
      color: '#27AE60',
    },
    {
      id: 3,
      subject: 'Science',
      teacher: 'Dr. Brown',
      time: '12:00 PM',
      room: '103',
      color: '#F39C12',
    },
  ];

  const weekSchedule = [
    { day: 'Today (Monday)', classes: 5, status: 'active' },
    { day: 'Tuesday', classes: 5, status: 'upcoming' },
    { day: 'Wednesday', classes: 4, status: 'upcoming' },
    { day: 'Thursday', classes: 5, status: 'upcoming' },
    { day: 'Friday', classes: 4, status: 'upcoming' },
  ];

  const academicInfo = [
    {
      id: 1,
      subject: 'Mathematics',
      percentage: 85,
      color: '#E74C3C',
    },
    {
      id: 2,
      subject: 'English',
      percentage: 78,
      color: '#27AE60',
    },
    {
      id: 3,
      subject: 'Science',
      percentage: 92,
      color: '#F39C12',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, Arun!</h1>
        <p className="text-gray-600">Class 10-A | Roll No: 12</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Present Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4/5</p>
            </div>
            <div className="p-3 rounded-lg bg-[#27AE60]/10">
              <Clock className="w-6 h-6 text-[#27AE60]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Attendance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">94%</p>
            </div>
            <div className="p-3 rounded-lg bg-[#E74C3C]/10">
              <Users className="w-6 h-6 text-[#E74C3C]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">85%</p>
            </div>
            <div className="p-3 rounded-lg bg-[#F39C12]/10">
              <Award className="w-6 h-6 text-[#F39C12]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Classes Left</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
            </div>
            <div className="p-3 rounded-lg bg-[#E83E8C]/10">
              <BookOpen className="w-6 h-6 text-[#E83E8C]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Next Classes */}
        <div className="md:col-span-2">
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
              <Link href="/timetable">
                <Button variant="outline" size="sm">
                  View Full Schedule
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {nextClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="border-l-4 p-4 bg-gray-50 rounded-r-lg hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderLeftColor: classItem.color }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{classItem.subject}</h3>
                      <p className="text-sm text-gray-600">by {classItem.teacher}</p>
                    </div>
                    <Badge variant="secondary">{classItem.time}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Room {classItem.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Week Overview */}
        <div>
          <Card className="p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">This Week</h2>
            <div className="space-y-3">
              {weekSchedule.map((day) => (
                <div
                  key={day.day}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    day.status === 'active'
                      ? 'bg-[#E74C3C]/10 border border-[#E74C3C]/20'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium text-gray-900">{day.day}</span>
                  <Badge
                    variant={day.status === 'active' ? 'default' : 'secondary'}
                    className={
                      day.status === 'active'
                        ? 'bg-[#E74C3C] text-white'
                        : ''
                    }
                  >
                    {day.classes} classes
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Academic Performance */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Performance</h2>
        <div className="space-y-6">
          {academicInfo.map((subject) => (
            <div key={subject.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{subject.subject}</span>
                <span className="text-sm font-bold text-gray-900">
                  {subject.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: subject.color,
                    width: `${subject.percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notices */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Important Notices</h2>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Exam schedule: March 15-25 (All subjects)
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-900">
              Project submission deadline: March 10
            </p>
          </div>
        </div>
      </Card>

      {/* Additional Actions */}
      <Card className="p-6 border border-gray-200 rounded-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg bg-[#27AE60]/10 hover:bg-[#27AE60]/20 transition-colors text-left border border-[#27AE60]/20">
            <div className="w-10 h-10 rounded-lg bg-[#27AE60]/20 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#27AE60]" />
            </div>
            <p className="font-medium text-gray-900">Export Timetable</p>
            <p className="text-xs text-gray-600">Download your schedule</p>
          </button>

          <button className="p-4 rounded-lg bg-[#F39C12]/10 hover:bg-[#F39C12]/20 transition-colors text-left border border-[#F39C12]/20">
            <div className="w-10 h-10 rounded-lg bg-[#F39C12]/20 flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-[#F39C12]" />
            </div>
            <p className="font-medium text-gray-900">View Results</p>
            <p className="text-xs text-gray-600">Check your grades</p>
          </button>

          <button className="p-4 rounded-lg bg-[#E83E8C]/10 hover:bg-[#E83E8C]/20 transition-colors text-left border border-[#E83E8C]/20">
            <div className="w-10 h-10 rounded-lg bg-[#E83E8C]/20 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-[#E83E8C]" />
            </div>
            <p className="font-medium text-gray-900">My Profile</p>
            <p className="text-xs text-gray-600">Update your info</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
