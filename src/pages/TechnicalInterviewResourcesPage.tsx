import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Bell, User, Search,
  ArrowLeft, LogOut, Code,
  BookOpen, BrainCircuit, Network,
  ChevronRight, Target, FileText, Video
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
import { Progress } from "@/components/ui/progress";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  duration?: string;
  pages?: number;
  problems?: number;
  progress: number;
  link: string;
}

const technicalResources = {
  dsa: [
    {
      id: 1,
      title: "Data Structures Fundamentals",
      description: "Learn about arrays, linked lists, stacks, queues, and trees",
      type: "video",
      duration: "45 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Algorithms Mastery",
      description: "Sorting, searching, and graph algorithms explained",
      type: "pdf",
      pages: 120,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Problem Solving Patterns",
      description: "Common patterns and techniques for solving coding problems",
      type: "video",
      duration: "60 mins",
      progress: 0,
      link: "#"
    }
  ],
  systemDesign: [
    {
      id: 1,
      title: "System Design Basics",
      description: "Introduction to distributed systems and scalability",
      type: "video",
      duration: "50 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Database Design",
      description: "SQL, NoSQL, and database optimization techniques",
      type: "pdf",
      pages: 150,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Microservices Architecture",
      description: "Building scalable and maintainable systems",
      type: "video",
      duration: "55 mins",
      progress: 0,
      link: "#"
    }
  ],
  codingPractice: [
    {
      id: 1,
      title: "String Manipulation",
      description: "Practice problems on string operations and algorithms",
      type: "practice",
      problems: 20,
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Array Problems",
      description: "Common array manipulation and searching problems",
      type: "practice",
      problems: 25,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Tree Traversal",
      description: "Binary tree problems and traversal techniques",
      type: "practice",
      problems: 15,
      progress: 0,
      link: "#"
    }
  ]
};

export default function TechnicalInterviewResourcesPage() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dsa");

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

  const renderResourceCard = (resource: Resource) => {
    const getIcon = () => {
      switch (resource.type) {
        case "video":
          return <Video className="h-5 w-5" />;
        case "pdf":
          return <FileText className="h-5 w-5" />;
        case "practice":
          return <Code className="h-5 w-5" />;
        default:
          return <BookOpen className="h-5 w-5" />;
      }
    };

    const getDetails = () => {
      switch (resource.type) {
        case "video":
          return <span className="text-sm text-muted-foreground">{resource.duration}</span>;
        case "pdf":
          return <span className="text-sm text-muted-foreground">{resource.pages} pages</span>;
        case "practice":
          return <span className="text-sm text-muted-foreground">{resource.problems} problems</span>;
        default:
          return null;
      }
    };

    return (
      <Card key={resource.id} className="hover:shadow-md transition-all">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
              {getDetails()}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <Progress value={resource.progress} className="h-1 mt-4" />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/interview-resources">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold">Technical Interview Prep</h1>
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
              <Link href="/interview-resources">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Technical Interview Preparation</h1>
                <p className="text-muted-foreground">Master DSA, System Design, and coding problems</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources..."
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

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <Button
              variant={activeTab === "dsa" ? "default" : "ghost"}
              onClick={() => setActiveTab("dsa")}
              className="flex items-center gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Data Structures & Algorithms</span>
            </Button>
            <Button
              variant={activeTab === "systemDesign" ? "default" : "ghost"}
              onClick={() => setActiveTab("systemDesign")}
              className="flex items-center gap-2"
            >
              <Network className="h-4 w-4" />
              <span>System Design</span>
            </Button>
            <Button
              variant={activeTab === "codingPractice" ? "default" : "ghost"}
              onClick={() => setActiveTab("codingPractice")}
              className="flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              <span>Coding Practice</span>
            </Button>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalResources[activeTab as keyof typeof technicalResources].map(renderResourceCard)}
          </div>

          {/* Mock Interview CTA */}
          <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Ready for a Technical Mock Interview?</h3>
                    <p className="text-sm text-muted-foreground">Practice with our expert interviewers and get detailed feedback</p>
                  </div>
                </div>
                <Link href="/interview-resources">
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto">
                    Book Mock Interview
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 