'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Search, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { SignupStepper } from '@/components/signup/SignupStepper';

export default function SignupStep1Page() {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const organizations = [
    { id: 1, name: 'Springfield High School', code: 'SHS001' },
    { id: 2, name: 'Lincoln Academy', code: 'LA002' },
    { id: 3, name: 'Washington Institute', code: 'WI003' },
    { id: 4, name: 'Jefferson College', code: 'JC004' },
    { id: 5, name: 'Madison Central', code: 'MC005' },
    { id: 6, name: 'Roosevelt School', code: 'RS006' },
  ];

  const roles = [
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Manage classes and track student performance',
      icon: BookOpen,
      color: '#27AE60',
    },
    {
      id: 'student',
      title: 'Student',
      description: 'View your personal timetable and class details',
      icon: Clock,
      color: '#E83E8C',
    },
  ];

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedOrg && selectedRole) {
      router.push(`/signup/step2?org=${selectedOrg}&role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Link href="/">
            <div className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 w-fit">
              <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">SchoolTime</span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Let's get you started in a few simple steps</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <SignupStepper currentStep={1} totalSteps={4} />

        <div className="mt-12 space-y-12">
          {/* Step 1: Organization Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Organization</h2>
            <p className="text-gray-600">Find your school or organization from the list below</p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {filteredOrgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => setSelectedOrg(org.id.toString())}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedOrg === org.id.toString()
                      ? 'border-[#E74C3C] bg-[#E74C3C]/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <p className="font-medium text-gray-900">{org.name}</p>
                  <p className="text-sm text-gray-600">Code: {org.code}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Role Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            <p className="text-gray-600">Choose how you'll use SchoolTime</p>

            <div className="grid md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                      selectedRole === role.id
                        ? 'border-[#E74C3C] bg-[#E74C3C]/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: role.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{role.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Link href="/role-selection" className="flex-1">
              <Button variant="outline" className="w-full">
                Go Back
              </Button>
            </Link>
            <Button
              onClick={handleNext}
              disabled={!selectedOrg || !selectedRole}
              className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
