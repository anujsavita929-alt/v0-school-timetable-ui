'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Users, BookOpen } from 'lucide-react';

export default function RoleSelectionPage() {
  const roles = [
    {
      id: 'principal',
      title: 'Principal',
      description: 'Manage the entire school timetable and view analytics',
      icon: Users,
      color: '#E74C3C',
      features: ['Full timetable control', 'Student management', 'Teacher management', 'Analytics & reports'],
      href: '/login/principal',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'View your classes and manage your schedule',
      icon: BookOpen,
      color: '#27AE60',
      features: ['View timetable', 'Track assignments', 'Manage classes', 'Notifications'],
      href: '/login/teacher',
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Check your personal timetable and class details',
      icon: Clock,
      color: '#E83E8C',
      features: ['Personal schedule', 'Class details', 'Teacher info', 'Stay organized'],
      href: '/login/student',
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <Link href="/">
            <span className="font-bold text-xl text-gray-900 cursor-pointer hover:opacity-80">SchoolTime</span>
          </Link>
        </div>

        <div className="space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600">
            Select your role to access the appropriate dashboard and features
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200 group hover:shadow-lg"
              >
                {/* Header with accent color */}
                <div
                  className="h-24 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: `${role.color}20` }}
                >
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{ backgroundColor: role.color }}
                  ></div>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: role.color }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {role.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: role.color }}
                        ></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Link href={role.href} className="block w-full">
                    <Button
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: role.color }}
                    >
                      Continue as {role.title}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Don't have an account?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Principals</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact your school administrator to get your principal account set up.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Teachers</h3>
              <p className="text-gray-600 text-sm mb-4">
                Ask your school administrator for teacher account access.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Students</h3>
              <p className="text-gray-600 text-sm mb-4">
                You can create an account using your student ID and email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
