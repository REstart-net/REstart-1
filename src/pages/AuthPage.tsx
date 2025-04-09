import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@/shared/schema";
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [examAttempt, setExamAttempt] = useState<number | null>(null);

  const loginForm = useForm<Pick<InsertUser, "email" | "password">>({
    resolver: zodResolver(insertUserSchema.pick({ email: true, password: true })),
    defaultValues: { email: "", password: "" }
  });

  const registerForm = useForm<InsertUser & { examAttempt?: number }>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      passingYear: new Date().getFullYear(),
      isNsatRegistered: false,
      examAttempt: null
    }
  });

  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 25 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-background/95">
            <CardContent className="pt-6">
              <Tabs defaultValue="login">
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="email"
                                  placeholder="Enter your email" 
                                  {...field} 
                                />
                                <AnimatePresence>
                                  {field.value && (
                                    <motion.span
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                      {loginForm.formState.errors.email ? (
                                        <X className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <Check className="h-4 w-4 text-green-500" />
                                      )}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter password"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </motion.div>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  {...field} 
                                />
                                <AnimatePresence>
                                  {field.value && (
                                    <motion.span
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                      {registerForm.formState.errors.email ? (
                                        <X className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <Check className="h-4 w-4 text-green-500" />
                                      )}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="tel" 
                                  placeholder="10-digit mobile number" 
                                  {...field} 
                                />
                                <AnimatePresence>
                                  {field.value && (
                                    <motion.span
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                      {registerForm.formState.errors.phoneNumber ? (
                                        <X className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <Check className="h-4 w-4 text-green-500" />
                                      )}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    calculatePasswordStrength(e.target.value);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            {field.value && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2"
                              >
                                <Progress value={passwordStrength} className={`h-1 ${getStrengthColor(passwordStrength)}`} />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Password strength: {passwordStrength <= 25 ? "Weak" : passwordStrength <= 50 ? "Fair" : passwordStrength <= 75 ? "Good" : "Strong"}
                                </p>
                              </motion.div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="passingYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>12th Class Passing Year</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              >
                                {yearOptions.map((year) => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="isNsatRegistered"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Are you registered for NSAT?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value === "true");
                                  if (value !== "true") {
                                    setExamAttempt(null);
                                    registerForm.setValue("examAttempt", null);
                                  }
                                }}
                                defaultValue={field.value.toString()}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="true" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="false" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="needsInterviewPrep"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Do you need interview preparation?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => field.onChange(value === "true")}
                                defaultValue={field.value ? "true" : "false"}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="true" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="false" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {registerForm.watch("isNsatRegistered") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pl-6"
                        >
                          <FormLabel>Which attempt are you preparing for?</FormLabel>
                          <div className="space-y-2">
                            {[1, 2, 3].map((attempt) => (
                              <div key={attempt} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`attempt-${attempt}`}
                                  checked={examAttempt === attempt}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setExamAttempt(attempt);
                                      registerForm.setValue("examAttempt", attempt);
                                    } else if (examAttempt === attempt) {
                                      setExamAttempt(null);
                                      registerForm.setValue("examAttempt", null);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`attempt-${attempt}`}
                                  className="text-sm font-normal"
                                >
                                  Attempt {attempt}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {registerForm.formState.errors.examAttempt && (
                            <p className="text-sm font-medium text-destructive">
                              {registerForm.formState.errors.examAttempt.message}
                            </p>
                          )}
                        </motion.div>
                      )}

                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </motion.div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:flex bg-muted items-center justify-center p-8"
      >
        <div className="max-w-md">
          <img
            src="https://media-hosting.imagekit.io//e60a0a3fac904c2a/WhatsApp_Image_2025-01-26_at_20.14.19-removebg-preview%20(3).png?Expires=1834242508&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nVFdXSeeo14FtjV6G~ppAgawYVuWM5ZBFu3VmE~6EUH79Qe3QJ479US4D8pggGisa~3D5nKS0ICnJFBkwZyIV8iDLMX6LMTxPnoH9OkOnaYACbTTPgISyWVxr33MreB2LGvj0ePD5wi-weKMOaF-jYY9nr0AXGiYtUbOpCvRgws7RsDMKcTtO8xA~HP9Jim90PxyNhfp1842BWY~GDnlguAKH87V-Q-5RB8JJ6q~-wO9gX-ScIP26GqRVmXMQPmo4uuA6JH4fVvc1MjUKbBHtQBZ-3xFP0pAJax3I2lVLNX1EP2kHTpJuUTwwnLBCnkMNwst3BinXaixwg6I~kdkLw__"
            alt="REstart LMS"
            className="rounded-lg mb-8 w-32 mx-auto"
          />
          <h2 className="text-3xl font-bold mb-4 text-center">
            Welcome to REstart LMS
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="text-center">
              Join our platform to prepare for the NSAT exam with comprehensive study materials and mock tests.
              Track your progress and improve your chances of success.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Access to comprehensive study materials
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Practice with realistic mock tests
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Track your progress with analytics
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Learn at your own pace
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}