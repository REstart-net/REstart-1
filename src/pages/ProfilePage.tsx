import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProgress } from "@/hooks/use-progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subjects } from "@/shared/schema";
import { BookOpen, Calendar, GraduationCap, Mail, Phone, User, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";

export default function ProfilePage() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    phoneNumber: user?.user_metadata?.phone_number || "",
    passingYear: user?.user_metadata?.passing_year || "",
  });

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!progress || Object.keys(progress || {}).length === 0) return 0;
    
    let totalProgress = 0;
    let subjectCount = 0;
    
    Object.entries(progress || {}).forEach(([, subjectProgress]) => {
      if (subjectProgress) {
        // Ensure progress value doesn't exceed 100%
        totalProgress += Math.min(subjectProgress.totalScore || 0, 100);
        subjectCount++;
      }
    });
    
    // Ensure the final percentage doesn't exceed 100%
    return subjectCount > 0 ? Math.min(Math.round(totalProgress / subjectCount), 100) : 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would update the user profile
    // through Supabase or other backend API
    console.log("Update profile with:", formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation("/auth")} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocation("/dashboard")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Profile Sidebar */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.user_metadata?.full_name || "User"}</CardTitle>
              <CardDescription className="truncate">{user.email}</CardDescription>
              
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant={user.user_metadata?.is_nsat_registered ? "success" : "secondary"}>
                  {user.user_metadata?.is_nsat_registered ? "NSAT Registered" : "Not Registered for NSAT"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="text-sm font-medium">{calculateOverallProgress()}%</span>
                </div>
                <Progress value={calculateOverallProgress()} className="h-2" />
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {user.user_metadata?.phone_number || "Not provided"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Passing Year</p>
                      <p className="font-medium">
                        {user.user_metadata?.passing_year || "Not provided"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passingYear">Passing Year</Label>
                    <Input
                      id="passingYear"
                      name="passingYear"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="Year of graduation"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Subject Progress</TabsTrigger>
                <TabsTrigger value="packages">My Packages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                    <CardDescription>Your account details and status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="h-5 w-5 text-primary" />
                              <span className="font-medium">NSAT Status</span>
                            </div>
                            {user.user_metadata?.is_nsat_registered ? (
                              <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Registered
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Not Registered
                              </Badge>
                            )}
                          </div>
                          
                          {!user.user_metadata?.is_nsat_registered && (
                            <div className="mt-4">
                              <Link href="/checkout">
                                <Button size="sm" className="w-full">Register for NSAT</Button>
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-primary" />
                              <span className="font-medium">Overall Progress</span>
                            </div>
                            <span className="font-medium">{calculateOverallProgress()}%</span>
                          </div>
                          <Progress value={calculateOverallProgress()} className="h-2" />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {progress && Object.keys(progress).length > 0 ? (
                            Object.entries(progress).map(([subject, subjectProgress]) => (
                              <div key={subject} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span>{subject}</span>
                                </div>
                                <span className="text-sm font-medium">
                                  {Math.min(subjectProgress.totalScore || 0, 100)}% complete
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-center py-4">
                              No recent activity found. Start taking tests to track your progress!
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                    <CardDescription>Track your progress across different subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {subjects.map(subject => {
                        const subjectProgress = progress?.[subject] || { totalScore: 0, completedTests: 0 };
                        // Ensure subject progress doesn't exceed 100%
                        const progressValue = Math.min(subjectProgress.totalScore || 0, 100);
                        return (
                          <div key={subject} className="space-y-2">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{subject}</span>
                                <Badge variant="outline" className="ml-2">
                                  {subjectProgress.completedTests || 0} tests
                                </Badge>
                              </div>
                              <span className="font-medium">{progressValue}%</span>
                            </div>
                            <Progress value={progressValue} className="h-2" />
                            <Link href={`/subjects/${encodeURIComponent(subject)}`}>
                              <Button variant="link" className="p-0 h-auto text-sm">
                                Go to {subject} materials
                              </Button>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="packages" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Packages</CardTitle>
                    <CardDescription>Your subscribed packages and benefits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.user_metadata?.is_nsat_registered ? (
                      <div className="space-y-4">
                        <Card className="border-2 border-green-600">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">NSAT Registration Complete</h3>
                                <p className="text-sm text-muted-foreground">
                                  You have successfully registered for the NSAT exam.
                                </p>
                              </div>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Exam Date</h4>
                              <p className="text-sm text-muted-foreground">
                                Your exam date will be announced soon. Please check your email for updates.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Package Benefits</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>1 NSAT exam attempt</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Access to free study materials</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>All subject chapterwise mock tests</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Additional benefits based on your package</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Packages Found</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't registered for the NSAT exam or purchased any packages yet.
                        </p>
                        <Link href="/checkout">
                          <Button>Register for NSAT</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
} 