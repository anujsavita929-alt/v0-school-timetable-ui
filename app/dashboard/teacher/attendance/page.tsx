"use client";

import { useState, useEffect } from "react";
import { CheckSquare, X, Save, Check, UserX, ArrowLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

const classStudents = [
  { id: "1", name: "Arjun Sharma", rollNo: 1 },
  { id: "2", name: "Sneha Verma", rollNo: 2 },
  { id: "3", name: "Rahul Gupta", rollNo: 3 },
  { id: "4", name: "Priya Singh", rollNo: 4 },
  { id: "5", name: "Aditya Kumar", rollNo: 5 },
  { id: "6", name: "Ananya Patel", rollNo: 6 },
  { id: "7", name: "Rohan Mehta", rollNo: 7 },
  { id: "8", name: "Kavya Nair", rollNo: 8 },
  { id: "9", name: "Vikram Rao", rollNo: 9 },
  { id: "10", name: "Isha Joshi", rollNo: 10 },
  { id: "11", name: "Deepak Reddy", rollNo: 11 },
  { id: "12", name: "Meera Iyer", rollNo: 12 },
  { id: "13", name: "Siddharth Das", rollNo: 13 },
  { id: "14", name: "Pooja Chauhan", rollNo: 14 },
  { id: "15", name: "Nikhil Saxena", rollNo: 15 },
  { id: "16", name: "Divya Kapoor", rollNo: 16 },
  { id: "17", name: "Harsh Pandey", rollNo: 17 },
  { id: "18", name: "Simran Kaur", rollNo: 18 },
  { id: "19", name: "Manish Tiwari", rollNo: 19 },
  { id: "20", name: "Ritu Agarwal", rollNo: 20 },
  { id: "21", name: "Karan Malhotra", rollNo: 21 },
  { id: "22", name: "Neha Mishra", rollNo: 22 },
  { id: "23", name: "Amit Sinha", rollNo: 23 },
  { id: "24", name: "Pallavi Desai", rollNo: 24 },
  { id: "25", name: "Tanvi Bhatt", rollNo: 25 },
  { id: "26", name: "Yash Goyal", rollNo: 26 },
  { id: "27", name: "Shruti Menon", rollNo: 27 },
  { id: "28", name: "Dev Chopra", rollNo: 28 },
  { id: "29", name: "Nisha Pillai", rollNo: 29 },
  { id: "30", name: "Varun Bhat", rollNo: 30 },
];

export default function AttendancePage() {
  const [assignedClass, setAssignedClass] = useState("10-A");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    // Load assigned class from localStorage (set by Principal)
    const assigned = localStorage.getItem("teacher_assigned_class");
    if (assigned) setAssignedClass(assigned);

    // Default all present
    const initial: Record<string, boolean> = {};
    classStudents.forEach(s => { initial[s.id] = true; });
    
    // Load saved attendance for today
    const savedData = localStorage.getItem(`attendance_${new Date().toISOString().split("T")[0]}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAttendance(parsed);
      setSaved(true);
    } else {
      setAttendance(initial);
    }
  }, []);

  const toggleStudent = (id: string) => {
    setSaved(false);
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markAllPresent = () => {
    setSaved(false);
    const updated: Record<string, boolean> = {};
    classStudents.forEach(s => { updated[s.id] = true; });
    setAttendance(updated);
  };

  const markAllAbsent = () => {
    setSaved(false);
    const updated: Record<string, boolean> = {};
    classStudents.forEach(s => { updated[s.id] = false; });
    setAttendance(updated);
  };

  const saveAttendance = () => {
    const dateKey = new Date().toISOString().split("T")[0];
    localStorage.setItem(`attendance_${dateKey}`, JSON.stringify(attendance));
    setSaved(true);
    toast.success(`Attendance saved for Class ${assignedClass}! ${presentCount}/${classStudents.length} present.`);
  };

  const filteredStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toString().includes(search)
  );

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = Object.values(attendance).filter(v => !v).length;
  const percentage = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/teacher">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Mark Attendance</h1>
            <p className="text-sm text-slate-500">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-bold">✓ Saved</Badge>}
          <Button className="bg-red-600 hover:bg-red-700 gap-2 font-bold h-12 px-6" onClick={saveAttendance}>
            <Save className="w-4 h-4" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Class Info Banner */}
      <Card className="border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-1">Class Teacher • Assigned by Principal</p>
              <h2 className="text-4xl font-black">Class {assignedClass}</h2>
              <p className="text-slate-400 text-sm mt-1">Total {classStudents.length} students enrolled</p>
            </div>
            <div className="flex gap-6 text-center">
              <div className="bg-white/10 rounded-2xl p-4 min-w-[100px]">
                <div className="text-3xl font-black text-emerald-400">{presentCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Present</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 min-w-[100px]">
                <div className="text-3xl font-black text-red-400">{absentCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Absent</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 min-w-[100px]">
                <div className="text-3xl font-black text-amber-400">{percentage}%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name or roll number..." 
            className="pl-10 h-11"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold" onClick={markAllPresent}>
            <Check className="w-4 h-4" />
            Mark All Present
          </Button>
          <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50 font-bold" onClick={markAllAbsent}>
            <UserX className="w-4 h-4" />
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            onClick={() => toggleStudent(student.id)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
              attendance[student.id]
                ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:shadow-md hover:shadow-emerald-100"
                : "border-red-200 bg-red-50/50 hover:bg-red-50 hover:shadow-md hover:shadow-red-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                attendance[student.id] ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                {student.rollNo}
              </div>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] font-black px-3 ${
                attendance[student.id]
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}>
                {attendance[student.id] ? "PRESENT" : "ABSENT"}
              </Badge>
              {attendance[student.id] ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <UserX className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Save Bar */}
      <div className="sticky bottom-0 bg-white border-t p-4 -mx-6 px-6 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex gap-6 text-sm">
          <span className="font-bold text-slate-900">Total: {classStudents.length}</span>
          <span className="font-bold text-emerald-600">Present: {presentCount}</span>
          <span className="font-bold text-red-600">Absent: {absentCount}</span>
          <span className="font-bold text-amber-600">Rate: {percentage}%</span>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 gap-2 font-bold h-11 px-8" onClick={saveAttendance}>
          <Save className="w-4 h-4" />
          Save Attendance ({presentCount}/{classStudents.length})
        </Button>
      </div>
    </div>
  );
}
