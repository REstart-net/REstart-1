import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Bell, User, Search,
  ArrowLeft, LogOut, Clock, CheckCircle2, IndianRupee
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InterviewBookingModal } from "@/components/InterviewBookingModal";

const mockInterviewQuestions = [
  {
    id: 1,
    question: "What is your NSAT score?",
    difficulty: "Easy",
    category: "Admission Qualification",
    purpose: "To evaluate performance in the entrance exam",
    answer: "My NSAT score was 8.9 in 10. I focused on problem-solving and time management during the test, especially in the logical reasoning section."
  },
  {
    id: 2,
    question: "What was your JEE Mains/Advanced rank (if appeared)?",
    difficulty: "Easy",
    category: "Academic Background",
    purpose: "Understand other entrance exams attempted and performance",
    answer: "I appeared for JEE Mains and scored a percentile of 91. While I qualified, I was more interested in a practical, hands-on learning model like Newton School of Technology offers."
  },
  {
    id: 3,
    question: "Why do you want to join Newton School of Technology?",
    difficulty: "Medium",
    category: "Motivation & Career Goals",
    purpose: "Assess interest in the program and alignment with the college's vision",
    answer: "I'm drawn to Newton School of Technology because of its industry-focused curriculum and emphasis on real-world projects. The idea of being mentored by professionals and working on actual products during college is exciting and aligns with my goal to become a software developer who's ready for the industry from day one."
  },
  {
    id: 4,
    question: "What excites you the most about the curriculum at Newton School of Technology?",
    difficulty: "Medium",
    category: "Vision & Interest",
    purpose: "To check if the student has researched the college",
    answer: "The most exciting part is the integration of core CS subjects with regular hands-on coding and hackathons. I like that we won't just learn theory but actually build projects, collaborate with teams, and understand how things work in the tech world."
  },
  {
    id: 5,
    question: "How did you prepare for NSAT?",
    difficulty: "Easy",
    category: "Self-preparation",
    purpose: "Get insights into student's discipline and approach to problem-solving",
    answer: "I started my preparation with REstart, a student-focused platform that provides daily quizzes, full-length mock tests, and PDFs covering NSAT topics like logical reasoning, aptitude, and basic math. It really helped me stay consistent. I also used YouTube for concept clarity, practiced reasoning questions on PrepInsta, and solved mock problems on HackerRank. The combination of structured material from REstart and practice from other platforms gave me a good balance between learning and testing."
  },
  {
    id: 6,
    question: "Have you worked on any technical projects or participated in coding competitions?",
    difficulty: "Medium",
    category: "Extracurriculars",
    purpose: "Understand hands-on experience and tech exposure",
    answer: "Yes, I recently built a basic portfolio website using HTML, CSS, and JavaScript. I also participated in a coding contest on CodeChef where I solved two problems under the time limit. I'm constantly exploring ways to build and improve."
  },
  {
    id: 7,
    question: "What are your career goals and how does Newton School of Technology align with them?",
    difficulty: "Medium",
    category: "Career Vision",
    purpose: "Evaluate long-term planning and passion for tech",
    answer: "My long-term goal is to become a software engineer who contributes to open-source and also builds meaningful tech products. Newton's curriculum, with its mix of tech and real-world exposure, is ideal for gaining both skills and confidence in that journey."
  },
  {
    id: 8,
    question: "Tell us about a time when you overcame a major challenge in your academic journey.",
    difficulty: "Medium-Hard",
    category: "Personal Development",
    purpose: "Soft skills evaluation (grit, perseverance, problem-solving)",
    answer: "During the pandemic, I had to study entirely online with limited internet. I self-taught many concepts using PDFs and YouTube. It taught me self-discipline and how to find learning resources on my own."
  }
];

export default function InterviewResourcesPage() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold">NSAT Mock Interviews</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut && signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <header className="hidden lg:flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">NSAT Mock Interviews</h1>
                <p className="text-muted-foreground">Practice with real NSAT interview questions and book mock interview sessions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search questions..."
                  className="w-60 bg-background pl-8 pr-4 py-2"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut && signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interview Package */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Mock Interview Package</CardTitle>
                <CardDescription>One-on-one interview practice with NSAT experts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    100
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">per interview</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">45-minute one-on-one session with NSAT expert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Personalized feedback and improvement areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Real NSAT interview questions and scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Flexible scheduling options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Recorded session for later review (optional)</span>
                  </li>
                </ul>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4" />
                  <span>Next available: Tomorrow, 10:00 AM</span>
                </div>
              </CardContent>
              <CardFooter>
                <InterviewBookingModal />
              </CardFooter>
            </Card>

            {/* Sample Questions */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Sample NSAT Interview Questions</h2>
              
              {mockInterviewQuestions.map((q) => (
                <Card key={q.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{q.question}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          q.difficulty === "Easy" 
                            ? "bg-green-100 text-green-700" 
                            : q.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : q.difficulty === "Medium-Hard"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{q.category}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold mb-2">
                                {q.question}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  q.difficulty === "Easy" 
                                    ? "bg-green-100 text-green-700" 
                                    : q.difficulty === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : q.difficulty === "Medium-Hard"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-sm text-muted-foreground">{q.category}</span>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Purpose:</h4>
                                <p className="text-sm text-muted-foreground">{q.purpose}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Sample Answer:</h4>
                                <p className="text-sm leading-relaxed">{q.answer}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-sm text-muted-foreground italic">{q.purpose}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center">
                <Button variant="outline">Load More Questions</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 