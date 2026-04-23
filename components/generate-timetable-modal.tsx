'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GenerateTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const formSchema = z.object({
  classIds: z.array(z.string()).min(1, 'Select at least one class'),
  weekStart: z.string().min(1, 'Week start date is required'),
  constraints: z.object({
    maxPeriodsPerTeacher: z.number().min(1).max(10),
    avoidTeacherConflicts: z.boolean(),
    respectRoomAvailability: z.boolean(),
    priority: z.enum(['balanced', 'minimize_gaps', 'core_subjects']),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface ClassOption {
  id: string;
  name: string;
}

interface SystemStatus {
  teachers: number;
  classes: number;
  subjects: number;
  canGenerate: boolean;
}

export function GenerateTimetableModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: GenerateTimetableModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classIds: [],
      weekStart: new Date().toISOString().split('T')[0],
      constraints: {
        maxPeriodsPerTeacher: 6,
        avoidTeacherConflicts: true,
        respectRoomAvailability: true,
        priority: 'balanced',
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchSystemData();
    }
  }, [isOpen]);

  const fetchSystemData = async () => {
    try {
      // Fetch classes
      const classesRes = await fetch('/api/classes');
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData);
      }

      // Check system status
      const statusRes = await fetch('/api/system-status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSystemStatus(statusData);
      }
    } catch (error) {
      console.error('Failed to fetch system data:', error);
    }
  };

  const handleClassToggle = (classId: string, checked: boolean) => {
    const newSelectedClasses = checked
      ? [...selectedClasses, classId]
      : selectedClasses.filter(id => id !== classId);
    
    setSelectedClasses(newSelectedClasses);
    form.setValue('classIds', newSelectedClasses);
  };

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.details) {
          // Handle safety check failures
          const details = result.details as SystemStatus;
          onError(`Cannot generate timetable: Missing required data (${details.teachers} teachers, ${details.classes} classes, ${details.subjects} subjects)`);
        } else if (response.status === 400 && result.conflicts) {
          // Handle conflict validation failures
          const conflicts = result.conflicts as string[];
          onError(`Generated timetable has conflicts:\n${conflicts.join('\n')}`);
        } else {
          onError(result.error || 'Failed to generate timetable');
        }
        return;
      }

      onSuccess();
      form.reset();
      setSelectedClasses([]);
    } catch (error) {
      console.error('Generation error:', error);
      onError('Network error occurred while generating timetable');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'minimize_gaps':
        return 'Minimize Gaps';
      case 'core_subjects':
        return 'Core Subjects First';
      default:
        return 'Balanced';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Generate New Timetable
          </DialogTitle>
          <DialogDescription>
            Automatically create an optimized school timetable using genetic algorithm.
          </DialogDescription>
        </DialogHeader>

        {/* System Status */}
        {systemStatus && (
          <div className={`p-4 rounded-lg border ${
            systemStatus.canGenerate 
              ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' 
              : 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20'
          }`}>
            <div className="flex items-start gap-3">
              {systemStatus.canGenerate ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-2">
                  {systemStatus.canGenerate ? 'System Ready' : 'System Requirements Not Met'}
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Teachers:</span>
                    <span className={`ml-2 font-medium ${
                      systemStatus.teachers > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemStatus.teachers}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Classes:</span>
                    <span className={`ml-2 font-medium ${
                      systemStatus.classes > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemStatus.classes}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Subjects:</span>
                    <span className={`ml-2 font-medium ${
                      systemStatus.subjects > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemStatus.subjects}
                    </span>
                  </div>
                </div>
                {!systemStatus.canGenerate && (
                  <p className="text-xs text-yellow-700 mt-2">
                    Please add missing data before generating timetable.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Class Selection */}
            <div>
              <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 block">
                Select Classes
              </FormLabel>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                {classes.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No classes available</p>
                ) : (
                  classes.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={cls.id}
                        checked={selectedClasses.includes(cls.id)}
                        onCheckedChange={(checked) => 
                          handleClassToggle(cls.id, checked as boolean)
                        }
                        disabled={isGenerating}
                      />
                      <label
                        htmlFor={cls.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {cls.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
              {selectedClasses.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedClasses.map((classId) => {
                    const cls = classes.find(c => c.id === classId);
                    return cls ? (
                      <Badge key={classId} variant="secondary" className="text-xs">
                        {cls.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
              <FormField
                control={form.control}
                name="classIds"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Week Start Date */}
            <FormField
              control={form.control}
              name="weekStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Week Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Constraints */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Generation Constraints</h3>
              
              <FormField
                control={form.control}
                name="constraints.maxPeriodsPerTeacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Periods Per Teacher</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={isGenerating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} periods
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constraints.priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Mode</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isGenerating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="minimize_gaps">Minimize Gaps</SelectItem>
                        <SelectItem value="core_subjects">Core Subjects First</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="constraints.avoidTeacherConflicts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isGenerating}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Avoid Teacher Conflicts</FormLabel>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Prevent teachers from being double-booked
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="constraints.respectRoomAvailability"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isGenerating}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Respect Room Availability</FormLabel>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Prevent rooms from being double-booked
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isGenerating || !systemStatus?.canGenerate || selectedClasses.length === 0}
                className="bg-[#E74C3C] hover:bg-red-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Start Generation'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
