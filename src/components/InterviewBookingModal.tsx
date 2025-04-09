import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndianRupee } from "lucide-react";

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// Simple date formatter
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export function InterviewBookingModal() {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("");

  // Simple date picker controls
  const addDays = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };

  const handleBooking = () => {
    // Here you would typically make an API call to book the session
    console.log("Booking session for:", date, time);
    // Show success message or redirect to payment
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Book Interview Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Your Mock Interview</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Select Date</h4>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={() => addDays(-1)}>Previous Day</Button>
                <div className="font-medium">{formatDate(date)}</div>
                <Button variant="outline" size="sm" onClick={() => addDays(1)}>Next Day</Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {date.toLocaleDateString('en-IN', { weekday: 'long' })}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Select Time Slot</h4>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-1">
              <IndianRupee className="h-5 w-5" />
              <span className="text-xl font-bold">100</span>
            </div>
            <Button 
              onClick={handleBooking}
              disabled={!time}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 