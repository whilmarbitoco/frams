import { getTeacherClasses, createClass } from "@/actions/classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { DaysOfWeek } from "@/components/days-of-week";

export default async function TeacherClassesPage() {
  const classesList = await getTeacherClasses();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Class</CardTitle>
            <CardDescription>Add a new class to your schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData) => {
                "use server";
                await createClass(formData);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Name</label>
                <Input name="name" placeholder="e.g. CS101" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input name="startTime" type="time" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input name="endTime" type="time" required />
                </div>
              </div>
              <DaysOfWeekForm />{" "}
              {/* New component for days of week selection */}
              <Button type="submit" className="w-full">
                Create Class
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing Classes</h2>
          {classesList.length === 0 ? (
            <p className="text-muted-foreground">No classes found.</p>
          ) : (
            classesList.map((cls) => (
              <Card key={cls.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>
                    {cls.startTime} - {cls.endTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/teacher/class/${cls.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DaysOfWeekForm() {
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
