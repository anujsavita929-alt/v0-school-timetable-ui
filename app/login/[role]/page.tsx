'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStorage } from '@/lib/session';

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const role = (params.role as string) || 'student';
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('Springfield High School');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock organizations data
  const organizations = [
    'Springfield High School',
    'Lincoln Academy',
    'Washington Institute',
    'Jefferson College',
  ];

  const getRoleDisplay = () => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleColor = () => {
    switch (role) {
      case 'principal':
        return '#E74C3C';
      case 'teacher':
        return '#27AE60';
      default:
        return '#E83E8C';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login and create a simple client-side session
    setTimeout(() => {
      sessionStorage.set({
        id: 'demo-user',
        role: role as 'principal' | 'teacher' | 'student',
        name: 'Demo User',
        email,
      });
      router.push(`/dashboard/${role}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <Link href="/">
              <div className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80">
                <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">SchoolTime</span>
              </div>
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Login as a <span className="font-semibold" style={{ color: getRoleColor() }}>
                {getRoleDisplay()}
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {/* Organization Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Organization
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent outline-none"
                >
                  <span className="text-gray-900">{selectedOrg}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showOrgDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showOrgDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {organizations.map((org) => (
                      <button
                        key={org}
                        type="button"
                        onClick={() => {
                          setSelectedOrg(org);
                          setShowOrgDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg text-gray-900"
                      >
                        {org}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <Link href="#" className="text-sm text-[#E74C3C] hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#E74C3C] focus:ring-[#E74C3C] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E74C3C] hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Not sure which role? <Link href="/role-selection" className="text-[#E74C3C] font-semibold hover:underline">
                Choose your role
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: demo@schooltime.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
