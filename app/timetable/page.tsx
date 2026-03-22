"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  RefreshCcw, 
  Coffee,
  Edit3,
  User,
  ChevronRight,
  X,
  Save,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface Session {
  subject: string;
  teacher: string;
  room: string;
  day: string;
  period: number;
}

interface EditingCell {
  classNum: string;
  section: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

export default function TimetableView() {
  const [timetable, setTimetable] = useState<any>(null);
  const [editing, setEditing] = useState<EditingCell | null>(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { id: 0, time: "08:00 - 08:50" },
    { id: 1, time: "09:00 - 09:50" },
    { id: 2, time: "10:00 - 10:50" },
    { id: "lunch", time: "10:50 - 11:35", isLunch: true },
    { id: 3, time: "11:35 - 12:25" },
    { id: 4, time: "12:35 - 13:25" },
    { id: 5, time: "13:35 - 14:25" },
    { id: 6, time: "14:35 - 15:25" },
    { id: 7, time: "15:35 - 16:25" },
  ];

  const subjectOptions = ["Mathematics", "Physics", "Chemistry", "English", "History", "Computer Science", "Physical Education", "Art", "Music", "Self Study", "Biology", "Geography"];
  const teacherOptions = ["Mr. Sharma", "Ms. Verma", "Dr. Gupta", "Mrs. Singh", "Mr. Ross", "Ms. Lee", "Mr. Wilson", "Mrs. Garcia", "N/A"];
  const roomOptions = ["Room 101", "Room 102", "Room 103", "Lab 105", "Lab 201", "Lab 1", "Gym", "Studio", "Library", "Main Hall"];

  useEffect(() => {
    const mockGenerated = {
      "10": {
        "A": [
          { day: "Monday", period: 0, subject: "Mathematics", teacher: "Mr. Sharma", room: "Room 101" },
          { day: "Monday", period: 1, subject: "Physics", teacher: "Ms. Verma", room: "Lab 105" },
          { day: "Monday", period: 2, subject: "Self Study", teacher: "N/A", room: "Library" },
          { day: "Monday", period: 3, subject: "History", teacher: "Mr. Ross", room: "Room 101" },
          { day: "Monday", period: 4, subject: "English", teacher: "Dr. Gupta", room: "Room 102" },
          { day: "Tuesday", period: 0, subject: "English", teacher: "Dr. Gupta", room: "Room 101" },
          { day: "Tuesday", period: 1, subject: "Chemistry", teacher: "Mrs. Singh", room: "Lab 201" },
          { day: "Tuesday", period: 2, subject: "Mathematics", teacher: "Mr. Sharma", room: "Room 101" },
          { day: "Tuesday", period: 3, subject: "Computer Science", teacher: "Ms. Lee", room: "Lab 1" },
          { day: "Wednesday", period: 0, subject: "Computer Science", teacher: "Ms. Lee", room: "Lab 1" },
          { day: "Wednesday", period: 1, subject: "Mathematics", teacher: "Mr. Sharma", room: "Room 101" },
          { day: "Wednesday", period: 2, subject: "Physics", teacher: "Ms. Verma", room: "Lab 105" },
          { day: "Wednesday", period: 3, subject: "English", teacher: "Dr. Gupta", room: "Room 101" },
          { day: "Thursday", period: 0, subject: "Physical Education", teacher: "Mr. Wilson", room: "Gym" },
          { day: "Thursday", period: 1, subject: "History", teacher: "Mr. Ross", room: "Room 103" },
          { day: "Thursday", period: 2, subject: "Chemistry", teacher: "Mrs. Singh", room: "Lab 201" },
          { day: "Thursday", period: 3, subject: "Self Study", teacher: "N/A", room: "Library" },
          { day: "Friday", period: 0, subject: "Art", teacher: "Mrs. Garcia", room: "Studio" },
          { day: "Friday", period: 1, subject: "Mathematics", teacher: "Mr. Sharma", room: "Room 101" },
          { day: "Friday", period: 2, subject: "English", teacher: "Dr. Gupta", room: "Room 101" },
          { day: "Friday", period: 3, subject: "Physics", teacher: "Ms. Verma", room: "Lab 105" },
        ]
      }
    };
    setTimetable(mockGenerated);
  }, []);

  const getSubjectColor = (subject: string) => {
    if (subject === 'Self Study') return 'bg-slate-50 text-slate-400 border-slate-200';
    const colors = [
      'bg-red-50 text-red-700 border-red-200',
      'bg-rose-50 text-rose-700 border-rose-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-sky-50 text-sky-700 border-sky-200',
      'bg-violet-50 text-violet-700 border-violet-200',
      'bg-amber-50 text-amber-700 border-amber-200',
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getSession = (classNum: string, section: string, day: string, periodIdx: number) => {
    return timetable?.[classNum]?.[section]?.find((s: any) => s.day === day && s.period === periodIdx);
  };

  const handleCellClick = (classNum: string, section: string, day: string, period: number, session: any) => {
    setEditing({
      classNum, section, day, period,
      subject: session?.subject || "",
      teacher: session?.teacher || "",
      room: session?.room || "",
    });
  };

  const handleSave = () => {
    if (!editing || !timetable) return;
    const { classNum, section, day, period, subject, teacher, room } = editing;
    
    const updated = { ...timetable };
    const sessions = [...(updated[classNum]?.[section] || [])];
    const idx = sessions.findIndex((s: any) => s.day === day && s.period === period);
    
    if (subject.trim() === "") {
      // Remove the session if subject is cleared
      if (idx !== -1) sessions.splice(idx, 1);
    } else if (idx !== -1) {
      sessions[idx] = { ...sessions[idx], subject, teacher, room };
    } else {
      sessions.push({ day, period, subject, teacher, room });
    }
    
    if (!updated[classNum]) updated[classNum] = {};
    updated[classNum][section] = sessions;
    setTimetable({ ...updated });
    setEditing(null);
    toast.success("Cell updated successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Link href="/dashboard/principal" className="hover:text-slate-900 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900">Edit Timetable</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Edit Timetable</h1>
          <p className="text-slate-500 font-medium">Click any cell to edit. Empty cells can be filled with new subjects.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast.info("Refreshing schedule...")}>
            <RefreshCcw className="w-4 h-4" />
            Regenerate
          </Button>
          <Button className="bg-slate-900 gap-2" onClick={handlePrint}>
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Cell</h3>
                <p className="text-xs text-slate-500 font-medium">{editing.day} • Period {editing.period + 1}</p>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Subject</Label>
                <select 
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  value={editing.subject}
                  onChange={e => setEditing({...editing, subject: e.target.value})}
                >
                  <option value="">-- Clear / Remove --</option>
                  {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Teacher</Label>
                <select 
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  value={editing.teacher}
                  onChange={e => setEditing({...editing, teacher: e.target.value})}
                >
                  <option value="">Select Teacher</option>
                  {teacherOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Room</Label>
                <select 
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  value={editing.room}
                  onChange={e => setEditing({...editing, room: e.target.value})}
                >
                  <option value="">Select Room</option>
                  {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {timetable && Object.keys(timetable).map(classNum => (
          Object.keys(timetable[classNum]).map(section => (
            <Card key={`${classNum}-${section}`} className="border-slate-200 shadow-xl overflow-hidden break-after-page">
              <CardHeader className="bg-slate-900 text-white p-6 border-b-4 border-red-500">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black tracking-tight">CLASS {classNum}-{section}</CardTitle>
                    <CardDescription className="text-red-200 font-bold uppercase tracking-widest text-[10px]">
                      Academic Session 2025-26 • Click any cell to edit
                    </CardDescription>
                  </div>
                  <div className="text-right hidden sm:block">
                    <Badge className="bg-white/10 text-white border-white/20 gap-1">
                      <Pencil className="w-3 h-3" />
                      Editable Mode
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 border-r border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest w-32">Period / Time</th>
                        {days.map(day => (
                          <th key={day} className="p-4 border-r border-slate-200 font-black text-slate-900 uppercase tracking-tight">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((p, pIdx) => (
                        <tr key={p.id} className={`border-b border-slate-100 ${p.isLunch ? 'bg-orange-50/50' : ''}`}>
                          <td className="p-4 border-r border-slate-200 bg-slate-50/30">
                            <div className="flex flex-col items-center justify-center text-center">
                              {p.isLunch ? (
                                <Coffee className="w-4 h-4 text-orange-400 mb-1" />
                              ) : (
                                <span className="text-xs font-black text-slate-400 mb-1">P{pIdx > 3 ? pIdx : pIdx + 1}</span>
                              )}
                              <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{p.time}</span>
                            </div>
                          </td>
                          
                          {p.isLunch ? (
                            <td colSpan={5} className="p-4 text-center">
                              <div className="flex items-center justify-center gap-3 text-red-600/60 font-black uppercase tracking-[0.4em] text-[10px] py-1 bg-red-50/30 rounded-full mx-4 border border-red-100/50">
                                <Coffee className="w-3.5 h-3.5" />
                                LUNCH BREAK (45 MINS)
                                <Coffee className="w-3.5 h-3.5" />
                              </div>
                            </td>
                          ) : (
                            days.map(day => {
                              const periodId = typeof p.id === 'number' ? p.id : -1;
                              const session = getSession(classNum, section, day, periodId);
                              return (
                                <td 
                                  key={`${day}-${p.id}`} 
                                  className="p-2 border-r border-slate-100 group min-w-[160px] cursor-pointer"
                                  onClick={() => handleCellClick(classNum, section, day, periodId, session)}
                                >
                                  {session ? (
                                    <div className={`p-3 rounded-xl border shadow-sm transition-all hover:shadow-md hover:scale-[1.02] relative group/card ${getSubjectColor(session.subject)}`}>
                                      <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-wider opacity-70">{session.room}</span>
                                        <Edit3 className="w-3 h-3 opacity-0 group-hover/card:opacity-100 cursor-pointer transition-opacity" />
                                      </div>
                                      <h4 className="text-sm font-black leading-tight mb-1 truncate">{session.subject}</h4>
                                      <div className="flex items-center gap-1 opacity-70">
                                        <User className="w-3 h-3" />
                                        <p className="text-[10px] font-bold uppercase tracking-tight truncate">
                                          {session.teacher}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="h-full flex flex-col items-center justify-center min-h-[90px] bg-slate-50/20 rounded-xl border-2 border-dashed border-slate-200/60 text-slate-300 transition-all hover:bg-red-50/30 hover:border-red-300 hover:text-red-400">
                                      <Pencil className="w-4 h-4 mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Click to Add</span>
                                    </div>
                                  )}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        ))}
      </div>

      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .break-after-page {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}
