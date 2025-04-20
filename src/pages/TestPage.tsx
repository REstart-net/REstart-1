import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { TestTimer } from "@/components/test/test-timer";
import { QuestionCard } from "@/components/test/question-card";
import { QuestionNavigator } from "@/components/test/question-navigator";
import { TestInstructions } from "@/components/test/test-instructions";
import { generateTest, calculateScore, generateFullTest } from "@/lib/test-generator";
import { useProgress } from "@/hooks/use-progress";
import { Subject, subjects } from "@/shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Flag, Check, AlertCircle, CheckCircle, Zap, Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { hasAttemptedTest, recordTestAttempt } from "@/lib/api";
import { AutoNsatVerification } from "@/components/AutoNsatVerification";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  const [, setLocation] = useLocation();
  const { subject: encodedSubject } = useParams<{ subject: string }>();
  const subject = decodeURIComponent(encodedSubject) as Subject;
  const { updateProgress } = useProgress();
  const { user } = useAuth();
  const [location] = useLocation();
  const isFullTest = location.includes('/full-test');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [test, setTest] = useState<Awaited<ReturnType<typeof generateTest>> | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [verifyingNsatRegistration, setVerifyingNsatRegistration] = useState(false);
  const [hasNsatVerification, setHasNsatVerification] = useState(false);
  const [hasReferral, setHasReferral] = useState(false);

  // Validate subject and redirect if invalid
  useEffect(() => {
    if (!subjects.includes(subject)) {
      console.error(`Invalid subject: "${subject}"`);
      setError(`Invalid subject: "${subject}". Please navigate to a valid subject page.`);
      setLoading(false);
    }
  }, [subject, setLocation]);

  // Check if user has already attempted the test
  useEffect(() => {
    async function checkPreviousAttempt() {
      if (!user) return;
      
      try {
        const attempted = await hasAttemptedTest(user.id, subject);
        setHasAttempted(attempted);
      } catch (err) {
        console.error(`Error checking test attempts:`, err);
      }
    }
    
    if (subjects.includes(subject)) {
      checkPreviousAttempt();
    }
  }, [subject, user]);

  useEffect(() => {
    async function loadTest() {
      try {
        console.log(`Loading ${isFullTest ? 'full' : 'practice'} test for subject: ${subject}`);
        setLoading(true);
        
        let generatedTest;
        if (isFullTest) {
          generatedTest = await generateFullTest(subject);
          console.log(`Full test loaded successfully for ${subject} with ${generatedTest.questions.length} questions`);
        } else {
          generatedTest = await generateTest(subject);
          console.log(`Practice test loaded successfully for ${subject} with ${generatedTest.questions.length} questions`);
        }
        
        setTest(generatedTest);
        setLoading(false);
      } catch (err) {
        console.error(`Error loading test for ${subject}:`, err);
        setError(err instanceof Error ? err.message : `Failed to load test for ${subject}`);
        setLoading(false);
      }
    }
    if (subjects.includes(subject) && !hasAttempted) {
      loadTest();
    } else if (hasAttempted) {
      setLoading(false);
    }
  }, [subject, hasAttempted, isFullTest]);

  // Monitor fullscreen status
  useEffect(() => {
    const handleFullScreenChange = () => {
      // We track this but don't use it directly - it's for potential future features
      const isInFullscreen = !!document.fullscreenElement;
      console.log("Fullscreen status changed:", isInFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const startTest = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(err => {
          console.warn('Failed to enter fullscreen:', err);
          // Continue test even if fullscreen fails
        });
      }
      setTestStarted(true);
    } catch (err) {
      console.error("Could not enter fullscreen mode:", err);
      // Allow the test to start even if fullscreen fails
      setTestStarted(true);
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleMarkQuestion = () => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleSubmitTest = async () => {
    if (!test || !user) return;
    
    const result = calculateScore(test, answers);
    setShowResults(true);

    try {
      // Record this test attempt
      await recordTestAttempt(
        user.id,
        subject,
        test.id,
        (result.score / result.total) * 100
      );
      
      // Update user progress
      await updateProgress(subject, {
        completedTests: 1,
        totalScore: (result.score / result.total) * 100,
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
      // We still show results even if progress update fails
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(err => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  // Add new useEffect to check referral status
  useEffect(() => {
    async function checkReferralStatus() {
      if (!user) {
        setHasReferral(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_referrals')
          .select('*')
          .eq('user_id', user.id)
          .not('verified_at', 'is', null)
          .limit(1);

        if (error) throw error;
        
        setHasReferral(data && data.length > 0);
      } catch (err) {
        console.error('Error checking referral status:', err);
        setHasReferral(false);
      }
    }

    checkReferralStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading {isFullTest ? 'full' : 'practice'} test for {subject}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Test</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => setLocation(`/subjects/${encodedSubject}`)}>
            Return to Subject Page
          </Button>
        </Card>
      </div>
    );
  }

  if (hasAttempted) {
    if (verifyingNsatRegistration && !hasNsatVerification && user) {
      return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
          <AutoNsatVerification 
            userId={user.id}
            userEmail={user.email || ''}
            onVerified={() => {
              setHasNsatVerification(true);
              setHasAttempted(false); // Allow the user to take the test again
              setLoading(true); // Trigger reloading the test
            }}
            onSkip={() => setVerifyingNsatRegistration(false)}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center py-8 px-4">
        <Card className="max-w-md mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>Test Already Attempted</CardTitle>
            </div>
            <CardDescription>
              You have already taken this test. Each test can only be attempted once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your NSAT registration status will be automatically verified to unlock unlimited test attempts.
            </p>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation(`/subjects/${encodedSubject}`)}
            >
              Return to Subject
            </Button>
            <Button 
              onClick={() => setVerifyingNsatRegistration(true)}
              variant="default"
            >
              Verify Now
            </Button>
          </CardFooter>
        </Card>
        
        {/* Upgrade Package Section */}
        <div className="max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Unlock Unlimited Test Attempts</h2>
          <p className="text-center text-muted-foreground mb-8">
            Upgrade your package to take unlimited tests and maximize your preparation!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Premium Package */}
            <Card className="border-primary relative shadow-lg">
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Premium</span>
                  <Zap className="h-5 w-5 text-primary" />
                </CardTitle>
                <CardDescription>Complete NSAT success kit</CardDescription>
                <div className="mt-2">
                  <p className="text-3xl font-bold">₹{hasReferral ? 200 : 500}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm"><span className="font-medium">Unlimited</span> practice tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Comprehensive study materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Priority email & chat support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">2 free mock interviews</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default" onClick={() => setLocation('/checkout/premium')}>
                  Go Premium
                </Button>
              </CardFooter>
            </Card>

            {/* Platinum Package */}
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Platinum</span>
                  <Award className="h-5 w-5 text-violet-500" />
                </CardTitle>
                <CardDescription>Advanced NSAT mastery</CardDescription>
                <div className="mt-2">
                  <p className="text-3xl font-bold">₹{hasReferral ? 500 : 800}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm"><span className="font-medium">Everything</span> in Premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">1-on-1 mentorship (4 sessions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Personalized study plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">4 mock interviews with feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Direct admission support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setLocation('/checkout/platinum')}>
                  Go Platinum
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Test Not Available</h2>
          <p className="text-muted-foreground mb-6">The test for {subject} could not be loaded. Please try again later.</p>
          <Button onClick={() => setLocation(`/subjects/${encodedSubject}`)}>
            Return to Subject Page
          </Button>
        </Card>
      </div>
    );
  }

  if (!testStarted && test) {
    return (
      <div className="min-h-screen pt-8 px-4 md:px-8">
        <TestInstructions 
          subject={subject}
          totalQuestions={test.questions.length}
          duration={test.duration}
          onStart={startTest}
          isFullMockTest={isFullTest}
        />
      </div>
    );
  }

  if (showResults) {
    const result = calculateScore(test, answers);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <Card className="p-6 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
            <p className="text-muted-foreground">
              You scored {result.score} out of {result.total} ({Math.round(result.percentage)}%)
            </p>
          </div>

          <div className="space-y-8">
            {/* Display incorrect questions if needed */}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => setLocation(`/subjects/${encodedSubject}`)}>
              Return to Subject Page
            </Button>
          </div>
        </Card>

        {/* Upgrade Package Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-6">Unlock More Practice Tests</h2>
          <p className="text-center text-muted-foreground mb-8">
            You have used your free test attempt. Upgrade your package to unlock unlimited tests and boost your preparation!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Premium Package */}
            <Card className="border-primary relative shadow-lg">
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  MOST POPULAR
                </span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Premium</span>
                  <Zap className="h-5 w-5 text-primary" />
                </CardTitle>
                <CardDescription>Complete NSAT success kit</CardDescription>
                <div className="mt-2">
                  <p className="text-3xl font-bold">₹{hasReferral ? 200 : 500}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm"><span className="font-medium">Unlimited</span> practice tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Comprehensive study materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Priority email & chat support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">2 free mock interviews</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default" onClick={() => setLocation('/checkout/premium')}>
                  Go Premium
                </Button>
              </CardFooter>
            </Card>

            {/* Platinum Package */}
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Platinum</span>
                  <Award className="h-5 w-5 text-violet-500" />
                </CardTitle>
                <CardDescription>Advanced NSAT mastery</CardDescription>
                <div className="mt-2">
                  <p className="text-3xl font-bold">₹{hasReferral ? 500 : 800}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm"><span className="font-medium">Everything</span> in Premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">1-on-1 mentorship (4 sessions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Personalized study plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">4 mock interviews with feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Direct admission support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setLocation('/checkout/platinum')}>
                  Go Platinum
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }

  // Get array of question indices that have been answered
  const answeredIndices = Object.keys(answers).map(id => 
    test.questions.findIndex(q => q.id === id)
  ).filter(index => index !== -1);

  // Convert Set to Array for marked questions
  const markedIndices = Array.from(markedQuestions);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <TestTimer duration={test.duration} onTimeUp={handleTimeUp} />
              <Button
                variant="outline"
                onClick={handleMarkQuestion}
                className="gap-2"
              >
                <Flag className="h-4 w-4" />
                {markedQuestions.has(currentQuestion) ? "Unmark" : "Mark"} for Review
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <QuestionCard
                  question={test.questions[currentQuestion]}
                  selectedAnswer={answers[test.questions[currentQuestion].id]}
                  onAnswerSelect={(answerId) =>
                    handleAnswerSelect(test.questions[currentQuestion].id, answerId)
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
              {currentQuestion === test.questions.length - 1 ? (
                <Button onClick={handleSubmitTest} className="gap-2">
                  <Check className="h-4 w-4" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(test.questions.length - 1, prev + 1)
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

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Navigation</h3>
              <QuestionNavigator
                totalQuestions={test.questions.length}
                currentQuestion={currentQuestion}
                answeredQuestions={answeredIndices}
                markedQuestions={markedIndices}
                onQuestionSelect={setCurrentQuestion}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Questions</span>
                  <span className="font-medium">{test.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Answered</span>
                  <span className="font-medium">{Object.keys(answers).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Marked for Review</span>
                  <span className="font-medium">{markedQuestions.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unanswered</span>
                  <span className="font-medium">
                    {test.questions.length - Object.keys(answers).length}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmitTest} className="w-full gap-2">
              <Check className="h-4 w-4" />
              Submit Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}