import { Subject } from '@/shared/schema';
import { generateTest as dbGenerateTest } from './questions';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Test {
  id: string;
  subject: Subject;
  title: string;
  questions: Question[];
  duration: number; // in minutes
  totalMarks: number;
}

export async function generateTest(subject: Subject): Promise<Test> {
  try {
    // In a real app, this would fetch data from your backend
    // For now, we'll use mock data
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate a random test ID
    const testId = `test-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create mock questions
    const questions: Question[] = Array.from({ length: Math.floor(Math.random() * 10) + 15 }, (_, i) => ({
      id: `q-${i}`,
      text: `Sample question ${i+1} for ${subject}?`,
      options: [
        `Option A for question ${i+1}`,
        `Option B for question ${i+1}`,
        `Option C for question ${i+1}`,
        `Option D for question ${i+1}`,
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Explanation for question ${i+1} in ${subject}`,
    }));
    
    return {
      id: testId,
      subject,
      title: `Practice Test for ${subject}`,
      questions,
      duration: 45, // 45 minutes
      totalMarks: questions.length,
    };
  } catch (error) {
    console.error("Error generating test:", error);
    throw new Error(`Failed to generate test for ${subject}`);
  }
}

export async function generateFullTest(subject: Subject): Promise<Test> {
  try {
    // In a real app, this would fetch a comprehensive test from your backend
    // For now, we'll create a mock full test with 30 questions
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate a test ID for the full test
    const testId = `full-test-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create 30 mock questions covering all topics
    const questions: Question[] = Array.from({ length: 30 }, (_, i) => ({
      id: `q-${i}`,
      text: `Comprehensive question ${i+1} for ${subject} full test?`,
      options: [
        `Option A for question ${i+1}`,
        `Option B for question ${i+1}`,
        `Option C for question ${i+1}`,
        `Option D for question ${i+1}`,
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Detailed explanation for full test question ${i+1} in ${subject}`,
    }));
    
    // Determine duration based on subject
    let duration = 60; // default 60 minutes
    if (subject === "English") {
      duration = 45; // English tests are shorter
    }
    
    return {
      id: testId,
      subject,
      title: `Complete ${subject} Assessment`,
      questions,
      duration: duration,
      totalMarks: questions.length,
    };
  } catch (error) {
    console.error("Error generating full test:", error);
    throw new Error(`Failed to generate full test for ${subject}`);
  }
}

export function calculateScore(test: Test, answers: Record<string, number>) {
  let score = 0;
  let total = test.questions.length;
  
  for (const question of test.questions) {
    if (answers[question.id] === question.correctAnswer) {
      score++;
    }
  }
  
  return {
    score,
    total,
    percentage: (score / total) * 100
  };
}

// Function to track user behavior during test
export function trackTestActivity(
  testId: string, 
  userId: string, 
  activityType: 'tab_switch' | 'fullscreen_exit' | 'browser_back' | 'test_submit',
  metadata?: Record<string, any>
) {
  // In a real implementation, this would send data to the server
  // For now, we'll just log to console
  console.log('Test activity tracked:', {
    testId,
    userId,
    activityType,
    timestamp: new Date().toISOString(),
    metadata
  });
  
  // This could be expanded to store data in localStorage or send to a server
  // depending on connectivity status
}