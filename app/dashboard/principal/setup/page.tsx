"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  FlaskConical, 
  Clock, 
  Settings, 
  School,
  Check,
  X
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
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BellTime {
  id: string;
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakLabel?: string | null;
}

interface Lab {
  id: string;
  name: string;
  capacity?: number | null;
  labType?: string | null;
  isAvailable: boolean;
}

interface SchoolConfig {
  id: string;
  schoolName: string;
  totalPeriodsPerDay: number;
  bellTimes: BellTime[];
  labs: Lab[];
}

export default function SchoolSetupPage() {
  const [config, setConfig] = useState<SchoolConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General Settings State
  const [schoolName, setSchoolName] = useState("");
  const [totalPeriods, setTotalPeriods] = useState(8);

  // Sensors for dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setConfig(data);
      setSchoolName(data.schoolName);
      setTotalPeriods(data.totalPeriodsPerDay);
    } catch (error) {
      toast.error("Failed to load school configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGeneral = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName, totalPeriodsPerDay: totalPeriods }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("General settings updated");
    } catch (error) {
      toast.error("Failed to update general settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBellTime = async () => {
    if (!config) return;
    const nextPeriod = config.bellTimes.length > 0 
      ? Math.max(...config.bellTimes.map(bt => bt.periodNumber)) + 1 
      : 1;
    
    const newBt = {
      periodNumber: nextPeriod,
      label: `Period ${nextPeriod}`,
      startTime: "08:00",
      endTime: "08:45",
      isBreak: false,
    };

    try {
      const res = await fetch("/api/config/bell-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBt),
      });
      if (!res.ok) throw new Error("Failed to add period");
      const savedBt = await res.json();
      setConfig({ ...config, bellTimes: [...config.bellTimes, savedBt] });
      toast.success("Period added");
    } catch (error) {
      toast.error("Failed to add period");
    }
  };

  const handleDeleteBellTime = async (id: string) => {
    try {
      const res = await fetch(`/api/config/bell-times/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setConfig(prev => prev ? ({
        ...prev,
        bellTimes: prev.bellTimes.filter(bt => bt.id !== id)
      }) : null);
      toast.success("Period deleted");
    } catch (error) {
      toast.error("Failed to delete period");
    }
  };

  const handleUpdateBellTime = async (id: string, updates: Partial<BellTime>) => {
    try {
      const res = await fetch(`/api/config/bell-times/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setConfig(prev => prev ? ({
        ...prev,
        bellTimes: prev.bellTimes.map(bt => bt.id === id ? updated : bt)
      }) : null);
    } catch (error) {
      toast.error("Failed to update period");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!config || !over || active.id === over.id) return;

    const oldIndex = config.bellTimes.findIndex(bt => bt.id === active.id);
    const newIndex = config.bellTimes.findIndex(bt => bt.id === over.id);

    const newOrder = arrayMove(config.bellTimes, oldIndex, newIndex);
    
    // Update period numbers optimistically
    const updatedOrder = newOrder.map((bt, idx) => ({
      ...bt,
      periodNumber: idx + 1
    }));

    setConfig({ ...config, bellTimes: updatedOrder });

    // In a real app, you'd send a bulk update to the server to persist the order
    // For this task, we'll just update them individually or assume sequential IDs
    for (let i = 0; i < updatedOrder.length; i++) {
        if (updatedOrder[i].periodNumber !== newOrder[i].periodNumber) {
            await handleUpdateBellTime(updatedOrder[i].id, { periodNumber: updatedOrder[i].periodNumber });
        }
    }
  };

  const handleAddLab = async (lab: Omit<Lab, "id">) => {
    try {
      const res = await fetch("/api/config/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lab),
      });
      if (!res.ok) throw new Error("Failed to add lab");
      const savedLab = await res.json();
      setConfig(prev => prev ? ({ ...prev, labs: [...prev.labs, savedLab] }) : null);
      toast.success("Lab added");
    } catch (error) {
      toast.error("Failed to add lab");
    }
  };

  const handleDeleteLab = async (id: string) => {
    try {
      const res = await fetch(`/api/config/labs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setConfig(prev => prev ? ({
        ...prev,
        labs: prev.labs.filter(l => l.id !== id)
      }) : null);
      toast.success("Lab deleted");
    } catch (error) {
      toast.error("Failed to delete lab");
    }
  };

  const handleToggleLab = async (id: string, isAvailable: boolean) => {
    try {
      const res = await fetch(`/api/config/labs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setConfig(prev => prev ? ({
        ...prev,
        labs: prev.labs.map(l => l.id === id ? { ...l, isAvailable } : l)
      }) : null);
    } catch (error) {
      toast.error("Failed to update lab availability");
    }
  };

  if (loading) return <div className="p-8">Loading configuration...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-gray-100 font-cinzel">School Setup</h1>
          <p className="text-slate-500 dark:text-gray-400">Configure your academic structure and facilities.</p>
        </div>
        <Badge variant="outline" className="text-red-600 border-red-600/20 bg-red-600/5 font-bold px-3 py-1">
          Principal Dashboard
        </Badge>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Panel 1: General Settings */}
        <Card className="lg:col-span-1 shadow-xl border-slate-200 dark:border-[#222] dark:bg-[#0e0e0e] overflow-hidden group">
          <div className="h-1 bg-gradient-to-r from-red-600 to-pink-600" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-lg">
                <School className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-cinzel">General Settings</CardTitle>
            </div>
            <CardDescription>Basic school information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300">School Name</label>
              <Input 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Enter school name"
                className="dark:bg-[#1a1a1a] dark:border-[#333]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Periods Per Day</label>
              <Input 
                type="number" 
                min={1} 
                max={12} 
                value={totalPeriods} 
                onChange={(e) => setTotalPeriods(parseInt(e.target.value))}
                className="dark:bg-[#1a1a1a] dark:border-[#333]"
              />
            </div>
            <Button 
              onClick={handleUpdateGeneral} 
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 font-bold gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Panel 2: Bell Schedule */}
        <Card className="lg:col-span-2 shadow-xl border-slate-200 dark:border-[#222] dark:bg-[#0e0e0e] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-cinzel">Bell Schedule</CardTitle>
                <CardDescription>Daily period timings and breaks</CardDescription>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddBellTime}
              className="gap-2 border-emerald-600/20 text-emerald-600 hover:bg-emerald-600/10"
            >
              <Plus className="w-4 h-4" />
              Add Slot
            </Button>
          </CardHeader>
          <CardContent>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-200 dark:border-[#222]">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>No.</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext 
                    items={config?.bellTimes.map(bt => bt.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {config?.bellTimes.map((bt) => (
                      <SortableRow 
                        key={bt.id} 
                        bt={bt} 
                        onDelete={handleDeleteBellTime}
                        onUpdate={handleUpdateBellTime}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
            {config?.bellTimes.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No periods configured. Click "Add Slot" to begin.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Panel 3: Labs & Facilities */}
      <Card className="shadow-xl border-slate-200 dark:border-[#222] dark:bg-[#0e0e0e] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-600 to-amber-600" />
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/30 text-orange-600 rounded-lg">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-cinzel">Labs & Facilities</CardTitle>
              <CardDescription>Manage specialized rooms and capacities</CardDescription>
            </div>
          </div>
          <AddLabDialog onAdd={handleAddLab} />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {config?.labs.map((lab) => (
              <Card key={lab.id} className={`group border-slate-200 dark:border-[#222] dark:bg-[#111111] transition-all hover:shadow-md ${!lab.isAvailable ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={lab.isAvailable ? "secondary" : "outline"} className={lab.isAvailable ? "bg-emerald-500/10 text-emerald-600 border-none" : "bg-slate-500/10 text-slate-500 border-none"}>
                      {lab.labType || "General"}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteLab(lab.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold dark:text-gray-100 mt-2">{lab.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-gray-400">
                    <span>Capacity: {lab.capacity || "N/A"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{lab.isAvailable ? "Available" : "Maintenance"}</span>
                      <Switch 
                        checked={lab.isAvailable} 
                        onCheckedChange={(checked) => handleToggleLab(lab.id, checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {config?.labs.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 dark:border-[#222] rounded-xl">
                No labs configured. Add your first lab to enable specialized scheduling.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableRow({ 
  bt, 
  onDelete, 
  onUpdate 
}: { 
  bt: BellTime; 
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BellTime>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: bt.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    position: 'relative' as any,
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className={`group hover:bg-slate-50 dark:hover:bg-[#1a1a1a] border-slate-200 dark:border-[#222] ${isDragging ? 'bg-slate-100 dark:bg-[#222] opacity-50' : ''}`}
    >
      <TableCell>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
      </TableCell>
      <TableCell className="font-bold text-slate-900 dark:text-gray-300">{bt.periodNumber}</TableCell>
      <TableCell>
        <Input 
          value={bt.label} 
          onChange={(e) => onUpdate(bt.id, { label: e.target.value })}
          className="h-8 dark:bg-transparent dark:border-transparent group-hover:dark:border-[#333] transition-all"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="time" 
          value={bt.startTime} 
          onChange={(e) => onUpdate(bt.id, { startTime: e.target.value })}
          className="h-8 w-32 dark:bg-transparent dark:border-transparent group-hover:dark:border-[#333]"
        />
      </TableCell>
      <TableCell>
        <Input 
          type="time" 
          value={bt.endTime} 
          onChange={(e) => onUpdate(bt.id, { endTime: e.target.value })}
          className="h-8 w-32 dark:bg-transparent dark:border-transparent group-hover:dark:border-[#333]"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch 
            checked={bt.isBreak} 
            onCheckedChange={(checked) => onUpdate(bt.id, { isBreak: checked, label: checked ? "Lunch" : `Period ${bt.periodNumber}` })} 
          />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
            {bt.isBreak ? "Break" : "Period"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(bt.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function AddLabDialog({ onAdd }: { onAdd: (lab: any) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Science");
  const [capacity, setCapacity] = useState(30);

  const handleSubmit = () => {
    onAdd({ name, labType: type, capacity });
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-orange-600/20 text-orange-600 hover:bg-orange-600/10">
          <Plus className="w-4 h-4" />
          Add Lab
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-[#0e0e0e] dark:border-[#222]">
        <DialogHeader>
          <DialogTitle className="font-cinzel">Add New Lab/Facility</DialogTitle>
          <DialogDescription>Define a specialized room for scheduling.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Lab Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Physics Lab" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Type</label>
              <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Capacity</label>
              <Input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">Add Lab</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
