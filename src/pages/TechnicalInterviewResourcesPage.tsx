import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Bell, User, Search,
  ArrowLeft, LogOut, Code,
  BookOpen, BrainCircuit, Network,
  ChevronRight, Target, FileText, Video,
  PenTool, Globe, Server
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
  frontend: [
    {
      id: 1,
      title: "HTML Fundamentals",
      description: "Learn the structure and semantic elements of HTML",
      type: "video",
      duration: "30 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "CSS Mastery",
      description: "Flexbox, Grid, and responsive design techniques",
      type: "video",
      duration: "45 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "JavaScript Essentials",
      description: "Core concepts, DOM manipulation, and ES6+ features",
      type: "pdf",
      pages: 80,
      progress: 0,
      link: "#"
    },
    {
      id: 4,
      title: "Frontend Interview Questions",
      description: "Common frontend interview questions and solutions",
      type: "practice",
      problems: 25,
      progress: 0,
      link: "#"
    }
  ],
  dsa: [
    {
      id: 1,
      title: "Basic DSA Concepts",
      description: "Arrays, linked lists, stacks, queues, and basic algorithms",
      type: "video",
      duration: "50 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Advanced Data Structures",
      description: "Trees, graphs, heaps, and hash tables with implementation examples",
      type: "pdf",
      pages: 110,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Algorithms Analysis",
      description: "Time and space complexity, Big O notation explained",
      type: "video",
      duration: "40 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 4,
      title: "DSA Practice Problems",
      description: "Solve common DSA interview questions with step-by-step solutions",
      type: "practice",
      problems: 30,
      progress: 0,
      link: "#"
    }
  ],
  languages: [
    {
      id: 1,
      title: "Python Fundamentals",
      description: "Syntax, data structures, and Python-specific features",
      type: "video",
      duration: "55 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "C++ Programming",
      description: "Core C++ concepts, STL, and memory management",
      type: "pdf",
      pages: 120,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "JavaScript for Interviews",
      description: "Closures, promises, async/await, and JS interview topics",
      type: "video",
      duration: "60 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 4,
      title: "Coding Challenges",
      description: "Language-specific coding challenges to test your skills",
      type: "practice",
      problems: 25,
      progress: 0,
      link: "#"
    }
  ],
  backend: [
    {
      id: 1,
      title: "Django Framework",
      description: "MVT architecture, ORM, and building REST APIs with Django",
      type: "video",
      duration: "65 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Flask Microframework",
      description: "Building lightweight web applications with Flask",
      type: "pdf",
      pages: 75,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Node.js Essentials",
      description: "Event loop, Express.js, and asynchronous programming",
      type: "video",
      duration: "55 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 4,
      title: "Backend System Design",
      description: "Design patterns, API development, and database optimization",
      type: "practice",
      problems: 15,
      progress: 0,
      link: "#"
    }
  ],
  systemDesign: [
    {
      id: 1,
      title: "System Design Fundamentals",
      description: "Scalability, reliability, and distributed systems concepts",
      type: "video",
      duration: "70 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Database Design",
      description: "SQL vs NoSQL, indexing, and query optimization",
      type: "pdf",
      pages: 90,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Microservices Architecture",
      description: "Building and deploying microservices-based applications",
      type: "video",
      duration: "45 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 4,
      title: "System Design Case Studies",
      description: "Design TinyURL, Twitter, Netflix, and other popular systems",
      type: "practice",
      problems: 8,
      progress: 0,
      link: "#"
    }
  ]
};

export default function TechnicalInterviewResourcesPage() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("frontend");

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
                <p className="text-muted-foreground">Master HTML, CSS, JavaScript, DSA, Python, C++, Django, Flask, Node.js and more</p>
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
              variant={activeTab === "frontend" ? "default" : "ghost"}
              onClick={() => setActiveTab("frontend")}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span>HTML, CSS & JavaScript</span>
            </Button>
            <Button
              variant={activeTab === "dsa" ? "default" : "ghost"}
              onClick={() => setActiveTab("dsa")}
              className="flex items-center gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Data Structures & Algorithms</span>
            </Button>
            <Button
              variant={activeTab === "languages" ? "default" : "ghost"}
              onClick={() => setActiveTab("languages")}
              className="flex items-center gap-2"
            >
              <PenTool className="h-4 w-4" />
              <span>Python & C++</span>
            </Button>
            <Button
              variant={activeTab === "backend" ? "default" : "ghost"}
              onClick={() => setActiveTab("backend")}
              className="flex items-center gap-2"
            >
              <Server className="h-4 w-4" />
              <span>Django, Flask & Node.js</span>
            </Button>
            <Button
              variant={activeTab === "systemDesign" ? "default" : "ghost"}
              onClick={() => setActiveTab("systemDesign")}
              className="flex items-center gap-2"
            >
              <Network className="h-4 w-4" />
              <span>System Design</span>
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
                <Link href="/interview-payment">
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