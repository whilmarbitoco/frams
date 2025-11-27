"use client";

import { useState } from "react";
import { DaysOfWeek } from "@/components/days-of-week";

export function DaysOfWeekForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDayChange = (day: string, isSelected: boolean) => {
    setSelectedDays((prev) =>
      isSelected ? [...prev, day] : prev.filter((d) => d !== day)
    );
  };

  return (
    <>
      <DaysOfWeek selectedDays={selectedDays} onDayChange={handleDayChange} />
      {selectedDays.map((day) => (
        <input type="hidden" key={day} name="days" value={day} />
      ))}
    </>
  );
}
