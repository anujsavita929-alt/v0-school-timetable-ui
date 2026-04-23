'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, Search, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function EmailLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const emailLogs = [
    {
      id: 1,
      date: '2024-02-24',
      time: '09:30 AM',
      teacher: 'Mr. Sharma',
      class: 'Class 10-A',
      subject: 'Mathematics',
      emailsSent: 45,
      status: 'Success',
      statusColor: '#27AE60',
    },
    {
      id: 2,
      date: '2024-02-24',
      time: '09:15 AM',
      teacher: 'Ms. Priya',
      class: 'Class 9-B',
      subject: 'English',
      emailsSent: 42,
      status: 'Success',
      statusColor: '#27AE60',
    },
    {
      id: 3,
      date: '2024-02-23',
      time: '02:45 PM',
      teacher: 'Dr. Kumar',
      class: 'Class 11-A',
      subject: 'Physics',
      emailsSent: 38,
      status: 'Partial',
      statusColor: '#F39C12',
    },
    {
      id: 4,
      date: '2024-02-23',
      time: '10:00 AM',
      teacher: 'Mr. Sharma',
      class: 'Class 10-B',
      subject: 'Mathematics',
      emailsSent: 48,
      status: 'Failed',
      statusColor: '#E74C3C',
    },
    {
      id: 5,
      date: '2024-02-22',
      time: '01:20 PM',
      teacher: 'Ms. Anjali',
      class: 'Class 8-A',
      subject: 'Science',
      emailsSent: 35,
      status: 'Success',
      statusColor: '#27AE60',
    },
    {
      id: 6,
      date: '2024-02-22',
      time: '09:00 AM',
      teacher: 'Mr. Ramesh',
      class: 'Class 12-A',
      subject: 'History',
      emailsSent: 40,
      status: 'Success',
      statusColor: '#27AE60',
    },
  ];

  const filteredLogs = emailLogs.filter((log) => {
    const matchesSearch = log.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    if (status === 'Success') return <CheckCircle className="w-4 h-4" />;
    if (status === 'Failed') return <AlertCircle className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/teacher">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Email Notification Logs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track all absence notification emails sent to students</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 border border-gray-200 dark:border-[#222] dark:bg-[#111111] rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Emails</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">248</p>
        </Card>
        <Card className="p-6 border border-gray-200 dark:border-[#222] dark:bg-[#111111] rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Successful</p>
          <p className="text-3xl font-bold text-[#27AE60] mt-2">235</p>
        </Card>
        <Card className="p-6 border border-gray-200 dark:border-[#222] dark:bg-[#111111] rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Partial</p>
          <p className="text-3xl font-bold text-[#F39C12] mt-2">8</p>
        </Card>
        <Card className="p-6 border border-gray-200 dark:border-[#222] dark:bg-[#111111] rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Failed</p>
          <p className="text-3xl font-bold text-[#E74C3C] mt-2">5</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border border-gray-200 dark:border-[#222] dark:bg-[#111111] rounded-2xl">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="form-label">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by teacher, class, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="form-label">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="Success">Success</option>
              <option value="Partial">Partial</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="form-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="date">Recent First</option>
              <option value="teacher">Teacher Name</option>
              <option value="emails">Emails Sent</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Email Logs Table */}
      <Card className="p-6 border border-gray-200 dark:border-[#222] dark:bg-[#111111] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#222]">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Teacher</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Class</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Emails Sent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-[#222] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{log.date}</p>
                        <p className="text-gray-600 dark:text-gray-400">{log.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{log.teacher}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700 dark:text-gray-300">{log.class}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700 dark:text-gray-300">{log.subject}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 dark:text-gray-100 font-semibold">{log.emailsSent}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div style={{ color: log.statusColor }}>
                          {getStatusIcon(log.status)}
                        </div>
                        <Badge
                          style={{
                            backgroundColor: `${log.statusColor}20`,
                            color: log.statusColor,
                          }}
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm" className="text-xs">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-600 dark:text-gray-400">
                    No email logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
