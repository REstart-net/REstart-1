import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { Redirect, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, GraduationCap, BookOpen, BrainCircuit, Award, Target, ChevronRight, Clock, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { subjects, type Subject } from "@/shared/schema";
import { useRef, useState } from "react";

const icons = {
  "Basic Mathematics": FileText,
  "Advanced Mathematics": GraduationCap,
  "English": BookOpen,
  "Logical Reasoning": BrainCircuit,
} as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const { progress, isLoading: progressLoading } = useProgress();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const referralLink = "https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral?utm_source=referral&utm_medium=santoshpuvvada13&utm_campaign=btech-computer-science-portal-referral";
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!progress) return 0;
    
    let totalCompleted = 0;
    let totalPossible = 0;
    
    subjects.forEach(subject => {
      const subjectProgress = progress[subject];
      if (subjectProgress) {
        totalCompleted += subjectProgress.completedMaterials.length;
        totalPossible += 10; // Assuming 10 materials per subject
      }
    });
    
    return totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  };

  // Calculate average score across all subjects
  const calculateAverageScore = () => {
    if (!progress) return 0;
    
    let totalScore = 0;
    let totalSubjectsWithTests = 0;
    
    subjects.forEach(subject => {
      const subjectProgress = progress[subject];
      if (subjectProgress && subjectProgress.completedTests > 0) {
        totalScore += subjectProgress.totalScore / subjectProgress.completedTests;
        totalSubjectsWithTests++;
      }
    });
    
    return totalSubjectsWithTests > 0 ? totalScore / totalSubjectsWithTests : 0;
  };

  const overallProgress = calculateOverallProgress();
  const averageScore = calculateAverageScore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://media-hosting.imagekit.io//e60a0a3fac904c2a/WhatsApp_Image_2025-01-26_at_20.14.19-removebg-preview%20(3).png?Expires=1834242508&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nVFdXSeeo14FtjV6G~ppAgawYVuWM5ZBFu3VmE~6EUH79Qe3QJ479US4D8pggGisa~3D5nKS0ICnJFBkwZyIV8iDLMX6LMTxPnoH9OkOnaYACbTTPgISyWVxr33MreB2LGvj0ePD5wi-weKMOaF-jYY9nr0AXGiYtUbOpCvRgws7RsDMKcTtO8xA~HP9Jim90PxyNhfp1842BWY~GDnlguAKH87V-Q-5RB8JJ6q~-wO9gX-ScIP26GqRVmXMQPmo4uuA6JH4fVvc1MjUKbBHtQBZ-3xFP0pAJax3I2lVLNX1EP2kHTpJuUTwwnLBCnkMNwst3BinXaixwg6I~kdkLw__"
              alt="REstart LMS"
              className="h-8 w-auto"
            />
            
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => signOut && signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Referral Section */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-600 mb-2">Refer a Friend and Get Exam Fee Discount</h2>
              <p className="text-muted-foreground mb-4">
                Invite your friends to join our NSAT preparation program, and you can take the exam for free (worth ₹900)!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral?utm_source=referral&utm_medium=santoshpuvvada13&utm_campaign=btech-computer-science-portal-referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Register for Exam <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto" 
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy Referral Link
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/referral-illustration.svg" 
                alt="Refer a friend"
                className="w-48 h-48 object-contain"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.user_metadata?.full_name || user.email}</h1>
            <p className="text-muted-foreground">Track your progress and prepare for the NSAT exam</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Overall Progress</h3>
                    <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
                  </div>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-green-500/5 border-green-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Average Score</h3>
                    <p className="text-2xl font-bold">{Math.round(averageScore)}%</p>
                  </div>
                </div>
                <Progress value={averageScore} className="h-2 bg-green-500/20" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-orange-500/5 border-orange-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Study Time</h3>
                    <p className="text-2xl font-bold">47h</p>
                  </div>
                </div>
                <Progress value={70} className="h-2 bg-orange-500/20" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {subjects.map((subject, index) => {
            const subjectProgress = progress?.[subject] || {
              completedTests: 0,
              totalScore: 0,
              completedMaterials: [],
            };

            const Icon = icons[subject];
            const encodedSubject = encodeURIComponent(subject);

            return (
              <motion.div key={index} variants={item}>
                <Link href={`/subjects/${encodedSubject}`}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold mb-1">{subject}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Award className="h-4 w-4" />
                              <span>{subjectProgress.completedTests} tests completed</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-muted-foreground">Study Progress</span>
                            <span className="font-medium">
                              {subjectProgress.completedMaterials.length}/10 materials
                            </span>
                          </div>
                          <Progress
                            value={subjectProgress.completedMaterials.length * 10}
                            className="h-2"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span>Average Score</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              subjectProgress.completedTests
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {subjectProgress.completedTests
                                ? `${Math.round(
                                    subjectProgress.totalScore / subjectProgress.completedTests
                                  )}%`
                                : 'No tests'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Ready for a Challenge?</h3>
                    <p className="text-muted-foreground">Take a full mock test to assess your preparation</p>
                  </div>
                </div>
                <Link href="/full-mock-test">
                  <Button className="bg-primary/90 hover:bg-primary">
                    Start Mock Test
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}