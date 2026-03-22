"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Star, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Phone,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Eye,
  X,
  Send,
  Clock,
  CheckCircle2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const teachersData = [
  { id: "TCH-001", name: "Sarah Williams", subject: "Mathematics", class: "10-A", attendance: 98, rating: 4.8, status: "Active", email: "sarah.w@school.com",
    schedule: [
      { day: "Monday", periods: ["P1: 10-A Math", "P3: 12-B Math"] },
      { day: "Tuesday", periods: ["P2: 10-A Math", "P4: 11-C Math"] },
      { day: "Wednesday", periods: ["P1: 10-A Math", "P5: 12-A Math"] },
      { day: "Thursday", periods: ["P3: 11-A Math", "P6: 10-B Math"] },
      { day: "Friday", periods: ["P1: 10-A Math", "P2: 12-C Math"] },
    ]},
  { id: "TCH-002", name: "David Miller", subject: "Physics", class: "12-B", attendance: 95, rating: 4.5, status: "Active", email: "david.m@school.com",
    schedule: [
      { day: "Monday", periods: ["P2: 12-B Physics", "P4: 11-A Physics"] },
      { day: "Tuesday", periods: ["P1: 12-A Physics", "P3: 12-B Physics"] },
      { day: "Wednesday", periods: ["P2: 11-B Physics Lab", "P3: 11-B Physics Lab"] },
      { day: "Thursday", periods: ["P1: 12-B Physics", "P5: 10-C Physics"] },
      { day: "Friday", periods: ["P4: 12-B Physics"] },
    ]},
  { id: "TCH-003", name: "Emily Chen", subject: "English", class: "11-A", attendance: 92, rating: 4.9, status: "On Leave", email: "emily.c@school.com",
    schedule: [
      { day: "Monday", periods: ["P1: 11-A English", "P3: 10-B English"] },
      { day: "Tuesday", periods: ["P2: 11-A English"] },
      { day: "Wednesday", periods: ["P4: 12-A English", "P5: 11-A English"] },
      { day: "Thursday", periods: ["P1: 10-A English", "P3: 11-C English"] },
      { day: "Friday", periods: ["P2: 11-A English", "P6: 12-B English"] },
    ]},
  { id: "TCH-004", name: "Michael Ross", subject: "Chemistry", class: "10-C", attendance: 88, rating: 4.2, status: "Active", email: "michael.r@school.com",
    schedule: [
      { day: "Monday", periods: ["P2: 10-C Chemistry Lab", "P3: 10-C Chemistry Lab"] },
      { day: "Tuesday", periods: ["P4: 12-A Chemistry"] },
      { day: "Wednesday", periods: ["P1: 10-C Chemistry", "P5: 11-B Chemistry"] },
      { day: "Thursday", periods: ["P2: 12-C Chemistry Lab", "P3: 12-C Chemistry Lab"] },
      { day: "Friday", periods: ["P1: 10-C Chemistry"] },
    ]},
  { id: "TCH-005", name: "Jessica Alba", subject: "Biology", class: "12-A", attendance: 97, rating: 4.7, status: "Active", email: "jessica.a@school.com",
    schedule: [
      { day: "Monday", periods: ["P1: 12-A Biology"] },
      { day: "Tuesday", periods: ["P2: 12-A Biology Lab", "P3: 12-A Biology Lab"] },
      { day: "Wednesday", periods: ["P4: 11-A Biology"] },
      { day: "Thursday", periods: ["P1: 12-A Biology", "P5: 11-C Biology"] },
      { day: "Friday", periods: ["P3: 12-A Biology"] },
    ]},
  { id: "TCH-006", name: "Robert Brown", subject: "History", class: "11-B", attendance: 94, rating: 4.4, status: "Active", email: "robert.b@school.com",
    schedule: [
      { day: "Monday", periods: ["P4: 11-B History"] },
      { day: "Tuesday", periods: ["P1: 10-A History", "P5: 11-B History"] },
      { day: "Wednesday", periods: ["P3: 12-C History"] },
      { day: "Thursday", periods: ["P2: 11-B History", "P6: 10-B History"] },
      { day: "Friday", periods: ["P4: 11-B History"] },
    ]},
  { id: "TCH-007", name: "Sophia Lee", subject: "Computer Science", class: "12-C", attendance: 99, rating: 5.0, status: "Active", email: "sophia.l@school.com",
    schedule: [
      { day: "Monday", periods: ["P5: 12-C CS Lab", "P6: 12-C CS Lab"] },
      { day: "Tuesday", periods: ["P1: 12-C CS", "P4: 11-A CS"] },
      { day: "Wednesday", periods: ["P2: 10-A CS Lab", "P3: 10-A CS Lab"] },
      { day: "Thursday", periods: ["P4: 12-C CS"] },
      { day: "Friday", periods: ["P5: 11-B CS Lab", "P6: 11-B CS Lab"] },
    ]},
  { id: "TCH-008", name: "William Clark", subject: "Physical Education", class: "All", attendance: 100, rating: 4.6, status: "Active", email: "william.c@school.com",
    schedule: [
      { day: "Monday", periods: ["P6: 10-A PE"] },
      { day: "Tuesday", periods: ["P6: 11-B PE"] },
      { day: "Wednesday", periods: ["P6: 12-A PE"] },
      { day: "Thursday", periods: ["P6: 10-C PE"] },
      { day: "Friday", periods: ["P6: 12-B PE"] },
    ]},
];

