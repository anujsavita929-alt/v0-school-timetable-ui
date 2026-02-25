'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, Users, BookOpen, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function TeacherDashboard() {
  const [showMarkAbsentModal, setShowMarkAbsentModal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const todaysClasses = [
    {
      id: 1,
      className: 'Class 10-A',
      subject: 'Mathematics',
      time: '10:00 AM - 11:00 AM',
      room: '101',
      students: 45,
      color: '#E74C3C',
    },
    {
      id: 2,
      className: 'Class 9-B',
      subject: 'Mathematics',
      time: '12:00 PM - 1:00 PM',
      room: '102',
      students: 42,
      color: '#27AE60',
    },
    {
      id: 3,
      className: 'Class 8-A',
      subject: 'Mathematics',
      time: '2:00 PM - 3:00 PM',
      room: '103',
      students: 38,
      color: '#F39C12',
    },
  ];

  const weekSchedule = [
    { day: 'Monday', classes: 3 },
    { day: 'Tuesday', classes: 3 },
    { day: 'Wednesday', classes: 2 },
    { day: 'Thursday', classes: 3 },
    { day: 'Friday', classes: 2 },
  ];

  const announcements = [
    {
      id: 1,
      title: 'Exam Schedule Updated',
      description: 'Final exams will be held from March 15-25',
      type: 'alert',
      date: '2 hours ago',
    },
    {
      id: 2,
      title: 'New Teaching Resources Available',
      description: 'Check the library for new mathematics textbooks',
      type: 'info',
      date: '1 day ago',
    },
    {
      id: 3,
      title: 'Staff Meeting Rescheduled',
      description: 'Meeting moved to Friday at 4 PM',
      type: 'alert',
      date: '2 days ago',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome! Here's your teaching overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Today's Classes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
            </div>
            <div className="p-3 rounded-lg bg-[#E74C3C]/10">
              <Clock className="w-6 h-6 text-[#E74C3C]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">125</p>
            </div>
            <div className="p-3 rounded-lg bg-[#27AE60]/10">
              <Users className="w-6 h-6 text-[#27AE60]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Classes This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">13</p>
            </div>
            <div className="p-3 rounded-lg bg-[#F39C12]/10">
              <BookOpen className="w-6 h-6 text-[#F39C12]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Today's Classes */}
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
              {todaysClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="border-l-4 p-4 bg-gray-50 rounded-r-lg hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: classItem.color }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{classItem.className}</h3>
                      <p className="text-sm text-gray-600">{classItem.subject}</p>
                    </div>
                    <Badge variant="secondary" className="whitespace-nowrap">
                      {classItem.time}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Room {classItem.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{classItem.students} students</span>
                    </div>
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
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="font-medium text-gray-900">{day.day}</span>
                  <Badge variant="secondary">
                    {day.classes} classes
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Teacher Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Mark Absent Button */}
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Absence Management</h3>
            <AlertCircle className="w-5 h-5 text-[#E74C3C]" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Mark yourself as absent and notify all students
          </p>
          <Button
            onClick={() => setShowMarkAbsentModal(true)}
            className="w-full bg-[#E74C3C] hover:bg-red-700 text-white"
          >
            Mark Absent Today
          </Button>
        </Card>

        {/* Email Notifications */}
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Email Notifications</h3>
            <Mail className="w-5 h-5 text-[#27AE60]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Enabled</span>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  emailNotifications ? 'bg-[#27AE60]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-5' : ''
                  }`}
                ></div>
              </button>
            </div>
            <p className="text-xs text-gray-600">
              {emailNotifications
                ? 'You will receive notifications'
                : 'Notifications are disabled'}
            </p>
          </div>
        </Card>

        {/* Absence History */}
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Absence History</h3>
            <CheckCircle className="w-5 h-5 text-[#F39C12]" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View your absence records and email logs
          </p>
          <Link href="/dashboard/teacher/absences" className="w-full block">
            <Button variant="outline" className="w-full">
              View History
            </Button>
          </Link>
        </Card>
      </div>

      {/* Mark Absent Modal */}
      {showMarkAbsentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mark Yourself Absent</h2>
              <p className="text-gray-600 text-sm mt-1">
                Notify all your students about your absence
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="form-label">Periods Affected</label>
                <div className="space-y-2">
                  {['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5'].map((period) => (
                    <label key={period} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm text-gray-700">{period}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Reason (Optional)</label>
                <textarea
                  placeholder="Add a reason for your absence..."
                  className="form-input h-24 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowMarkAbsentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowMarkAbsentModal(false);
                  // Show success message (in real app, would send to backend)
                }}
                className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white"
              >
                Send Notification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Announcements</h2>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor:
                      announcement.type === 'alert' ? '#E74C3C20' : '#27AE6020',
                  }}
                >
                  <AlertCircle
                    className="w-5 h-5"
                    style={{
                      color: announcement.type === 'alert' ? '#E74C3C' : '#27AE60',
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {announcement.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
