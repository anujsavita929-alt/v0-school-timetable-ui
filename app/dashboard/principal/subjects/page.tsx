'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, ArrowLeft, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  shortName: string;
  weeklyHours: number;
  priority: number;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Subject>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditForm(subject);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      const response = await fetch('/api/subjects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        setSubjects(subjects.map(s => s.id === editingId ? { ...s, ...editForm } : s));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Failed to update subject:', error);
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: number) => {
    if (priority >= 4) return <Badge className="bg-red-500">High Priority</Badge>;
    if (priority >= 3) return <Badge className="bg-orange-500">Medium</Badge>;
    return <Badge variant="secondary">Standard</Badge>;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/principal">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Subjects</h1>
          <p className="text-slate-500">Configure subject priorities and weekly hour limits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><BookOpen className="w-6 h-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Subjects</p>
              <h3 className="text-2xl font-bold">{subjects.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><BookOpen className="w-6 h-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Core Subjects</p>
              <h3 className="text-2xl font-bold">{subjects.filter(s => s.priority >= 4).length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle>Subject Configuration</CardTitle>
            <CardDescription>Adjust priorities to influence the timetable generator</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search subjects..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Subject Name</TableHead>
                <TableHead>Short Name</TableHead>
                <TableHead className="text-center">Priority (1-5)</TableHead>
                <TableHead className="text-center">Weekly Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading subjects...</TableCell></TableRow>
              ) : filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-bold text-slate-800">{subject.name}</TableCell>
                  <TableCell className="text-slate-500">{subject.shortName}</TableCell>
                  <TableCell className="text-center">
                    {editingId === subject.id ? (
                      <Input 
                        type="number" 
                        min="1" 
                        max="5"
                        className="w-20 mx-auto text-center"
                        value={editForm.priority}
                        onChange={(e) => setEditForm({...editForm, priority: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold text-lg">{subject.priority}</span>
                        {getPriorityBadge(subject.priority)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingId === subject.id ? (
                      <Input 
                        type="number" 
                        min="1" 
                        className="w-20 mx-auto text-center"
                        value={editForm.weeklyHours}
                        onChange={(e) => setEditForm({...editForm, weeklyHours: parseInt(e.target.value)})}
                      />
                    ) : (
                      <span className="font-medium text-slate-600">{subject.weeklyHours} hrs</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === subject.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(subject)}>
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
