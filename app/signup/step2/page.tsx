'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { SignupStepper } from '@/components/signup/SignupStepper';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

export default function SignupStep2Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const org = searchParams.get('org') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ...(role === 'teacher' && {
      department: '',
      subject: '',
    }),
    ...(role === 'student' && {
      class: '',
      semester: '',
    }),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = ['Science', 'Mathematics', 'English', 'History', 'Physical Education'];
  const subjects = {
    Science: ['Physics', 'Chemistry', 'Biology'],
    Mathematics: ['Algebra', 'Geometry', 'Calculus'],
    English: ['Literature', 'Composition', 'Grammar'],
  };
  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B'];
  const semesters = ['Semester 1', 'Semester 2'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'teacher') {
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.subject) newErrors.subject = 'Subject is required';
    }

    if (role === 'student') {
      if (!formData.class) newErrors.class = 'Class is required';
      if (!formData.semester) newErrors.semester = 'Semester is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      router.push(`/signup/success?role=${role}`);
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Tell us a bit about yourself</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <SignupStepper currentStep={2} totalSteps={4} />

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {role === 'teacher' ? 'Teacher Registration' : 'Student Registration'}
          </h2>

          {/* Form Fields */}
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            {/* Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="form-input"
              />
              {errors.fullName && (
                <div className="form-error flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
              {errors.email && (
                <div className="form-error flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={formData.password} />
              {errors.password && (
                <div className="form-error flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="form-error flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Role-Specific Fields */}
            {role === 'teacher' && (
              <>
                <div>
                  <label className="form-label">Department</label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <div className="form-error flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.department}
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">Subject Specialization</label>
                  <select
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                    disabled={!formData.department}
                  >
                    <option value="">Select a subject</option>
                    {formData.department && subjects[formData.department as keyof typeof subjects]?.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <div className="form-error flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </div>
                  )}
                </div>
              </>
            )}

            {role === 'student' && (
              <>
                <div>
                  <label className="form-label">Class</label>
                  <select
                    value={formData.class || ''}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select your class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  {errors.class && (
                    <div className="form-error flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.class}
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">Semester</label>
                  <select
                    value={formData.semester || ''}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                  {errors.semester && (
                    <div className="form-error flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.semester}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-6">
              <Button variant="outline" className="flex-1">
                Go Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white"
              >
                Continue to Confirmation
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
