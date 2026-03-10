'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimetableGrid } from '@/components/timetable/TimetableGrid';
import { Download, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

type WeekKey = 'current' | 'next' | 'previous';

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState<'10-A' | '10-B' | '9-A' | '9-B' | '8-A'>('10-A');
  const [selectedWeek, setSelectedWeek] = useState<WeekKey>('current');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    id?: string;
    day: string;
    time: string;
    subject: string;
    teacher: string;
    room: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');

  const fetchTimetable = async (classId: string, week: WeekKey) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ classId, week });
      const res = await fetch(`/api/timetable?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load timetable');
      }
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch (err) {
      console.error(err);
      setError('Unable to load timetable. Please try again.');
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial timetable for default class/week
    fetchTimetable(selectedClass, selectedWeek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchTimetable(selectedClass, selectedWeek);
  };

  const getWeekLabel = (week: WeekKey) => {
    switch (week) {
      case 'next':
        return 'Next Week';
      case 'previous':
        return 'Previous Week';
      default:
        return 'Current Week';
    }
  };

  const handleExport = () => {
    if (!slots.length) return;

    const header = ['Day', 'Time', 'Subject', 'Teacher', 'Room'];
    const rows = slots.map((slot) => [
      slot.day,
      slot.time,
      slot.subject,
      slot.teacher,
      slot.room,
    ]);

    const csvContent = [header, ...rows]
      .map((cols) =>
        cols
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `timetable-${selectedClass}-${selectedWeek}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  const filteredSlots = slots.filter((slot) => {
    const matchesSubject =
      subjectFilter === 'all' || slot.subject === subjectFilter;
    const matchesTeacher =
      teacherFilter === 'all' || slot.teacher === teacherFilter;
    const matchesDay = dayFilter === 'all' || slot.day === dayFilter;
    return matchesSubject && matchesTeacher && matchesDay;
  });

  const uniqueSubjects = Array.from(new Set(slots.map((s) => s.subject)));
  const uniqueTeachers = Array.from(new Set(slots.map((s) => s.teacher)));
  const uniqueDays = Array.from(new Set(slots.map((s) => s.day)));

  const openEditDialog = (params: {
    day: string;
    time: string;
    slot: TimeSlot | null;
  }) => {
    const { day, time, slot } = params;
    if (slot) {
      setEditData({
        id: slot.id,
        day: slot.day,
        time: slot.time,
        subject: slot.subject,
        teacher: slot.teacher,
        room: slot.room,
      });
    } else {
      setEditData({
        day,
        time,
        subject: '',
        teacher: '',
        room: '',
      });
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    try {
      setIsSaving(true);
      const res = await fetch('/api/timetable', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          week: selectedWeek,
          slotId: editData.id,
          day: editData.day,
          time: editData.time,
          subject: editData.subject,
          teacher: editData.teacher,
          room: editData.room,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to save timetable entry');
      }
      const data = await res.json();
      setSlots(data.slots ?? []);
      setEditData(null);
    } catch (err) {
      console.error(err);
      setError('Unable to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            View and manage schedules for{' '}
            <span className="font-semibold text-gray-900">
              Class {selectedClass}
            </span>{' '}
            ({getWeekLabel(selectedWeek)})
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 text-sm md:text-base"
            onClick={handleExport}
            disabled={!slots.length}
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-sm md:text-base"
            onClick={handlePrint}
            disabled={!slots.length}
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">Print</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Class
            </label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10-A">Class 10-A</SelectItem>
                <SelectItem value="10-B">Class 10-B</SelectItem>
                <SelectItem value="9-A">Class 9-A</SelectItem>
                <SelectItem value="9-B">Class 9-B</SelectItem>
                <SelectItem value="8-A">Class 8-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Week
            </label>
            <Select
              value={selectedWeek}
              onValueChange={(value: WeekKey) => setSelectedWeek(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="next">Next Week</SelectItem>
                <SelectItem value="previous">Previous Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              className="w-full bg-[#E74C3C] hover:bg-red-700 text-white"
              onClick={handleApplyFilters}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Additional Filters */}
      <Card className="p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subject
            </label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Teacher
            </label>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
            >
              <option value="all">All Teachers</option>
              {uniqueTeachers.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Day
            </label>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
            >
              <option value="all">All Days</option>
              {uniqueDays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card className="p-6 border border-gray-200 overflow-hidden">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <TimetableGrid
            slots={filteredSlots}
            onCellClick={openEditDialog}
          />
        )}
      </Card>

      {/* Legend */}
      <Card className="p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Color Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E74C3C' }}></div>
            <span className="text-gray-700">Mathematics</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#27AE60' }}></div>
            <span className="text-gray-700">English</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F39C12' }}></div>
            <span className="text-gray-700">Science</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E83E8C' }}></div>
            <span className="text-gray-700">Others</span>
          </div>
        </div>
      </Card>

      {/* Edit Dialog (simple inline card overlay) */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editData.id ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
            </h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Day
                  </label>
                  <input
                    type="text"
                    value={editData.day}
                    onChange={(e) =>
                      setEditData({ ...editData, day: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={editData.time}
                    onChange={(e) =>
                      setEditData({ ...editData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={editData.subject}
                  onChange={(e) =>
                    setEditData({ ...editData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Teacher
                </label>
                <input
                  type="text"
                  value={editData.teacher}
                  onChange={(e) =>
                    setEditData({ ...editData, teacher: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={editData.room}
                  onChange={(e) =>
                    setEditData({ ...editData, room: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
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
    </div>
  );
}
