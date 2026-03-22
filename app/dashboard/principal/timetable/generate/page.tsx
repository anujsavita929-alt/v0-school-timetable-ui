"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Settings2, 
  ArrowRight, 
  Check, 
  ChevronRight,
  BookOpen,
  User,
  Hash,
  Star,
  FlaskConical,
  Edit2,
  School as SchoolHouseIcon
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Subject {
  id: string;
  name: string;
  teacher: string;
  maxPeriods: number;
  priority: number;
  isLab: boolean;
  sequence: number;
}

interface Section {
  id: string;
  name: string;
  subjects: Subject[];
}

interface Class {
  id: string;
  number: string;
  sections: Section[];
}

export default function TimetableGenerator() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([
    { 
      id: "1", 
      number: "10", 
      sections: [
        { id: "s1", name: "A", subjects: [{ id: "sub1", name: "Math", teacher: "Mr. Sharma", maxPeriods: 6, priority: 5, isLab: false, sequence: 1 }] }
      ] 
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addClass = () => {
    const newClass: Class = {
      id: Date.now().toString(),
      number: (10 + classes.length).toString(),
      sections: [{ id: `s-${Date.now()}`, name: "A", subjects: [] }]
    };
    setClasses([...classes, newClass]);
  };

  const removeClass = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId));
  };

  const addSection = (classId: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: [...c.sections, { id: `s-${Date.now()}`, name: String.fromCharCode(65 + c.sections.length), subjects: [] }]
        };
      }
      return c;
    }));
  };

  const removeSection = (classId: string, sectionId: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return { ...c, sections: c.sections.filter(s => s.id !== sectionId) };
      }
      return c;
    }));
  };

  const renameSection = (classId: string, sectionId: string, newName: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: c.sections.map(s => s.id === sectionId ? { ...s, name: newName } : s)
        };
      }
      return c;
    }));
  };

  const addSubject = (classId: string, sectionId: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id === sectionId) {
              const newSub: Subject = {
                id: `sub-${Date.now()}`,
                name: "",
                teacher: "",
                maxPeriods: 5,
                priority: 3,
                isLab: false,
                sequence: s.subjects.length + 1
              };
              return { ...s, subjects: [...s.subjects, newSub] };
            }
            return s;
          })
        };
      }
      return c;
    }));
  };

  const updateSubject = (classId: string, sectionId: string, subId: string, field: keyof Subject, value: any) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id === sectionId) {
              return {
                ...s,
                subjects: s.subjects.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub)
              };
            }
            return s;
          })
        };
      }
      return c;
    }));
  };

  const removeSubject = (classId: string, sectionId: string, subId: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          sections: c.sections.map(s => {
            if (s.id === sectionId) {
              return { ...s, subjects: s.subjects.filter(sub => sub.id !== subId) };
            }
            return s;
          })
        };
      }
      return c;
    }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    toast.info("Generating optimized clash-free timetable...");
    
    try {
      // Simulate API delay for generation
      await new Promise(r => setTimeout(r, 2500));
      toast.success("Timetable generated successfully!");
      router.push("/timetable");
    } catch (e) {
      toast.error("Failed to generate timetable. Please check constraints.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Configuration</h1>
          <p className="text-slate-500 font-medium">Define your school structure and subject priorities for the AI engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={addClass}>
            <Plus className="w-4 h-4" />
            Add New Class
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {classes.map((cls) => (
          <div key={cls.id} className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-xl">
                   <SchoolHouseIcon className="w-6 h-6 text-red-300" />
                </div>
                <div>
                  <h2 className="text-xl font-black">CLASS {cls.number}</h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Academic Tier</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-white hover:bg-white/10 gap-2" onClick={() => addSection(cls.id)}>
                   <Plus className="w-4 h-4" />
                   Add Section
                </Button>
                <Button variant="ghost" className="text-red-400 hover:bg-red-500/10" onClick={() => removeClass(cls.id)}>
                   <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-1">
              {cls.sections.map((section) => (
                <Card key={section.id} className="border-slate-200 shadow-md">
                  <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-900">
                        {section.name}
                      </div>
                      <div className="relative group">
                        <Input 
                          value={section.name} 
                          onChange={(e) => renameSection(cls.id, section.id, e.target.value)}
                          className="w-20 font-bold text-center h-8"
                        />
                        <Edit2 className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <Badge variant="outline" className="text-slate-500">
                        {section.subjects.length} Subjects
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => removeSection(cls.id, section.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b">
                          <tr>
                            <th className="px-6 py-4 text-left w-20">Seq</th>
                            <th className="px-6 py-4 text-left">Subject Name</th>
                            <th className="px-6 py-4 text-left">Teacher Name</th>
                            <th className="px-6 py-4 text-left w-32">Weekly Periods</th>
                            <th className="px-6 py-4 text-left w-32">Priority (1-5)</th>
                            <th className="px-6 py-4 text-center w-20">Lab?</th>
                            <th className="px-6 py-4 text-right w-16"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {section.subjects.map((sub, idx) => (
                            <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-400 font-bold">
                                   <Hash className="w-3 h-3" />
                                   {idx + 1}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Input 
                                  value={sub.name} 
                                  placeholder="e.g. Mathematics"
                                  onChange={(e) => updateSubject(cls.id, section.id, sub.id, "name", e.target.value)}
                                  className="border-none bg-transparent font-bold focus-visible:ring-1 focus-visible:ring-red-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <Select 
                                  value={sub.teacher} 
                                  onValueChange={(v) => updateSubject(cls.id, section.id, sub.id, "teacher", v)}
                                >
                                  <SelectTrigger className="border-none bg-transparent hover:bg-slate-50 transition-colors font-medium">
                                    <SelectValue placeholder="Select Teacher" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Mr. Sharma">Mr. Sharma</SelectItem>
                                    <SelectItem value="Ms. Verma">Ms. Verma</SelectItem>
                                    <SelectItem value="Dr. Gupta">Dr. Gupta</SelectItem>
                                    <SelectItem value="Mrs. Singh">Mrs. Singh</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-6 py-4">
                                <Input 
                                  type="number" 
                                  min="1" max="10"
                                  value={sub.maxPeriods}
                                  onChange={(e) => updateSubject(cls.id, section.id, sub.id, "maxPeriods", parseInt(e.target.value))}
                                  className="w-20 font-bold"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Star className={`w-3 h-3 ${sub.priority >= 4 ? 'fill-orange-400 text-orange-400' : 'text-slate-300'}`} />
                                  <Select 
                                    value={sub.priority.toString()} 
                                    onValueChange={(v) => updateSubject(cls.id, section.id, sub.id, "priority", parseInt(v))}
                                  >
                                    <SelectTrigger className="w-20 border-none bg-transparent font-bold">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map(p => (
                                        <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Checkbox 
                                  checked={sub.isLab} 
                                  onCheckedChange={(v) => updateSubject(cls.id, section.id, sub.id, "isLab", !!v)}
                                  className="rounded-md border-red-200 data-[state=checked]:bg-red-600"
                                />
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-red-500 transition-colors" onClick={() => removeSubject(cls.id, section.id, sub.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/30 p-4 border-t">
                    <Button variant="link" className="text-red-600 font-bold gap-2 p-0 h-auto" onClick={() => addSubject(cls.id, section.id)}>
                      <Plus className="w-4 h-4" />
                      Add Subject Configuration
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Button 
          className="h-16 px-12 rounded-full bg-red-600 text-white shadow-2xl hover:scale-105 transition-all gap-4 text-lg font-black group"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <Settings2 className="w-6 h-6 animate-spin" />
          ) : (
             <Sparkles className="w-6 h-6 text-red-300" />
          )}
          {isLoading ? "CALCULATING MATRICES..." : "GENERATE CLASH-FREE TIMETABLE"}
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="h-24" /> {/* Spacer for fab */}
    </div>
  );
}

function Sparkles(props: any) {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
