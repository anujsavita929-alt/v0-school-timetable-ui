'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, ArrowLeft, Users, Settings, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageOrganizationsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<
    {
      id: string;
      name: string;
      code: string;
      email: string | null;
      phone: string | null;
      address: string | null;
      createdAt: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<
    | {
        id: string;
        name: string;
        code: string;
        email: string | null;
        phone: string | null;
        address: string | null;
      }
    | null
  >(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/organizations');
        if (!res.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data = await res.json();
        setOrganizations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  return (
    <>
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
                    backgroundColor: '#27AE6020',
                    color: '#27AE60',
                  }}
                >
                  Active
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {org.email ?? '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {/* Placeholder until members are modeled */}
                    Members: —
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Created: {new Date(org.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-2"
                  onClick={() =>
                    router.push(`/dashboard/principal?organizationId=${org.id}`)
                  }
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-2"
                  onClick={() =>
                    setSelectedOrg({
                      id: org.id,
                      name: org.name,
                      code: org.code,
                      email: org.email,
                      phone: org.phone,
                      address: org.address,
                    })
                  }
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center gap-2 text-red-600 hover:text-red-700"
                  onClick={() => setDeleteId(org.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State (if no organizations) */}
        {!isLoading && organizations.length === 0 && (
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

    {/* Edit dialog */}
    {selectedOrg && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Edit Organization
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setIsSaving(true);
                const res = await fetch(
                  `/api/organizations/${selectedOrg.id}`,
                  {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(selectedOrg),
                  },
                );
                if (!res.ok) {
                  throw new Error('Failed to update organization');
                }
                const updated = await res.json();
                setOrganizations((prev) =>
                  prev.map((org) =>
                    org.id === updated.id ? { ...org, ...updated } : org,
                  ),
                );
                setSelectedOrg(null);
              } catch (error) {
                console.error(error);
                alert('Failed to update organization.');
              } finally {
                setIsSaving(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Name
              </label>
              <input
                type="text"
                value={selectedOrg.name}
                onChange={(e) =>
                  setSelectedOrg({ ...selectedOrg, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Code
              </label>
              <input
                type="text"
                value={selectedOrg.code}
                onChange={(e) =>
                  setSelectedOrg({ ...selectedOrg, code: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <input
                type="email"
                value={selectedOrg.email ?? ''}
                onChange={(e) =>
                  setSelectedOrg({ ...selectedOrg, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={selectedOrg.phone ?? ''}
                onChange={(e) =>
                  setSelectedOrg({ ...selectedOrg, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Address
              </label>
              <input
                type="text"
                value={selectedOrg.address ?? ''}
                onChange={(e) =>
                  setSelectedOrg({ ...selectedOrg, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#E74C3C] hover:bg-red-700 rounded-lg disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Delete confirmation */}
    {deleteId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Delete organization?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch(`/api/organizations/${deleteId}`, {
                    method: 'DELETE',
                  });
                  if (!res.ok) {
                    throw new Error('Failed to delete organization');
                  }
                  setOrganizations((prev) =>
                    prev.filter((org) => org.id !== deleteId),
                  );
                  setDeleteId(null);
                } catch (error) {
                  console.error(error);
                  alert('Failed to delete organization.');
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
