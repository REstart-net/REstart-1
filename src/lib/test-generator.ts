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
    const dbQuestions = await dbGenerateTest(subject, {
      questionCount: 30,
    });

    const questions = dbQuestions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options,
      correctAnswer: parseInt(q.correct_answer, 10),
      explanation: q.explanation || 'No explanation provided for this question.',
    }));

    return {
      id: `test-${Math.random().toString(36).substr(2, 9)}`,
      subject,
      title: `${subject} Assessment`,
      questions,
      duration: 45, // 45 minutes per subject
      totalMarks: questions.length
    };
  } catch (error) {
    console.error(`Error generating test for ${subject}:`, error);
    // Return a fallback test with dummy questions if database fetch fails
    return createFallbackTest(subject);
  }
}

function createFallbackTest(subject: Subject): Test {
  // Create dummy questions based on subject
  const dummyQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
    id: `fallback-${subject}-${i}`,
    text: `Sample ${subject} question ${i + 1}`,
    options: [
      `Option A for question ${i + 1}`,
      `Option B for question ${i + 1}`,
      `Option C for question ${i + 1}`,
      `Option D for question ${i + 1}`,
    ],
    correctAnswer: Math.floor(Math.random() * 4),
    explanation: `This is a fallback question created because the database connection failed.`,
  }));

  return {
    id: `fallback-test-${Math.random().toString(36).substr(2, 9)}`,
    subject,
    title: `${subject} Assessment (Offline Mode)`,
    questions: dummyQuestions,
    duration: 45,
    totalMarks: 30
  };
}

export function calculateScore(test: Test, answers: Record<string, number>): {
  score: number;
  total: number;
  incorrectQuestions: { question: Question; selectedAnswer: number }[];
} {
  let score = 0;
  const incorrectQuestions: { question: Question; selectedAnswer: number }[] = [];

  test.questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (userAnswer === question.correctAnswer) {
      score++;
    } else if (userAnswer !== undefined) {
      incorrectQuestions.push({
        question,
        selectedAnswer: userAnswer
      });
    } else {
      // Unanswered questions are considered incorrect
      incorrectQuestions.push({
        question,
        selectedAnswer: -1 // -1 indicates unanswered
      });
    }
  });

  return {
    score,
    total: test.questions.length,
    incorrectQuestions
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