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
import { useState } from 'react';

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedWeek, setSelectedWeek] = useState('current');

  const timetableData = [
    // Monday
    { id: '1', day: 'Monday', time: '08:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: 'red' },
    { id: '2', day: 'Monday', time: '09:00 AM', subject: 'English', teacher: 'Ms. Johnson', room: '102', color: 'green' },
    { id: '3', day: 'Monday', time: '10:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103', color: 'orange' },
    { id: '4', day: 'Monday', time: '11:00 AM', subject: 'History', teacher: 'Mr. Davis', room: '104', color: 'pink' },
    { id: '5', day: 'Monday', time: '12:00 PM', subject: 'Physical Education', teacher: 'Mr. Wilson', room: 'Gym', color: 'red' },

    // Tuesday
    { id: '6', day: 'Tuesday', time: '08:00 AM', subject: 'English', teacher: 'Ms. Johnson', room: '102', color: 'green' },
    { id: '7', day: 'Tuesday', time: '09:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103', color: 'orange' },
    { id: '8', day: 'Tuesday', time: '10:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: 'red' },
    { id: '9', day: 'Tuesday', time: '11:00 AM', subject: 'Computer Science', teacher: 'Ms. Lee', room: '105', color: 'pink' },
    { id: '10', day: 'Tuesday', time: '12:00 PM', subject: 'Art', teacher: 'Mrs. Garcia', room: '106', color: 'green' },

    // Wednesday
    { id: '11', day: 'Wednesday', time: '08:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103', color: 'orange' },
    { id: '12', day: 'Wednesday', time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: 'red' },
    { id: '13', day: 'Wednesday', time: '10:00 AM', subject: 'History', teacher: 'Mr. Davis', room: '104', color: 'pink' },
    { id: '14', day: 'Wednesday', time: '11:00 AM', subject: 'Physical Education', teacher: 'Mr. Wilson', room: 'Gym', color: 'red' },
    { id: '15', day: 'Wednesday', time: '12:00 PM', subject: 'Music', teacher: 'Ms. Martinez', room: '107', color: 'green' },

    // Thursday
    { id: '16', day: 'Thursday', time: '08:00 AM', subject: 'Computer Science', teacher: 'Ms. Lee', room: '105', color: 'pink' },
    { id: '17', day: 'Thursday', time: '09:00 AM', subject: 'English', teacher: 'Ms. Johnson', room: '102', color: 'green' },
    { id: '18', day: 'Thursday', time: '10:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101', color: 'red' },
    { id: '19', day: 'Thursday', time: '11:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103', color: 'orange' },
    { id: '20', day: 'Thursday', time: '12:00 PM', subject: 'History', teacher: 'Mr. Davis', room: '104', color: 'pink' },

    // Friday
    { id: '21', day: 'Friday', time: '08:00 AM', subject: 'Art', teacher: 'Mrs. Garcia', room: '106', color: 'green' },
    { id: '22', day: 'Friday', time: '09:00 AM', subject: 'Music', teacher: 'Ms. Martinez', room: '107', color: 'green' },
    { id: '23', day: 'Friday', time: '10:00 AM', subject: 'Physical Education', teacher: 'Mr. Wilson', room: 'Gym', color: 'red' },
    { id: '24', day: 'Friday', time: '11:00 AM', subject: 'Computer Science', teacher: 'Ms. Lee', room: '105', color: 'pink' },
    { id: '25', day: 'Friday', time: '12:00 PM', subject: 'Assembly', teacher: 'Principal', room: 'Main Hall', color: 'orange' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">View and manage class schedules</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-sm md:text-base">
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button variant="outline" className="gap-2 text-sm md:text-base">
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
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
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
            <Button className="w-full bg-[#E74C3C] hover:bg-red-700 text-white">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Timetable Grid */}
      <Card className="p-6 border border-gray-200 overflow-hidden">
        <TimetableGrid slots={timetableData} />
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
    </div>
  );
}
