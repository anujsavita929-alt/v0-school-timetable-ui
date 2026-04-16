"use client";

import { useState, useEffect } from "react";
import { Download, RefreshCcw, Coffee, Edit3, User, ChevronRight, X, Save, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface TimetableSlot {
  id: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

interface EditingCell {
  id?: string;
  classNum: string;
  section: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

type TimetableData = Record<string, Record<string, TimetableSlot[]>>;

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

const periodStartTimes: Record<number, string> = {
  0: "08:00",
  1: "09:00",
  2: "10:00",
  3: "11:35",
  4: "12:35",
  5: "13:35",
  6: "14:35",
  7: "15:35",
};

export default function TimetableView() {
  const [timetable, setTimetable] = useState<TimetableData>({});
  const [editing, setEditing] = useState<EditingCell | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch("/api/timetable");
        const data = await response.json();
        if (!response.ok) {
          console.error("Failed to load timetable", data);
          setTimetable({});
        } else {
          setTimetable(data);
        }
      } catch (error) {
        console.error("Unable to fetch timetable:", error);
        setTimetable({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const getSubjectColor = (subject: string) => {
    if (subject === "Self Study") return "bg-slate-50 text-slate-400 border-slate-200";
    const colors = [
      "bg-red-50 text-red-700 border-red-200",
      "bg-rose-50 text-rose-700 border-rose-200",
      "bg-orange-50 text-orange-700 border-orange-200",
      "bg-emerald-50 text-emerald-700 border-emerald-200",
      "bg-sky-50 text-sky-700 border-sky-200",
      "bg-violet-50 text-violet-700 border-violet-200",
      "bg-amber-50 text-amber-700 border-amber-200",
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getSession = (classNum: string, section: string, day: string, periodIdx: number) => {
    return timetable?.[classNum]?.[section]?.find((s) => s.day === day && s.period === periodIdx);
  };

  const handleCellClick = (classNum: string, section: string, day: string, period: number, session: TimetableSlot | undefined) => {
    setEditing({
      id: session?.id,
      classNum,
      section,
      day,
      period,
      subject: session?.subject ?? "",
      teacher: session?.teacher ?? "",
      room: session?.room ?? "",
    });
  };

  const handleSave = async () => {
    if (!editing || !timetable) return;
    const { classNum, section, day, period, subject, teacher, room, id } = editing;
    const classId = `${classNum}-${section}`;
    const time = periodStartTimes[period];

    if (!time || subject.trim() === "" || teacher.trim() === "") {
      toast.error("Subject and teacher are required.");
      return;
    }

    try {
      const response = await fetch("/api/timetable", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId,
          day,
          time,
          subject,
          teacher,
          room,
          slotId: id,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to save timetable cell.");
      }

      const updated = { ...timetable };
      const sectionRows = [...(updated[classNum]?.[section] ?? [])];
      const existingIndex = sectionRows.findIndex((s) => s.day === day && s.period === period);
      const newSlot: TimetableSlot = {
        id: id ?? `${classId}-${day}-${period}`,
        day,
        period,
        subject,
        teacher,
        room,
      };

      if (existingIndex !== -1) {
        sectionRows[existingIndex] = newSlot;
      } else {
        sectionRows.push(newSlot);
      }

      updated[classNum] = updated[classNum] ?? {};
      updated[classNum][section] = sectionRows;
      setTimetable(updated);
      setEditing(null);
      toast.success("Cell updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes.");
    }
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

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
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
                <input
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  value={editing.subject}
                  onChange={(e) => setEditing({ ...editing, subject: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Teacher</Label>
                <input
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  value={editing.teacher}
                  onChange={(e) => setEditing({ ...editing, teacher: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Room</Label>
                <input
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  value={editing.room}
                  onChange={(e) => setEditing({ ...editing, room: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Loading timetable...
        </div>
      ) : Object.keys(timetable).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No generated timetable found. Please generate a timetable first.
        </div>
      ) : (
        <div className="space-y-12">
          {Object.keys(timetable).map((classNum) =>
            Object.keys(timetable[classNum]).map((section) => (
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
                          {days.map((day) => (
                            <th key={day} className="p-4 border-r border-slate-200 font-black text-slate-900 uppercase tracking-tight">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {periods.map((p, pIdx) => (
                          <tr key={String(p.id)} className={`border-b border-slate-100 ${p.isLunch ? 'bg-orange-50/50' : ''}`}>
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
                              days.map((day) => {
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
                                          <p className="text-[10px] font-bold uppercase tracking-tight truncate">{session.teacher}</p>
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
          )}
        </div>
      )}
    </div>
  );
}
