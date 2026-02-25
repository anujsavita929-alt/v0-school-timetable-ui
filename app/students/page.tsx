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

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Arun Kumar',
      studentId: 'STU001',
      class: '10-A',
      email: 'arun.kumar@school.com',
      phone: '9876543210',
      status: 'active',
      enrollmentDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Priya Singh',
      studentId: 'STU002',
      class: '10-A',
      email: 'priya.singh@school.com',
      phone: '9876543211',
      status: 'active',
      enrollmentDate: '2023-01-16',
    },
    {
      id: 3,
      name: 'Rahul Patel',
      studentId: 'STU003',
      class: '10-B',
      email: 'rahul.patel@school.com',
      phone: '9876543212',
      status: 'active',
      enrollmentDate: '2023-01-17',
    },
    {
      id: 4,
      name: 'Neha Sharma',
      studentId: 'STU004',
      class: '9-A',
      email: 'neha.sharma@school.com',
      phone: '9876543213',
      status: 'inactive',
      enrollmentDate: '2023-02-01',
    },
    {
      id: 5,
      name: 'Vikram Gupta',
      studentId: 'STU005',
      class: '9-B',
      email: 'vikram.gupta@school.com',
      phone: '9876543214',
      status: 'active',
      enrollmentDate: '2023-02-05',
    },
    {
      id: 6,
      name: 'Divya Reddy',
      studentId: 'STU006',
      class: '10-A',
      email: 'divya.reddy@school.com',
      phone: '9876543215',
      status: 'active',
      enrollmentDate: '2023-02-10',
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      selectedClass === 'all' || student.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-2">Manage all students in the school</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-[#E74C3C] hover:bg-red-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Student
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

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
            >
              <option value="all">All Classes</option>
              <option value="10-A">10-A</option>
              <option value="10-B">10-B</option>
              <option value="9-A">9-A</option>
              <option value="9-B">9-B</option>
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
                <TableHead className="font-semibold text-gray-900">Student ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Class</TableHead>
                <TableHead className="font-semibold text-gray-900">Email</TableHead>
                <TableHead className="font-semibold text-gray-900">Phone</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-gray-600">{student.studentId}</TableCell>
                    <TableCell className="text-gray-600">{student.class}</TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-gray-600">{student.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === 'active' ? 'default' : 'secondary'}
                        className={
                          student.status === 'active'
                            ? 'bg-[#27AE60] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }
                      >
                        {student.status}
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
                    <p className="text-gray-600">No students found</p>
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
            <p className="text-gray-600 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Active Students</p>
            <p className="text-3xl font-bold text-[#27AE60] mt-2">
              {students.filter((s) => s.status === 'active').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Inactive Students</p>
            <p className="text-3xl font-bold text-[#E74C3C] mt-2">
              {students.filter((s) => s.status === 'inactive').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
