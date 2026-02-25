'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function CreateOrganizationPage() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.code.trim()) newErrors.code = 'Organization code is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, this would submit to a backend
      alert('Organization created successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/principal" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Organization</h1>
          </div>
          <p className="text-gray-600">Set up a new school or organization for SchoolTime</p>
        </div>

        {/* Form Card */}
        <Card className="p-8 border border-gray-200 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="form-label">Organization Name *</label>
              <Input
                type="text"
                placeholder="e.g., Springfield High School"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Organization Code */}
            <div>
              <label className="form-label">Organization Code *</label>
              <Input
                type="text"
                placeholder="e.g., SHS001"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="form-input"
                maxLength={10}
              />
              {errors.code && <p className="form-error">{errors.code}</p>}
              <p className="text-xs text-gray-600 mt-1">Used for quick identification</p>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address *</label>
              <Input
                type="email"
                placeholder="admin@school.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="form-label">Address</label>
              <Input
                type="text"
                placeholder="School address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Link href="/dashboard/principal" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-[#E74C3C] hover:bg-red-700 text-white"
              >
                Create Organization
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Note:</span> You can add teachers and students to this organization after creation. Organization codes help with quick joining.
          </p>
        </div>
      </div>
    </div>
  );
}
