"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, Award } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Student Portal</h1>
          <p className="text-slate-500">View your current schedule and academic performance.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-red-600">Current Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">A-</div>
            <p className="text-xs text-slate-500 mt-1">Class Rank: 12/45</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-emerald-600">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">96%</div>
            <p className="text-xs text-slate-500 mt-1">2 days missed this term</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-red-600">Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">28/32</div>
            <p className="text-xs text-slate-500 mt-1">On track for graduation</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-900 text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-300" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {[
              { time: "08:00", sub: "Mathematics", teacher: "Mr. Sharma", room: "101" },
              { time: "09:00", sub: "Physics", teacher: "Ms. Verma", room: "105" },
              { time: "10:00", sub: "History", teacher: "Mr. Brown", room: "110" },
              { time: "10:50", sub: "Lunch Break", isBreak: true },
              { time: "11:35", sub: "Computer Science", teacher: "Ms. Lee", room: "Lab 1" },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 ${s.isBreak ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}>
                <span className="text-sm font-black text-slate-400 w-16">{s.time}</span>
                <div className="flex-1">
                  <p className={`font-bold ${s.isBreak ? 'text-orange-600' : 'text-slate-900'}`}>{s.sub}</p>
                  {!s.isBreak && <p className="text-xs text-slate-500">{s.teacher} • Room {s.room}</p>}
                </div>
                {s.isBreak ? <Coffee className="w-4 h-4 text-orange-400" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Coffee(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
