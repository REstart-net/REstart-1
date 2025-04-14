import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Bell, User, Search,
  ArrowLeft, LogOut,
  BookOpen, MessageSquare, 
  ChevronRight, FileText, Video
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
  scenarios?: number;
  progress: number;
  link: string;
}

const softSkillsResources = {
  communication: [
    {
      id: 1,
      title: "Effective Communication Skills",
      description: "Learn how to articulate your thoughts clearly and concisely",
      type: "video",
      duration: "40 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Communication Frameworks",
      description: "Structured approaches to communicating complex ideas",
      type: "pdf",
      pages: 85,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Active Listening Techniques",
      description: "How to listen effectively and respond appropriately",
      type: "video",
      duration: "35 mins",
      progress: 0,
      link: "#"
    }
  ],
  teamwork: [
    {
      id: 1,
      title: "Collaboration Fundamentals",
      description: "Working effectively in team environments",
      type: "video",
      duration: "45 mins",
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Conflict Resolution",
      description: "Strategies for navigating disagreements professionally",
      type: "pdf",
      pages: 110,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Team Dynamics",
      description: "Understanding roles and contributing effectively",
      type: "video",
      duration: "50 mins",
      progress: 0,
      link: "#"
    }
  ],
  problemSolving: [
    {
      id: 1,
      title: "Critical Thinking Scenarios",
      description: "Practice problem-solving with real-world scenarios",
      type: "practice",
      scenarios: 12,
      progress: 0,
      link: "#"
    },
    {
      id: 2,
      title: "Decision Making Frameworks",
      description: "Methods for making sound decisions under pressure",
      type: "pdf",
      pages: 95,
      progress: 0,
      link: "#"
    },
    {
      id: 3,
      title: "Adaptability and Flexibility",
      description: "Navigating change and uncertainty in the workplace",
      type: "practice",
      scenarios: 15,
      progress: 0,
      link: "#"
    }
  ]
};

export default function SoftSkillsInterviewResourcesPage() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("communication");

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
          return <MessageSquare className="h-5 w-5" />;
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
          return <span className="text-sm text-muted-foreground">{resource.scenarios} scenarios</span>;
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
            <h1 className="text-lg font-semibold">Soft Skills Interview Resources</h1>
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
                <h1 className="text-2xl font-bold">Soft Skills Interview Resources</h1>
                <p className="text-muted-foreground">Develop essential non-technical skills for interview success</p>
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

          {/* Resource tabs */}
          <div className="flex flex-col gap-6">
            <div className="border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("communication")}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === "communication"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  Communication
                </button>
                <button
                  onClick={() => setActiveTab("teamwork")}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === "teamwork"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  Teamwork
                </button>
                <button
                  onClick={() => setActiveTab("problemSolving")}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === "problemSolving"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  Problem Solving
                </button>
              </div>
            </div>

            {/* Resource list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === "communication" && softSkillsResources.communication.map(renderResourceCard)}
              {activeTab === "teamwork" && softSkillsResources.teamwork.map(renderResourceCard)}
              {activeTab === "problemSolving" && softSkillsResources.problemSolving.map(renderResourceCard)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 