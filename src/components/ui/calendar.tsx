import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: "single";
  showOutsideDays?: boolean;
}

// Create a simple date grid for the current month
function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = [];
  
  // Add previous month days to fill the first week
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }
  
  // Add next month days to complete the grid
  const remainingDays = 42 - days.length; // 6 weeks × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }
  
  return days;
}

export function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  showOutsideDays = true,
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(selected || new Date());
  
  // Navigate between months
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  
  // Get day names
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Get month name
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  
  // Get days for the current month view
  const days = getDaysInMonth(viewDate);
  
  // Handle day selection
  const handleDayClick = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };
  
  // Check if a date is selected
  const isSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevMonth}
          className="h-7 w-7 bg-transparent p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {monthName} {viewDate.getFullYear()}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextMonth}
          className="h-7 w-7 bg-transparent p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {weekdays.map((day) => (
          <div 
            key={day} 
            className="text-center text-muted-foreground text-xs font-medium py-1"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, i) => (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 p-0 font-normal",
              !day.isCurrentMonth && !showOutsideDays && "invisible",
              !day.isCurrentMonth && showOutsideDays && "text-muted-foreground opacity-30",
              isToday(day.date) && "bg-accent text-accent-foreground",
              isSelected(day.date) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              !day.isCurrentMonth && !showOutsideDays && "pointer-events-none"
            )}
            onClick={() => handleDayClick(day.date)}
          >
            {day.date.getDate()}
          </Button>
        ))}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar" 