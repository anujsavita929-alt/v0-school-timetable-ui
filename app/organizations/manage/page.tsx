'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, ArrowLeft, Users, Settings, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ManageOrganizationsPage() {
  const organizations = [
    {
      id: 1,
      name: 'Springfield High School',
      code: 'SHS001',
      email: 'admin@springfield.edu',
      members: 487,
      status: 'Active',
      created: '2023-01-15',
    },
    {
      id: 2,
      name: 'Lincoln Academy',
      code: 'LA002',
      email: 'info@lincolnacademy.edu',
      members: 342,
      status: 'Active',
      created: '2023-02-20',
    },
    {
      id: 3,
      name: 'Washington Institute',
      code: 'WI003',
      email: 'contact@whinstitute.edu',
      members: 215,
      status: 'Active',
      created: '2023-03-10',
    },
    {
      id: 4,
      name: 'Jefferson College',
      code: 'JC004',
      email: 'admin@jeffersoncollege.edu',
      members: 156,
      status: 'Inactive',
      created: '2023-04-05',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/principal" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Organizations</h1>
                <p className="text-gray-600 text-sm mt-1">View and manage all your organizations</p>
              </div>
            </div>
            <Link href="/organizations">
              <Button className="bg-[#E74C3C] hover:bg-red-700 text-white">
                Create New
              </Button>
            </Link>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <Card key={org.id} className="p-6 border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                  <p className="text-sm text-gray-600">Code: {org.code}</p>
                </div>
                <Badge
                  style={{
                    backgroundColor: org.status === 'Active' ? '#27AE6020' : '#94949420',
                    color: org.status === 'Active' ? '#27AE60' : '#949494',
                  }}
                >
                  {org.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{org.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{org.members} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Created: {new Date(org.created).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State (if no organizations) */}
        {organizations.length === 0 && (
          <Card className="p-12 border border-gray-200 rounded-2xl text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No organizations yet</h3>
            <p className="text-gray-600 mb-6">Create your first organization to get started</p>
            <Link href="/organizations">
              <Button className="bg-[#E74C3C] hover:bg-red-700 text-white">
                Create Organization
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
