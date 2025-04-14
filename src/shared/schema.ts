import { z } from "zod";

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  phoneNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit number"),
  passingYear: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  isNsatRegistered: z.boolean(),
  needsInterviewPrep: z.boolean()
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const subjects = [
  "Basic Mathematics",
  "Advanced Mathematics",
  "English",
  "Logical Reasoning",
] as const;

export type Subject = typeof subjects[number];

export interface SubjectProgress {
  completedTests: number;
  totalScore: number;
  completedMaterials: string[];
}

export interface UserProgress {
  [key: string]: SubjectProgress;
}

export const supportFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  priority: z.string({ required_error: "Please select a priority." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

export type SupportFormValues = z.infer<typeof supportFormSchema>;

export const testSchema = z.object({
  id: z.string(),
  subject: z.enum(subjects),
  title: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string()
  })),
  duration: z.number(),
  totalMarks: z.number()
});

export const materialSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  subject: z.enum(subjects),
  filePath: z.string(),
  fileUrl: z.string(),
  uploadedAt: z.string(),
  size: z.number(),
  userId: z.string()
});

export type Test = z.infer<typeof testSchema>;
export type Material = z.infer<typeof materialSchema>;