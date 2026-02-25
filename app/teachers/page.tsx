'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const teachers = [
    {
      id: 1,
      name: 'Mr. Rajesh Smith',
      teacherId: 'TCH001',
      subject: 'Mathematics',
      email: 'rajesh.smith@school.com',
      phone: '9876543220',
      classes: ['10-A', '10-B', '9-A'],
      status: 'active',
      joinDate: '2020-06-15',
    },
    {
      id: 2,
      name: 'Ms. Priya Johnson',
      teacherId: 'TCH002',
      subject: 'English',
      email: 'priya.johnson@school.com',
      phone: '9876543221',
      classes: ['10-A', '9-B'],
      status: 'active',
      joinDate: '2021-07-10',
    },
    {
      id: 3,
      name: 'Dr. Amit Brown',
      teacherId: 'TCH003',
      subject: 'Science',
      email: 'amit.brown@school.com',
      phone: '9876543222',
      classes: ['10-A', '10-B', '8-A'],
      status: 'active',
      joinDate: '2019-05-20',
    },
    {
      id: 4,
      name: 'Mr. Vikram Davis',
      teacherId: 'TCH004',
      subject: 'History',
      email: 'vikram.davis@school.com',
      phone: '9876543223',
      classes: ['9-A', '8-B'],
      status: 'active',
      joinDate: '2021-08-01',
    },
    {
      id: 5,
      name: 'Ms. Sarah Lee',
      teacherId: 'TCH005',
      subject: 'Computer Science',
      email: 'sarah.lee@school.com',
      phone: '9876543224',
      classes: ['10-B', '9-A', '8-A'],
      status: 'inactive',
      joinDate: '2020-09-15',
    },
    {
      id: 6,
      name: 'Mrs. Isabella Garcia',
      teacherId: 'TCH006',
      subject: 'Physical Education',
      email: 'isabella.garcia@school.com',
      phone: '9876543225',
      classes: ['10-A', '10-B', '9-A', '9-B'],
      status: 'active',
      joinDate: '2018-03-10',
    },
  ];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      selectedSubject === 'all' || teacher.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(teachers.map((t) => t.subject))];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Teachers Management</h1>
          <p className="text-gray-600 mt-2">Manage all teachers in the school</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-[#27AE60] hover:bg-green-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Teacher ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Subject</TableHead>
                <TableHead className="font-semibold text-gray-900">Email</TableHead>
                <TableHead className="font-semibold text-gray-900">Classes</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {teacher.name}
                    </TableCell>
                    <TableCell className="text-gray-600">{teacher.teacherId}</TableCell>
                    <TableCell className="text-gray-600">{teacher.subject}</TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {teacher.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex gap-1 flex-wrap">
                        {teacher.classes.map((cls) => (
                          <Badge key={cls} variant="secondary" className="text-xs">
                            {cls}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={teacher.status === 'active' ? 'default' : 'secondary'}
                        className={
                          teacher.status === 'active'
                            ? 'bg-[#27AE60] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-600">No teachers found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Teachers</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{teachers.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Teachers</p>
            <p className="text-3xl font-bold text-[#27AE60] mt-2">
              {teachers.filter((t) => t.status === 'active').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Subjects Offered</p>
            <p className="text-3xl font-bold text-[#F39C12] mt-2">
              {subjects.length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
