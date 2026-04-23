"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, CheckSquare, Clock, Coffee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { School as SchoolIcon } from "lucide-react";

export default function TeacherDashboard() {
  const [assignedClass, setAssignedClass] = useState("10-A");
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    const assigned = localStorage.getItem("teacher_assigned_class");
    if (assigned) setAssignedClass(assigned);

    const dateKey = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(`attendance_${dateKey}`);
    if (saved) setAttendanceMarked(true);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-gray-100">Teacher Portal</h1>
          <p className="text-slate-500 dark:text-gray-400">Welcome back. Here is your teaching schedule and class overview.</p>
        </div>
        <Button className="bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 gap-2 h-12 px-6" asChild>
          <Link href="/dashboard/teacher/attendance">
            <CheckSquare className="w-4 h-4" />
            Mark Attendance
          </Link>
        </Button>
      </div>

      {/* Class Teacher Banner */}
      <Card className="border-none bg-gradient-to-r from-slate-900 to-slate-800 dark:from-[#111111] dark:to-[#1a1a1a] dark:border dark:border-[#222] text-white shadow-xl">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <SchoolIcon className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest">Class Teacher • Assigned by Principal</p>
              <h2 className="text-2xl font-black">Class {assignedClass}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {attendanceMarked ? (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold">✓ Today's Attendance Marked</Badge>
            ) : (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold">⏳ Attendance Pending</Badge>
            )}
            <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-2" asChild>
              <Link href="/dashboard/teacher/attendance">
                <CheckSquare className="w-4 h-4" />
                {attendanceMarked ? "View Attendance" : "Mark Now"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-[#222] dark:bg-[#111111]">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Classes Today</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-black dark:text-gray-100">4</div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">2 remaining in session</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-[#222] dark:bg-[#111111]">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-orange-600 dark:text-orange-400">Total Students</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-black dark:text-gray-100">120</div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Across 3 sections</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-[#222] dark:bg-[#111111]">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Task Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-black dark:text-gray-100">85%</div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Grades up to date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 dark:border-[#222] dark:bg-[#111111] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Calendar className="w-5 h-5 text-slate-400 dark:text-gray-500" />
              My Teaching Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-[#222]">
              {[
                { time: "08:00", cls: "10-A", sub: "Mathematics", room: "101" },
                { time: "11:35", cls: "12-C", sub: "Calculus", room: "205" },
                { time: "13:35", cls: "11-B", sub: "Algebra", room: "101" },
                { time: "15:35", cls: "10-B", sub: "Mathematics", room: "101" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-[#1a1a1a]">
                  <span className="text-sm font-black text-slate-400 dark:text-gray-500 w-16">{s.time}</span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-gray-100">{s.sub} • {s.cls}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-500">Room {s.room}</p>
                  </div>
                  <Badge variant="outline" className="dark:border-[#333] dark:text-gray-300">On Track</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-[#222] dark:bg-[#111111] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl dark:text-gray-100">
              <Users className="w-5 h-5 text-slate-400 dark:text-gray-500" />
              Recent Student Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Arjun Sharma", task: "Calculus Homework", time: "2h ago" },
              { name: "Sneha Verma", task: "Matrix Quiz", time: "4h ago" },
              { name: "Rahul Gupta", task: "Statistics Lab", time: "Yesterday" },
            ].map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#222] hover:border-slate-300 dark:hover:border-[#333] transition-colors cursor-pointer group">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{sub.name}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-500">{sub.task}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-tighter">{sub.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
