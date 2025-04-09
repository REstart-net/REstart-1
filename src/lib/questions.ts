import { supabase } from './supabase';
import { Subject } from '@/shared/schema';

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswer: string;
  difficulty: number;
  categoryId: string;
  tags: string[];
  version: number;
  isActive: boolean;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
}

export interface QuestionTag {
  id: string;
  name: string;
}

export interface QuestionStats {
  timesUsed: number;
  timesCorrect: number;
  lastUsed: string;
  averageTimeSpent: number;
}

export async function createQuestion(question: Omit<Question, 'id' | 'version' | 'isActive'>) {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      text: question.text,
      type: question.type,
      options: question.options,
      correct_answer: question.correctAnswer,
      difficulty: question.difficulty,
      category_id: question.categoryId,
    })
    .select()
    .single();

  if (error) throw error;

  if (question.tags.length > 0) {
    const { error: tagError } = await supabase
      .from('question_tags_map')
      .insert(
        question.tags.map(tagId => ({
          question_id: data.id,
          tag_id: tagId,
        }))
      );

    if (tagError) throw tagError;
  }

  return data;
}

export async function getQuestions(filters: {
  difficulty?: number;
  categoryId?: string;
  tags?: string[];
  type?: Question['type'];
  isActive?: boolean;
}) {
  let query = supabase
    .from('questions')
    .select(`
      *,
      question_categories (
        name,
        description
      ),
      question_tags_map (
        question_tags (
          id,
          name
        )
      )
    `);

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('question_tags_map.tag_id', filters.tags);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function generateTest(subject: Subject, params: {
  difficulty?: number;
  questionCount?: number;
  tags?: string[];
} = {}) {
  try {
    console.log(`Fetching category ID for subject: ${subject}`);
    // First get the category ID for the subject
    const { data: categories, error: categoryError } = await supabase
      .from('question_categories')
      .select('id')
      .eq('name', subject);

    if (categoryError) {
      console.error(`Error fetching category for ${subject}:`, categoryError);
      throw categoryError;
    }
    
    if (!categories || categories.length === 0) {
      console.error(`No category found for subject: ${subject}`);
      throw new Error(`No category found for subject: ${subject}`);
    }

    const categoryId = categories[0].id;
    console.log(`Found category ID for ${subject}: ${categoryId}`);

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        *,
        question_categories (
          name,
          description
        ),
        question_tags_map (
          question_tags (
            id,
            name
          )
        )
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true);
      
    if (questionsError) {
      console.error(`Error fetching questions for ${subject}:`, questionsError);
      throw questionsError;
    }
    
    console.log(`Retrieved ${questions?.length || 0} questions for ${subject}`);
    
    if (!questions || questions.length === 0) {
      console.warn(`No questions found for ${subject}`);
      return [];
    }

    // Randomly select questions
    const selectedQuestions = questions
      .sort(() => Math.random() - 0.5)
      .slice(0, params.questionCount || 30);

    console.log(`Selected ${selectedQuestions.length} questions for ${subject} test`);

    // Update usage statistics
    if (selectedQuestions.length > 0) {
      try {
        const updates = selectedQuestions.map(async (q) => {
          const { data: existing } = await supabase
            .from('question_usage_stats')
            .select('times_used')
            .eq('question_id', q.id)
            .single();

          return supabase
            .from('question_usage_stats')
            .upsert({
              question_id: q.id,
              times_used: (existing?.times_used || 0) + 1,
              last_used: new Date().toISOString(),
            });
        });

        await Promise.all(updates).catch(err => {
          console.error('Failed to update question usage stats:', err);
        });
      } catch (error) {
        console.error('Failed to update question usage stats:', error);
        // Continue even if stats update fails
      }
    }

    return selectedQuestions;
  } catch (error) {
    console.error(`Error in generateTest for ${subject}:`, error);
    // Return empty array to allow fallback test generation
    return [];
  }
}

export async function updateQuestionStats(
  questionId: string,
  stats: {
    correct: boolean;
    timeSpent: number;
  }
) {
  const { data: existing } = await supabase
    .from('question_usage_stats')
    .select('*')
    .eq('question_id', questionId)
    .single();

  const newStats = {
    question_id: questionId,
    times_used: (existing?.times_used || 0) + 1,
    times_correct: (existing?.times_correct || 0) + (stats.correct ? 1 : 0),
    last_used: new Date().toISOString(),
    average_time_spent: existing
      ? ((existing.average_time_spent * existing.times_used) + stats.timeSpent) / (existing.times_used + 1)
      : stats.timeSpent
  };

  const { error } = await supabase
    .from('question_usage_stats')
    .upsert(newStats);

  if (error) {
    console.error('Failed to update question stats:', error);
    throw error;
  }
}

export async function batchImportQuestions(questions: Array<Omit<Question, 'id' | 'version' | 'isActive'>>) {
  const { data, error } = await supabase
    .from('questions')
    .insert(questions.map(q => ({
      text: q.text,
      type: q.type,
      options: q.options,
      correct_answer: q.correctAnswer,
      difficulty: q.difficulty,
      category_id: q.categoryId,
    })))
    .select();

  if (error) throw error;
  return data;
}

export async function getQuestionStats(questionId: string): Promise<QuestionStats> {
  const { data, error } = await supabase
    .from('question_usage_stats')
    .select('*')
    .eq('question_id', questionId)
    .single();

  if (error) throw error;

  return {
    timesUsed: data.times_used,
    timesCorrect: data.times_correct,
    lastUsed: data.last_used,
    averageTimeSpent: data.average_time_spent,
  };
}