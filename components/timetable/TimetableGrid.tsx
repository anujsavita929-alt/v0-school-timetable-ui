'use client';

import { Badge } from '@/components/ui/badge';

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

interface TimetableGridProps {
  slots: TimeSlot[];
  isTeacherView?: boolean;
  onCellClick?: (params: {
    day: string;
    time: string;
    slot: TimeSlot | null;
  }) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
];

const SUBJECT_COLOR_MAP: Record<string, string> = {
  Mathematics: '#E74C3C',
  English: '#27AE60',
  Science: '#F39C12',
  History: '#8E44AD',
  'Computer Science': '#3498DB',
  Art: '#E67E22',
  Music: '#E83E8C',
  'Physical Education': '#16A085',
  Assembly: '#D35400',
  Others: '#7F8C8D',
};

const getColorForSubject = (subject: string) => {
  return SUBJECT_COLOR_MAP[subject] ?? SUBJECT_COLOR_MAP.Others;
};

export function TimetableGrid({
  slots,
  isTeacherView = false,
  onCellClick,
}: TimetableGridProps) {
  const getSlotForDayAndTime = (day: string, time: string) => {
    return slots.find((slot) => slot.day === day && slot.time === time);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="grid gap-4" style={{
          gridTemplateColumns: '150px repeat(5, 1fr)',
        }}>
          {/* Header - Time slot column */}
          <div className="font-semibold text-gray-900 text-center py-4 bg-gray-50 rounded-tl-lg">
            Time
          </div>

          {/* Header - Days */}
          {DAYS.map((day) => (
            <div
              key={day}
              className="font-semibold text-gray-900 text-center py-4 bg-gray-50"
            >
              {day}
            </div>
          ))}

          {/* Time slots and cells */}
          {TIME_SLOTS.map((time, timeIdx) => (
            <div key={time} className="contents">
              {/* Time label */}
              <div
                className={`font-semibold text-gray-700 text-center py-4 px-2 bg-gray-50 ${
                  timeIdx === TIME_SLOTS.length - 1 ? 'rounded-bl-lg' : ''
                }`}
              >
                {time}
              </div>

              {/* Cells for each day */}
              {DAYS.map((day) => {
                const slot = getSlotForDayAndTime(day, time);
                const bgColor = slot ? getColorForSubject(slot.subject) : 'transparent';

                return (
                  <div
                    key={`${day}-${time}`}
                    className="p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer min-h-[120px] flex flex-col justify-center"
                    style={{
                      backgroundColor: slot ? `${bgColor}15` : 'transparent',
                      borderLeftColor: slot ? bgColor : 'transparent',
                      borderLeftWidth: slot ? '4px' : '1px',
                    }}
                    onClick={() =>
                      onCellClick?.({
                        day,
                        time,
                        slot: slot ?? null,
                      })
                    }
                  >
                    {slot ? (
                      <div className="space-y-2">
                        <div>
                          <p className="font-bold text-gray-900 text-sm" style={{ color: bgColor }}>
                            {slot.subject}
                          </p>
                          <p className="text-xs text-gray-600">Room: {slot.room}</p>
                        </div>
                        {!isTeacherView && (
                          <p className="text-xs text-gray-600">{slot.teacher}</p>
                        )}
                        <Badge
                          variant="secondary"
                          className="w-fit text-xs"
                          style={{
                            backgroundColor: `${bgColor}30`,
                            color: bgColor,
                          }}
                        >
                          {isTeacherView ? `Class` : 'Active'}
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 text-sm italic">
                        Free
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
