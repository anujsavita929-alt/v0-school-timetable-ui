"use client";

import { useState } from "react";
import { 
  School as SchoolIcon, 
  MapPin, 
  Info, 
  User, 
  BookOpen, 
  ChevronRight,
  Monitor,
  FlaskConical,
  Library,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock Room Data
const roomsData = Array.from({ length: 24 }, (_, i) => {
  const roomNum = 101 + i;
  const isOccupied = Math.random() > 0.3;
  const isLab = [105, 112, 118, 124].includes(roomNum);
  
  return {
    id: roomNum,
    name: isLab ? `Lab ${roomNum}` : `Room ${roomNum}`,
    type: isLab ? "lab" : "classroom",
    occupied: isOccupied,
    details: isOccupied ? {
      class: `${10 + (i % 3)}-${["A", "B", "C"][i % 3]}`,
      teacher: ["Mr. Sharma", "Ms. Verma", "Dr. Gupta", "Mrs. Singh"][i % 4],
      subject: ["Math", "Physics", "English", "Chemistry"][i % 4],
      startTime: "09:00 AM",
      endTime: "09:50 AM"
    } : null
  };
});

export default function ClassesAnalytics() {
  const occupiedCount = roomsData.filter(r => r.occupied).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Campus Status</h1>
          <p className="text-slate-500">Live monitoring of room occupancy and ongoing classes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm font-medium text-slate-600">Occupied ({occupiedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-full" />
            <span className="text-sm font-medium text-slate-600">Available ({roomsData.length - occupiedCount})</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Statistics and Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <SchoolIcon className="w-4 h-4 text-red-500" />
                Floor Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Building A</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-slate-900">12 Rooms</h3>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">85% Full</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Building B (Labs)</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-slate-900">8 Rooms</h3>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">20% Full</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Library / Hall</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-bold text-slate-900">4 Rooms</h3>
                  <Badge variant="outline" className="text-slate-500">Unused</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-900 text-white overflow-hidden group">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-red-200">Next Shift Starts In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black mb-1">08m 42s</div>
              <p className="text-xs text-slate-400">Preparation for Period 2 (10:00 AM)</p>
            </CardContent>
            <Clock className="absolute -bottom-2 -right-2 w-16 h-16 text-white/5 opacity-50 group-hover:scale-110 transition-transform" />
          </Card>
        </div>

        {/* Room Grid Area */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <TooltipProvider>
              {roomsData.map((room) => (
                <Tooltip key={room.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`p-4 rounded-2xl border transition-all cursor-pointer h-32 relative group shadow-sm flex flex-col justify-between ${
                        room.occupied 
                          ? 'bg-emerald-600 border-emerald-700 text-white animate-in zoom-in duration-300 shadow-emerald-200 shadow-lg' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-1.5 rounded-lg ${room.occupied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {room.type === 'lab' ? <FlaskConical className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                        </div>
                        <Badge variant="outline" className={`text-[10px] font-bold ${room.occupied ? 'bg-emerald-500/20 border-emerald-400 text-white border-none' : 'bg-slate-50'}`}>
                          {room.name}
                        </Badge>
                      </div>

                      {room.occupied ? (
                        <div className="space-y-0.5">
                          <p className={`text-lg font-black tracking-tight leading-none ${room.occupied ? 'text-white' : 'text-slate-900'}`}>
                            {room.details?.class}
                          </p>
                          <p className={`text-[10px] font-bold truncate ${room.occupied ? 'text-emerald-100' : 'text-emerald-700'}`}>
                            Subject: {room.details?.subject}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-slate-300 tracking-wider">AVAILABLE</p>
                      )}

                      {room.occupied && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                           <span className="text-[10px] font-bold text-emerald-600">LIVE</span>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 w-64 bg-slate-900 text-white border-none rounded-xl shadow-2xl">
                    {room.occupied ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                           <h4 className="font-bold text-red-300">{room.name}</h4>
                           <span className="text-xs text-white/50">{room.details?.startTime} - {room.details?.endTime}</span>
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <User className="w-4 h-4 text-emerald-400" />
                            {room.details?.teacher}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            {room.details?.subject}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            Building A, Floor 1
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-2">
                        <p className="font-bold">Room is empty</p>
                        <p className="text-xs text-white/50">Next scheduled use: Tomorrow 09:00 AM</p>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