export default function TeachersAnalytics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachersData[0] | null>(null);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState("");
  const [announceTarget, setAnnounceTarget] = useState<"all" | "specific">("all");
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [sentAnnouncements, setSentAnnouncements] = useState<{message: string; to: string; time: string}[]>([]);

  const filteredTeachers = teachersData.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openSchedule = (teacher?: typeof teachersData[0]) => {
    setSelectedTeacher(teacher || null);
    setShowSchedule(true);
  };

  const toggleTeacherSelect = (id: string) => {
    setSelectedTeacherIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const sendAnnouncement = () => {
    if (!announceMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    const targetNames = announceTarget === "all" 
      ? "All Teachers" 
      : teachersData.filter(t => selectedTeacherIds.includes(t.id)).map(t => t.name).join(", ");
    
    setSentAnnouncements(prev => [
      { message: announceMessage, to: targetNames, time: "Just now" },
      ...prev
    ]);
    toast.success(`Announcement sent to ${announceTarget === "all" ? "all teachers" : selectedTeacherIds.length + " teacher(s)"}!`);
    setAnnounceMessage("");
    setShowAnnounce(false);
    setSelectedTeacherIds([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty Management</h1>
          <p className="text-slate-500">Overview of {teachersData.length} verified staff members and their performance.</p>
        </div>
        <Button className="bg-slate-900 gap-2">
          <Plus className="w-4 h-4" />
          Add New Teacher
        </Button>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSchedule(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedTeacher ? `${selectedTeacher.name}'s Schedule` : "All Teachers Schedule"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedTeacher ? `${selectedTeacher.subject} • Class Teacher: ${selectedTeacher.class}` : "Class assignments for all faculty"}
                </p>
              </div>
              <button onClick={() => setShowSchedule(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedTeacher ? (
                /* Single Teacher Schedule */
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 text-white">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-lg font-black text-red-300">
                      {selectedTeacher.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-black text-lg">{selectedTeacher.name}</p>
                      <p className="text-sm text-slate-400">Class Teacher: {selectedTeacher.class} • {selectedTeacher.subject}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {selectedTeacher.schedule.map((day, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50">
                        <div className="w-24 shrink-0">
                          <span className="font-black text-sm text-slate-900">{day.day}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {day.periods.map((p, j) => (
                            <Badge key={j} className="bg-red-50 text-red-700 border-red-200 font-medium">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* All Teachers Overview */
                <div className="space-y-3">
                  {teachersData.map(teacher => (
                    <div 
                      key={teacher.id} 
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all hover:shadow-sm"
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-600">
                        {teacher.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.subject}</p>
                      </div>
                      <div>
                        <Badge className="bg-slate-900 text-white font-bold">Class {teacher.class}</Badge>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {teacher.schedule.reduce((acc, d) => acc + d.periods.length, 0)} periods/week
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTeacher && (
              <div className="p-4 border-t shrink-0">
                <Button variant="outline" className="w-full" onClick={() => setSelectedTeacher(null)}>← Back to All Teachers</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnounce && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAnnounce(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-slate-900">Send Announcement</h2>
                <p className="text-xs text-slate-500 mt-1">Communicate with teachers directly</p>
              </div>
              <button onClick={() => setShowAnnounce(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Target Selection */}
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Send To</Label>
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => { setAnnounceTarget("all"); setSelectedTeacherIds([]); }}
                    className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      announceTarget === "all" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📢 All Teachers
                  </button>
                  <button 
                    onClick={() => setAnnounceTarget("specific")}
                    className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      announceTarget === "specific" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    👤 Specific Teachers
                  </button>
                </div>
              </div>

              {/* Specific Teachers Selection */}
              {announceTarget === "specific" && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Select Teachers ({selectedTeacherIds.length} selected)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {teachersData.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => toggleTeacherSelect(t.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-all ${
                          selectedTeacherIds.includes(t.id) 
                            ? "border-red-300 bg-red-50 text-red-700" 
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {selectedTeacherIds.includes(t.id) && <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />}
                        <span className="font-medium truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Message</Label>
                <textarea 
                  className="w-full mt-2 border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none min-h-[120px]"
                  placeholder="Type your announcement here..."
                  value={announceMessage}
                  onChange={e => setAnnounceMessage(e.target.value)}
                />
              </div>

              {/* Previous Announcements */}
              {sentAnnouncements.length > 0 && (
                <div>
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Recent Announcements</Label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {sentAnnouncements.map((a, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{a.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">To: {a.to} • {a.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex gap-3 shrink-0">
              <Button variant="outline" className="flex-1" onClick={() => setShowAnnounce(false)}>Cancel</Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 gap-2 font-bold" 
                onClick={sendAnnouncement}
                disabled={announceTarget === "specific" && selectedTeacherIds.length === 0}
              >
                <Send className="w-4 h-4" />
                Send Announcement
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Average Attendance</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />+0.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Faculty Rating</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              4.65
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s<=4?"fill-orange-400 text-orange-400":"text-slate-200"}`} />)}</div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Based on 1,240 student reviews</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Subjects</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-slate-500 mt-1">Spanning all grades 10-12</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search teachers or subjects..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => openSchedule()}>
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAnnounce(true)}>
                <MessageSquare className="w-4 h-4" />
                Announce
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[250px] font-bold">Teacher</TableHead>
                  <TableHead className="font-bold">Subject</TableHead>
                  <TableHead className="font-bold">Primary Class</TableHead>
                  <TableHead className="font-bold">Attendance</TableHead>
                  <TableHead className="font-bold">Student Rating</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map(teacher => (
                  <TableRow key={teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{teacher.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 font-medium">{teacher.subject}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{teacher.class}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${teacher.attendance > 90 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${teacher.attendance}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{teacher.attendance}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                        <span className="text-sm font-bold text-slate-900">{teacher.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={teacher.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2" onClick={() => openSchedule(teacher)}>
                            <Calendar className="w-4 h-4" /> View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => { setShowAnnounce(true); setAnnounceTarget("specific"); setSelectedTeacherIds([teacher.id]); }}>
                            <MessageSquare className="w-4 h-4" /> Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4" /> View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Mail className="w-4 h-4" /> Email</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Phone className="w-4 h-4" /> Call</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
