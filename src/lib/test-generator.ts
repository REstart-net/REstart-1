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
    console.log(`Attempting to generate test for ${subject}...`);
    const dbQuestions = await dbGenerateTest(subject, {
      questionCount: 30,
    });

    console.log(`Successfully fetched ${dbQuestions.length} questions for ${subject}`);
    
    if (!dbQuestions || dbQuestions.length === 0) {
      console.warn(`No questions returned from database for ${subject}, using fallback`);
      return createFallbackTest(subject);
    }

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
  console.log(`Creating fallback test for ${subject}`);
  
  // Subject-specific question generators
  const questionGenerators = {
    "Basic Mathematics": (i: number) => ({
      text: `What is the result of ${i * 5} + ${i * 3}?`,
      options: [
        `${i * 5 + i * 3}`,
        `${i * 5 + i * 3 + 1}`,
        `${i * 5 + i * 3 - 1}`,
        `${i * 5 + i * 3 + 2}`,
      ],
    }),
    "Advanced Mathematics": (i: number) => ({
      text: `If f(x) = ${i}x² + ${i+1}x + ${i+2}, what is f(2)?`,
      options: [
        `${i * 4 + (i+1) * 2 + (i+2)}`,
        `${i * 4 + (i+1) * 2 + (i+2) + 1}`,
        `${i * 4 + (i+1) * 2 + (i+2) - 1}`,
        `${i * 4 + (i+1) * 2 + (i+2) + 2}`,
      ],
    }),
    "English": (i: number) => ({
      text: `Choose the correct meaning of the word "${['Ameliorate', 'Benevolent', 'Capricious', 'Diligent', 'Ephemeral'][i % 5]}".`,
      options: [
        `${['To improve', 'Kind', 'Unpredictable', 'Hardworking', 'Short-lived'][i % 5]}`,
        `${['To worsen', 'Cruel', 'Stable', 'Lazy', 'Permanent'][i % 5]}`,
        `${['To maintain', 'Neutral', 'Logical', 'Average', 'Colorful'][i % 5]}`,
        `${['To abandon', 'Selfish', 'Careful', 'Sleepy', 'Loud'][i % 5]}`,
      ],
    }),
    "Logical Reasoning": (i: number) => ({
      text: `In a sequence 2, 6, 12, 20, 30, what comes next?`,
      options: [
        "42",
        "40",
        "38",
        "36",
      ],
    }),
  } as Record<Subject, (i: number) => { text: string; options: string[] }>;
  
  // Fallback to generic questions if subject-specific generator not found
  const getQuestion = (i: number) => {
    const generator = questionGenerators[subject] || ((idx: number) => ({
      text: `Sample ${subject} question ${idx + 1}`,
      options: [
        `Option A for question ${idx + 1}`,
        `Option B for question ${idx + 1}`,
        `Option C for question ${idx + 1}`,
        `Option D for question ${idx + 1}`,
      ],
    }));
    
    return generator(i);
  };

  // Create dummy questions based on subject
  const dummyQuestions: Question[] = Array.from({ length: 30 }, (_, i) => {
    const question = getQuestion(i);
    return {
      id: `fallback-${subject}-${i}`,
      text: question.text,
      options: question.options,
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `This is a fallback question created because the database connection failed.`,
    };
  });

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