import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { Redirect, Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollText, Award, ArrowLeft, Download, CheckCircle, ChevronRight, Calendar, Clock, FileText, LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { subjects } from "@/shared/schema";
import { useState } from "react";

// Define the allowed colors type to provide type safety
type CertificateColor = 'amber' | 'blue' | 'green' | 'purple';

// Update the certificate interface
interface Certificate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: CertificateColor;
  progress: number;
  issuedDate: string | null;
  requiredProgress: number;
}

export default function CertificatePage() {
  const { user, loading } = useAuth();
  const { progress } = useProgress();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"available" | "progress">("available");

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

  // Prepare certificate data
  const overallProgress = calculateOverallProgress();
  
  // Update the certificates array with the new type
  const certificates: Certificate[] = [
    {
      id: "prep-cert",
      name: "NSAT Preparation Certificate",
      description: "Awarded for completing all study materials in the NSAT preparation program.",
      icon: ScrollText,
      color: "amber",
      progress: overallProgress,
      issuedDate: overallProgress === 100 ? new Date().toLocaleDateString() : null,
      requiredProgress: 100
    },
    {
      id: "exam-cert",
      name: "NSAT Exam Completion",
      description: "Awarded for successfully completing the NSAT examination.",
      icon: Award,
      color: "blue",
      progress: 0,
      issuedDate: null,
      requiredProgress: 100
    },
    {
      id: "achievement-cert",
      name: "Excellence in Mathematics",
      description: "Awarded for scoring above 90% in the Mathematics sections of NSAT.",
      icon: Award,
      color: "green",
      progress: 0,
      issuedDate: null,
      requiredProgress: 100
    },
    {
      id: "participation-cert",
      name: "NSAT Participation",
      description: "Awarded for participating in the NSAT program.",
      icon: Award,
      color: "purple",
      progress: overallProgress > 50 ? 100 : (overallProgress * 2),
      issuedDate: overallProgress > 50 ? new Date().toLocaleDateString() : null,
      requiredProgress: 50
    }
  ];

  const availableCertificates = certificates.filter(cert => cert.progress >= cert.requiredProgress);
  const inProgressCertificates = certificates.filter(cert => cert.progress < cert.requiredProgress);

  // Update the utility functions with proper type checking
  const getCardClasses = (color: CertificateColor): string => {
    const classes: Record<CertificateColor, string> = {
      amber: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
      blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
      green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
      purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
    };
    return classes[color];
  };

  const getIconContainerClasses = (color: CertificateColor): string => {
    const classes: Record<CertificateColor, string> = {
      amber: "h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center",
      blue: "h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center",
      green: "h-12 w-12 rounded-full bg-green-100 flex items-center justify-center",
      purple: "h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center"
    };
    return classes[color];
  };

  const getIconClasses = (color: CertificateColor): string => {
    const classes: Record<CertificateColor, string> = {
      amber: "h-6 w-6 text-amber-600",
      blue: "h-6 w-6 text-blue-600",
      green: "h-6 w-6 text-green-600",
      purple: "h-6 w-6 text-purple-600"
    };
    return classes[color];
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Certificates</h1>
            <p className="text-muted-foreground">View and download your earned certificates</p>
          </div>
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => setLocation("/checkout")}
          >
            <Award className="h-4 w-4 mr-2" />
            Upgrade for More Certificates
          </Button>
        </div>

        <Tabs defaultValue={activeTab} className="mb-8" onValueChange={(value) => setActiveTab(value as "available" | "progress")}>
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="available" className="relative">
              Available
              {availableCertificates.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {availableCertificates.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-6">
            {availableCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCertificates.map(cert => (
                  <motion.div 
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={getCardClasses(cert.color)}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-start gap-3">
                            <div className={getIconContainerClasses(cert.color)}>
                              <cert.icon className={getIconClasses(cert.color)} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{cert.name}</h3>
                              <p className="text-muted-foreground text-sm">{cert.description}</p>
                              {cert.issuedDate && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>Issued on {cert.issuedDate}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <CheckCircle className={getIconClasses(cert.color)} />
                        </div>
                        
                        <div className="mt-6">
                          <Button className="w-full md:w-auto">
                            <Download className="h-4 w-4 mr-2" />
                            Download Certificate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Certificates Available Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Complete course materials and requirements to earn certificates that will appear here.
                </p>
                <Button onClick={() => setActiveTab("progress")}>View Certificates in Progress</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgressCertificates.map(cert => (
                <motion.div 
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <cert.icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{cert.name}</h3>
                            <p className="text-muted-foreground text-sm">{cert.description}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center border">
                          <p className="font-bold text-muted-foreground">{Math.round(cert.progress)}%</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Progress value={cert.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {Math.round(cert.requiredProgress - cert.progress)}% more to unlock
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline" disabled className="w-full md:w-auto">
                          <Clock className="h-4 w-4 mr-2" />
                          {Math.round(cert.progress)}% Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Ready for NSAT Exam?</h3>
                    <p className="text-muted-foreground">Register for the exam to earn your completion certificate</p>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                    Register for Exam
                    <ChevronRight className="h-4 w-4 ml-2" />
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