"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DaysOfWeekProps {
  selectedDays: string[];
  onDayChange: (day: string, isSelected: boolean) => void;
}

export function DaysOfWeek({ selectedDays, onDayChange }: DaysOfWeekProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Days of Week</Label>
      <div className="grid grid-cols-3 gap-2">
        {days.map((day) => (
          <div key={day} className="flex items-center space-x-2">
            <Checkbox
              id={day}
              checked={selectedDays.includes(day)}
              onCheckedChange={(checked) => onDayChange(day, !!checked)}
            />
            <Label htmlFor={day}>{day}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
