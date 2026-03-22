'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AbsencesPage() {
  const absenceRecords = [
    {
      id: 1,
      date: '2024-02-24',
      periods: ['Period 1', 'Period 2'],
      reason: 'Medical appointment',
      status: 'Approved',
      emailsSent: 90,
      color: '#27AE60',
    },
    {
      id: 2,
      date: '2024-02-20',
      periods: ['Period 3', 'Period 4', 'Period 5'],
      reason: 'Family emergency',
      status: 'Approved',
      emailsSent: 135,
      color: '#27AE60',
    },
    {
      id: 3,
      date: '2024-02-15',
      periods: ['Period 2'],
      reason: 'Weather conditions',
      status: 'Pending',
      emailsSent: 45,
      color: '#F39C12',
    },
    {
      id: 4,
      date: '2024-02-10',
      periods: ['Period 1', 'Period 2', 'Period 3', 'Period 4'],
      reason: 'Staff meeting',
      status: 'Approved',
      emailsSent: 180,
      color: '#27AE60',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/teacher">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Absence History</h1>
          <p className="text-gray-600 mt-1">View all your recorded absences</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <p className="text-gray-600 text-sm font-medium">Total Absences</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
        </Card>
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <p className="text-gray-600 text-sm font-medium">Approved</p>
          <p className="text-3xl font-bold text-[#27AE60] mt-2">3</p>
        </Card>
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-[#F39C12] mt-2">1</p>
        </Card>
        <Card className="p-6 border border-gray-200 rounded-2xl">
          <p className="text-gray-600 text-sm font-medium">Total Emails Sent</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">450</p>
        </Card>
      </div>

      {/* Absence Records Table */}
      <Card className="p-6 border border-gray-200 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Absence Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Periods</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Reason</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Emails Sent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {absenceRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {record.periods.map((period) => (
                        <Badge key={period} variant="secondary" className="text-xs">
                          {period}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700 text-sm">{record.reason}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      style={{
                        backgroundColor: `${record.color}20`,
                        color: record.color,
                      }}
                    >
                      {record.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900 font-medium">{record.emailsSent}</span>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notes Section */}
      <Card className="p-6 border border-gray-200 rounded-2xl bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">How absences work</h3>
            <ul className="text-sm text-red-800 mt-2 space-y-1">
              <li>• When you mark yourself absent, automatic emails are sent to all students in affected classes</li>
              <li>• Your absence request is reviewed and approved by the administration</li>
              <li>• You can track the email delivery status in the Email Logs section</li>
              <li>• Pending absences will be reviewed within 24 hours</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
