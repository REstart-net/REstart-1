import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface TestTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
}

export function TestTimer({ duration, onTimeUp }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const progress = (timeLeft / (duration * 60)) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">Time Remaining</span>
          </div>
          <span className="font-mono text-lg">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}