import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Bell, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { fetchExamDeadlines, deadlineToDate, refreshDeadlineData, ExamDeadline } from "@/lib/exam-crawler";

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
  callToAction: string;
}

const CountdownTimer = ({ targetDate, label, callToAction }: CountdownTimerProps) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full">
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>{label}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4 my-4">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{days}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{hours}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">Hrs</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{minutes}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">Mins</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{seconds}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">Secs</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground mb-4">
            Don't miss your chance—
          </p>
          <Button className="w-full">{callToAction}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ExamDatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [deadlines, setDeadlines] = useState<Array<{
    name: string;
    date: Date;
    callToAction: string;
    description: string;
  }>>([]);

  const handleDeadlinesUpdate = (fetchedDeadlines: ExamDeadline[]) => {
    // Convert to our format with Date objects
    const formattedDeadlines = fetchedDeadlines.map(deadline => ({
      name: deadline.name,
      date: deadlineToDate(deadline),
      callToAction: deadline.callToAction,
      description: deadline.description
    }));
    
    setDeadlines(formattedDeadlines);
    setLastUpdated(new Date());
    setIsLoading(false);
    setIsRefreshing(false);
  };

  // Manual refresh function
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const fetchedDeadlines = await fetchExamDeadlines();
      handleDeadlinesUpdate(fetchedDeadlines);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Set up the refresh process on component mount
    let cleanup: (() => void) | undefined;
    
    async function setupRefresh() {
      try {
        cleanup = await refreshDeadlineData(handleDeadlinesUpdate, 60000);
      } catch (error) {
        console.error("Failed to set up deadline refresh:", error);
        // Try manual load if auto-refresh fails
        const initialDeadlines = await fetchExamDeadlines();
        handleDeadlinesUpdate(initialDeadlines);
      }
    }
    
    setupRefresh();
    
    // Clean up when component unmounts
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Important Exam Dates</h1>
              <p className="text-muted-foreground mb-2">
                Keep track of upcoming deadlines and exam schedules. Mark your calendar for these important dates.
              </p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>
          
          <div className="mb-8"></div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="ml-3 text-muted-foreground">Loading deadlines in real-time...</p>
            </div>
          ) : (
            <>
              {deadlines.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <CountdownTimer 
                    targetDate={deadlines[0].date} 
                    label={`Hurry Up! ${deadlines[0].name} Applications close in`} 
                    callToAction={deadlines[0].callToAction}
                  />
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  All Upcoming Dates
                </h2>

                <div className="grid gap-6">
                  {deadlines.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{event.name}</h3>
                              <p className="text-muted-foreground text-sm">{event.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  {event.date.toLocaleDateString(undefined, { 
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })} at {event.date.toLocaleTimeString(undefined, {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline">{event.callToAction}</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 