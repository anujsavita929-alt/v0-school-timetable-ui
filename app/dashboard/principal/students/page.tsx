"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Download,
  Calendar,
  X,
  TrendingUp,
  BookOpen,
  Award
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area 
} from "recharts";

// Mock Data Generator for 450 students
const generateStudents = () => {
  const classes = ["10", "11", "12"];
  const sections = ["A", "B", "C", "D"];
  const statuses = ["Active", "Inactive"];
  
  return Array.from({ length: 450 }, (_, i) => ({
    id: `STU-${1000 + i}`,
    name: [`Arjun`, `Sneha`, `Rahul`, `Priya`, `Aman`, `Ishita`, `Vijay`, `Deepa`][i % 8] + ` ` + [`Sharma`, `Verma`, `Gupta`, `Singh`, `Patel`, `Reddy`][i % 6],
    class: classes[Math.floor(Math.random() * classes.length)],
    section: sections[Math.floor(Math.random() * sections.length)],
    status: statuses[Math.random() > 0.1 ? 0 : 1],
    attendance: 85 + Math.floor(Math.random() * 15),
    performance: 60 + Math.floor(Math.random() * 40)
  }));
};

const studentsData = generateStudents();

// Mock chart data for performance modal
const attendanceData = [
  { month: "Sep", rate: 92 },
  { month: "Oct", rate: 88 },
  { month: "Nov", rate: 95 },
  { month: "Dec", rate: 91 },
  { month: "Jan", rate: 97 },
  { month: "Feb", rate: 94 },
];

const subjectData = [
  { subject: "Math", score: 88 },
  { subject: "Science", score: 92 },
  { subject: "English", score: 78 },
  { subject: "History", score: 85 },
  { subject: "CS", score: 96 },
];

const performanceHistory = [
  { week: "W1", score: 75 },
  { week: "W2", score: 78 },
  { week: "W3", score: 82 },
  { week: "W4", score: 80 },
  { week: "W5", score: 88 },
];

export default function StudentsAnalytics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStudents = useMemo(() => {
    return studentsData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === "all" || student.class === classFilter;
      const matchesSection = sectionFilter === "all" || student.section === sectionFilter;
      return matchesSearch && matchesClass && matchesSection;
    });
  }, [searchTerm, classFilter, sectionFilter]);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Analytics</h1>
          <p className="text-slate-500">Manage and track performance of 450 active students.</p>
        </div>
        <Button className="bg-slate-900 gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by name or ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
                  <Select onValueChange={setClassFilter} defaultValue="all">
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setSectionFilter} defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Student ID</TableHead>
                  <TableHead className="font-bold">Full Name</TableHead>
                  <TableHead className="font-bold">Class</TableHead>
                  <TableHead className="font-bold">Section</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold tracking-tight w-40">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-600">{student.id}</TableCell>
                    <TableCell className="font-bold text-slate-900">{student.name}</TableCell>
                    <TableCell className="text-slate-600">{student.class}</TableCell>
                    <TableCell className="text-slate-600">{student.section}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={student.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 hover:bg-slate-100"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="w-4 h-4" />
                            View Performance
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="border-b pb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <Users className="w-8 h-8" />
                              </div>
                              <div>
                                <DialogTitle className="text-2xl font-black text-slate-900">
                                  {selectedStudent?.name}
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium tracking-tight">
                                  Analytics Profile • ID: {selectedStudent?.id} • Class {selectedStudent?.class}-{selectedStudent?.section}
                                </DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>
                          
                          <div className="grid gap-6 py-6 md:grid-cols-2">
                            {/* Attendance Line Chart */}
                            <Card className="shadow-none border-slate-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-red-500" />
                                  Attendance Overview (Monthly)
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="h-48 pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" axisLine={false} tickLine={false} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="rate" stroke="#E74C3C" strokeWidth={3} dot={{ r: 4, fill: '#E74C3C' }} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>

                            {/* Subject Marks Bar Chart */}
                            <Card className="shadow-none border-slate-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-emerald-500" />
                                  Current Subject Scores
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="h-48 pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={subjectData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="subject" fontSize={11} stroke="#94a3b8" axisLine={false} tickLine={false} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>

                            {/* Overall Performance Area Chart */}
                            <Card className="shadow-none border-slate-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-red-500" />
                                  Weekly Performance Index
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="h-48 pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={performanceHistory}>
                                    <defs>
                                      <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E74C3C" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#E74C3C" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="week" fontSize={11} stroke="#94a3b8" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="score" stroke="#E74C3C" fillOpacity={1} fill="url(#colorPerf)" strokeWidth={2} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>

                            {/* Recent Test Papers Table */}
                            <Card className="shadow-none border-slate-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                  <Award className="w-4 h-4 text-orange-500" />
                                  Recent Assessments
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3 pt-2">
                                  {[
                                    { name: "Math Midterm", grade: "A+", date: "Oct 15" },
                                    { name: "Physics Unit 1", grade: "B", date: "Oct 28" },
                                    { name: "English Essay", grade: "A", date: "Nov 02" },
                                  ].map((test, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50">
                                      <div>
                                        <p className="font-bold text-slate-800">{test.name}</p>
                                        <p className="text-[10px] text-slate-500">{test.date}</p>
                                      </div>
                                      <Badge className="bg-white border-slate-200 text-slate-800 font-bold">{test.grade}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
              Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of <span className="font-bold text-slate-900">{filteredStudents.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button 
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"} 
                      size="sm"
                      className="w-8 h-8 p-0 bg-slate-900"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="mx-1 text-slate-400">...</span>}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
