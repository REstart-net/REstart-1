import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowLeft,
  Check,
  Loader2,
  Headphones
} from "lucide-react";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supportFormSchema, type SupportFormValues } from "@/shared/schema";
import { useSupport } from "@/hooks/use-support";
import { Textarea } from "@/components/ui/textarea";

export default function ContactSupportPage() {
  const { user } = useAuth();
  const { createTicketMutation } = useSupport();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      subject: "",
      category: "",
      priority: "medium",
      message: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.user_metadata?.full_name || "");
      form.setValue("email", user.email || "");
    }
  }, [user, form]);

  const onSubmit = async (data: SupportFormValues) => {
    try {
      await createTicketMutation.mutateAsync(data);
      toast.success("Your support request has been submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
          <p className="text-muted-foreground max-w-2xl">
            Have a question or need help? Our support team is here to assist you with any questions or issues you encounter.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Support Channels
                </CardTitle>
                <CardDescription>
                  Multiple ways to get help from our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-sm text-muted-foreground">
                        Send us an email at <a href="mailto:letsrestart.here@gmail.com" className="text-primary hover:underline">letsrestart.here@gmail.com</a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Response time: Within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-sm text-muted-foreground">
                        Call our support line at <a href="tel:+917052921027" className="text-primary hover:underline">+91 7052921027</a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available: Mon-Fri, 9 AM - 6 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">
                        Chat with our support team in real-time
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available: 24/7 for premium users, 10 AM - 8 PM for others
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <p className="text-sm text-muted-foreground">
                        NST RU Campus, Sonipat, Haryana
                      </p>
                      <p className="text-sm text-muted-foreground">
                        NST ADYPU Campus, Pune, Maharashtra
                      </p>            
                      <p className="text-xs text-muted-foreground mt-1">
                        By appointment only
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium mb-2">Support Hours</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </div>
                  {user?.user_metadata?.role === 'admin' && (
                    <Link href="/support/dashboard">
                      <Button variant="outline" size="sm">
                        View Support Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <div className="rounded-full bg-green-100 p-3 text-green-600 mb-4">
                      <Check className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Thank you for contacting us. Our support team has received your request and will 
                      get back to you within 24 hours. A confirmation has been sent to your email address.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                        Submit Another Request
                      </Button>
                      <Link href="/dashboard">
                        <Button>
                          Return to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of your issue" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="account">Account Issues</SelectItem>
                                  <SelectItem value="payments">Payments</SelectItem>
                                  <SelectItem value="courses">Course Content</SelectItem>
                                  <SelectItem value="technical">Technical Problems</SelectItem>
                                  <SelectItem value="feedback">Feedback</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Priority</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-2"
                                >
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="low" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">Low</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="medium" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">Medium</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="high" />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">High</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your issue in detail..." 
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto" 
                          disabled={createTicketMutation.isPending}
                        >
                          {createTicketMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Request
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Support Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How quickly can I expect a response?",
                answer: "We typically respond to all support requests within 24 hours during business days. High priority issues are addressed more quickly."
              },
              {
                question: "Do you offer phone support?",
                answer: "Yes, our phone support is available Monday through Friday from 9 AM to 6 PM IST. You can reach us at +91 7052921027."
              },
              {
                question: "I forgot my password. How do I reset it?",
                answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. We'll send a password reset link to your registered email address."
              },
              {
                question: "Can I get a refund for my subscription?",
                answer: "Refund policies vary depending on your subscription plan. Please contact our support team with your account details for specific information about refund eligibility."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
