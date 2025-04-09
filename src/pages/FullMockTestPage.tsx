import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTimer } from "@/components/test/test-timer";
import { QuestionCard } from "@/components/test/question-card";
import { QuestionNavigator } from "@/components/test/question-navigator";
import { TestInstructions } from "@/components/test/test-instructions";
import { generateTest, calculateScore } from "@/lib/test-generator";
import { useProgress } from "@/hooks/use-progress";
import { Subject, subjects } from "@/shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Flag, Check, AlertTriangle, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function FullMockTestPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { updateProgress } = useProgress();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [tests, setTests] = useState<Record<Subject, Awaited<ReturnType<typeof generateTest>> | null>>({} as any);
  const [currentSubject, setCurrentSubject] = useState<Subject>(subjects[0]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<Subject, Record<string, number>>>({} as any);
  const [markedQuestions, setMarkedQuestions] = useState<Record<Subject, Set<number>>>({} as any);
  const [showResults, setShowResults] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [exitAttempts, setExitAttempts] = useState(0);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState<Record<Subject, number>>({} as any);
  const [totalDuration] = useState(180); // 3 hours total (45 min per subject)

  // Initialize state for each subject
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    const initialAnswers: Record<Subject, Record<string, number>> = {} as any;
    const initialMarkedQuestions: Record<Subject, Set<number>> = {} as any;
    const initialTimeSpent: Record<Subject, number> = {} as any;
    
    subjects.forEach(subject => {
      initialAnswers[subject] = {};
      initialMarkedQuestions[subject] = new Set();
      initialTimeSpent[subject] = 0;
    });
    
    setAnswers(initialAnswers);
    setMarkedQuestions(initialMarkedQuestions);
    setTimeSpent(initialTimeSpent);
  }, [user, setLocation]);

  // Load tests for all subjects
  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const testPromises = subjects.map(subject => generateTest(subject));
        const generatedTests = await Promise.all(testPromises);
        
        const testsMap: Record<Subject, Awaited<ReturnType<typeof generateTest>>> = {} as any;
        subjects.forEach((subject, index) => {
          testsMap[subject] = generatedTests[index];
        });
        
        setTests(testsMap);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tests');
        setLoading(false);
      }
    }
    
    if (user) {
      loadTests();
    }
  }, [user]);

  // Handle fullscreen changes and prevent exit
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);
      
      if (testStarted && !isCurrentlyFullScreen && !showResults) {
        setExitAttempts(prev => prev + 1);
        setShowExitWarning(true);
        
        // Try to re-enter fullscreen
        if (exitAttempts < 2) {
          try {
            // Check if fullscreen is available and permitted
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(err => {
                console.warn('Failed to re-enter fullscreen:', err);
                // Continue test even if fullscreen fails
              });
            }
          } catch (err) {
            console.warn('Could not re-enter fullscreen mode:', err);
          }
        }
      }
    };

    // Handle browser navigation attempts
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testStarted && !showResults) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (testStarted && !showResults && document.visibilityState === 'hidden') {
        setExitAttempts(prev => prev + 1);
        setShowExitWarning(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [testStarted, showResults, exitAttempts]);

  // Track time spent on each subject
  useEffect(() => {
    if (testStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeSpent(prev => ({
          ...prev,
          [currentSubject]: (prev[currentSubject] || 0) + 1
        }));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [testStarted, showResults, currentSubject]);

  const startTest = async () => {
    try {
      // Check if fullscreen is available and permitted
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(err => {
          console.warn('Failed to enter fullscreen:', err);
          // Continue test even if fullscreen fails
        });
      }
      setTestStarted(true);
      setTestStartTime(new Date());
    } catch (err) {
      console.warn("Could not enter fullscreen mode:", err);
      // Allow the test to start even if fullscreen fails
      setTestStarted(true);
      setTestStartTime(new Date());
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentSubject]: {
        ...prev[currentSubject],
        [questionId]: answerId
      }
    }));
  };

  const handleMarkQuestion = () => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev[currentSubject]);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      
      return {
        ...prev,
        [currentSubject]: newSet
      };
    });
  };

  const handleSubjectChange = (subject: Subject) => {
    setCurrentSubject(subject);
    setCurrentQuestion(0);
  };

  const handleSubmitTest = async () => {
    if (!tests) return;
    
    // Calculate scores for each subject
    const results: Record<Subject, { score: number, total: number }> = {} as any;
    let totalScore = 0;
    let totalQuestions = 0;
    
    subjects.forEach(subject => {
      if (tests[subject]) {
        const result = calculateScore(tests[subject]!, answers[subject] || {});
        results[subject] = { 
          score: result.score, 
          total: result.total 
        };
        totalScore += result.score;
        totalQuestions += result.total;
      }
    });
    
    setShowResults(true);

    // Calculate time spent
    const endTime = new Date();
    const totalTimeSpent = testStartTime ? 
      Math.floor((endTime.getTime() - testStartTime.getTime()) / 1000) : 0;

    // Update progress for all subjects
    try {
      for (const subject of subjects) {
        if (tests[subject]) {
          await updateProgress(subject, {
            completedTests: 1,
            totalScore: (results[subject].score / results[subject].total) * 100,
          });
        }
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      // We still show results even if progress update fails
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  const dismissWarning = () => {
    setShowExitWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Tests</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => setLocation(`/dashboard`)}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <TestInstructions
        duration={totalDuration}
        totalQuestions={subjects.length * 30}
        onStart={startTest}
        isFullMockTest={true}
      />
    );
  }

  if (showResults) {
    // Calculate overall results
    const results: Record<Subject, { score: number, total: number }> = {} as any;
    let totalScore = 0;
    let totalQuestions = 0;
    
    subjects.forEach(subject => {
      if (tests[subject]) {
        const result = calculateScore(tests[subject]!, answers[subject] || {});
        results[subject] = { 
          score: result.score, 
          total: result.total 
        };
        totalScore += result.score;
        totalQuestions += result.total;
      }
    });
    
    const overallPercentage = Math.round((totalScore / totalQuestions) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <Card className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Full Mock Test Completed!</h2>
            <p className="text-muted-foreground">
              Overall Score: {totalScore} out of {totalQuestions} ({overallPercentage}%)
            </p>
          </div>

          <Tabs defaultValue={subjects[0]} className="mb-8">
            <TabsList className="mb-4 flex flex-wrap">
              {subjects.map(subject => (
                <TabsTrigger key={subject} value={subject} className="flex-1">
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {subjects.map(subject => (
              <TabsContent key={subject} value={subject}>
                <div className="p-4 bg-muted rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-2">{subject} Results</h3>
                  <p>
                    Score: {results[subject]?.score || 0} out of {results[subject]?.total || 0} 
                    ({Math.round(((results[subject]?.score || 0) / (results[subject]?.total || 1)) * 100)}%)
                  </p>
                  <p>Time spent: {Math.floor(timeSpent[subject] / 60)} minutes {timeSpent[subject] % 60} seconds</p>
                </div>
                
                <div className="space-y-8">
                  {tests[subject]?.questions.map((question, index) => {
                    const userAnswer = answers[subject]?.[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    if (!isCorrect) {
                      return (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          selectedAnswer={userAnswer}
                          correctAnswer={question.correctAnswer}
                          showExplanation
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 text-center">
            <Button onClick={() => setLocation(`/dashboard`)}>
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentTest = tests[currentSubject];
  if (!currentTest) return null;

  return (
    <div className="min-h-screen bg-background">
      {showExitWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Warning: Test Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You have attempted to exit fullscreen mode or switch tabs. This is against test rules.
              </p>
              <p className="font-semibold">
                Warning {exitAttempts} of 3. After 3 attempts, your test will be automatically submitted.
              </p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleSubmitTest}
                >
                  End Test Now
                </Button>
                <Button 
                  onClick={dismissWarning}
                >
                  Continue Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Tabs 
            value={currentSubject} 
            onValueChange={(value) => handleSubjectChange(value as Subject)}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-4">
              {subjects.map(subject => (
                <TabsTrigger key={subject} value={subject}>
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <TestTimer duration={totalDuration} onTimeUp={handleTimeUp} />
              <Button
                variant="outline"
                onClick={handleMarkQuestion}
                className="gap-2"
              >
                <Flag className="h-4 w-4" />
                {markedQuestions[currentSubject]?.has(currentQuestion) ? "Unmark" : "Mark"} for Review
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSubject}-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <QuestionCard
                  question={currentTest.questions[currentQuestion]}
                  selectedAnswer={answers[currentSubject]?.[currentTest.questions[currentQuestion].id]}
                  onAnswerSelect={(answerId) =>
                    handleAnswerSelect(currentTest.questions[currentQuestion].id, answerId)
                  }
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {currentQuestion === currentTest.questions.length - 1 ? (
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (currentSubject === subjects[subjects.length - 1]) {
                      handleSubmitTest();
                    } else {
                      const currentIndex = subjects.indexOf(currentSubject);
                      setCurrentSubject(subjects[currentIndex + 1]);
                      setCurrentQuestion(0);
                    }
                  }}
                  className="gap-2"
                >
                  {currentSubject === subjects[subjects.length - 1] ? (
                    <>
                      <Check className="h-4 w-4" />
                      Submit Test
                    </>
                  ) : (
                    <>
                      Next Subject
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(currentTest.questions.length - 1, prev + 1)
                    )
                  }
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-20">
              <QuestionNavigator
                totalQuestions={currentTest.questions.length}
                currentQuestion={currentQuestion}
                answeredQuestions={Object.keys(answers[currentSubject] || {}).map(id => 
                  currentTest.questions.findIndex(q => q.id === id)
                ).filter(index => index !== -1)}
                markedQuestions={markedQuestions[currentSubject] || new Set()}
                onQuestionSelect={setCurrentQuestion}
              />
              
              <Card className="mt-4 bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold">Test Security</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Exiting fullscreen or switching tabs may result in test termination. 
                    You have {3 - exitAttempts} warnings remaining.
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div className={`h-2 w-2 rounded-full ${isFullScreen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{isFullScreen ? 'Fullscreen active' : 'Fullscreen inactive'}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleSubmitTest} 
                variant="destructive" 
                className="w-full mt-4"
              >
                End Test Early
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}