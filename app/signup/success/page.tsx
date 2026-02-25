'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, BookOpen, Users } from 'lucide-react';

export default function SignupSuccessPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const getRoleColor = () => {
    return role === 'teacher' ? '#27AE60' : '#E83E8C';
  };

  const getRoleIcon = () => {
    return role === 'teacher' ? BookOpen : Users;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 w-fit">
              <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">SchoolTime</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getRoleColor()}20` }}
              >
                <CheckCircle className="w-12 h-12" style={{ color: getRoleColor() }} />
              </div>
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white border-4 border-gray-100"
                style={{ backgroundColor: getRoleColor() }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Account Created Successfully!</h1>
            <p className="text-lg text-gray-600">
              Welcome to SchoolTime, {role === 'teacher' ? 'Teacher' : 'Student'}!
            </p>
          </div>

          {/* Success Message */}
          <div
            className="p-6 rounded-lg text-left space-y-3"
            style={{ backgroundColor: `${getRoleColor()}10`, borderLeft: `4px solid ${getRoleColor()}` }}
          >
            <p style={{ color: getRoleColor() }} className="font-semibold">
              Next Steps:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: getRoleColor() }}>
                  1.
                </span>
                <span>A confirmation email has been sent to your registered email address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: getRoleColor() }}>
                  2.
                </span>
                <span>Please verify your email to activate your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: getRoleColor() }}>
                  3.
                </span>
                <span>
                  {role === 'teacher'
                    ? 'Once verified, you can access your dashboard and manage your classes'
                    : 'Once verified, you can view your timetable and class details'}
                </span>
              </li>
            </ul>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div
              className="p-4 rounded-lg text-left"
              style={{ backgroundColor: `${getRoleColor()}5` }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">Access Your Dashboard</h3>
              <p className="text-sm text-gray-600">
                {role === 'teacher'
                  ? 'Manage classes, track attendance, and communicate with students'
                  : 'View your classes, check your schedule, and stay organized'}
              </p>
            </div>

            <div
              className="p-4 rounded-lg text-left"
              style={{ backgroundColor: `${getRoleColor()}5` }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">Personalize Your Profile</h3>
              <p className="text-sm text-gray-600">
                Add a profile picture and update your information anytime
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/role-selection" className="w-full">
              <Button
                className="w-full text-white py-3 rounded-lg font-semibold"
                style={{ backgroundColor: getRoleColor() }}
              >
                Go to Dashboard
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full py-3 rounded-lg font-semibold">
                Return Home
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p>
              Have questions? Contact us at{' '}
              <span className="font-medium text-gray-900">support@schooltime.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
