import { supabase } from './supabase';
import { Subject, SubjectProgress } from '@/shared/schema';

export async function getUserProgress(userId: string) {
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select(`
      id,
      subject,
      completed_tests,
      total_score,
      completed_materials (
        material_id
      )
    `)
    .eq('user_id', userId);

  if (progressError) throw progressError;

  const progress: Record<Subject, SubjectProgress> = {};

  progressData?.forEach((item) => {
    progress[item.subject as Subject] = {
      completedTests: item.completed_tests,
      totalScore: item.total_score,
      completedMaterials: item.completed_materials.map((m) => m.material_id),
    };
  });

  return progress;
}

export async function updateProgress(
  userId: string,
  subject: Subject,
  update: Partial<SubjectProgress>
) {
  // First, get or create the progress record
  const { data: existingProgress, error: fetchError } = await supabase
    .from('user_progress')
    .select('id, completed_tests, total_score')
    .eq('user_id', userId)
    .eq('subject', subject)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  let progressId: string;

  if (!existingProgress) {
    // Create new progress record
    const { data: newProgress, error: insertError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        subject,
        completed_tests: update.completedTests || 0,
        total_score: update.totalScore || 0,
      })
      .select('id')
      .single();

    if (insertError) throw insertError;
    progressId = newProgress.id;
  } else {
    // Update existing progress
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        completed_tests: existingProgress.completed_tests + (update.completedTests || 0),
        total_score: existingProgress.total_score + (update.totalScore || 0),
      })
      .eq('id', existingProgress.id);

    if (updateError) throw updateError;
    progressId = existingProgress.id;
  }

  // Update completed materials if provided
  if (update.completedMaterials?.length) {
    const { error: materialsError } = await supabase
      .from('completed_materials')
      .upsert(
        update.completedMaterials.map((materialId) => ({
          progress_id: progressId,
          material_id: materialId,
        })),
        { onConflict: 'progress_id,material_id' }
      );

    if (materialsError) throw materialsError;
  }
}

// Track a test attempt for a user
export async function recordTestAttempt(
  userId: string,
  subject: Subject,
  testId: string,
  score: number
) {
  const { error } = await supabase
    .from('user_test_attempts')
    .insert({
      user_id: userId,
      subject,
      test_id: testId,
      score
    });

  if (error) throw error;
}

// Check if a user has already attempted a test for a subject
export async function hasAttemptedTest(userId: string, subject: Subject): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_test_attempts')
    .select('id')
    .eq('user_id', userId)
    .eq('subject', subject)
    .maybeSingle();

  if (error) throw error;
  return !!data; // Return true if an attempt exists
}

// Verify a referral code
export async function verifyReferralCode(referralCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('referral_codes')
      .select('is_valid')
      .eq('code', referralCode)
      .single();
    
    if (error) throw error;
    return data?.is_valid || false;
  } catch (error) {
    console.error('Error verifying referral code:', error);
    return false;
  }
}

// Store a verified referral code for a user
export async function storeUserReferral(userId: string, referralCode: string, referredEmail: string) {
  try {
    const { error } = await supabase
      .from('user_referrals')
      .insert({
        user_id: userId,
        referral_code: referralCode,
        email: referredEmail,
        verified_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error storing user referral:', error);
    throw error;
  }
}

export const verifyNsatRegistration = async (email: string) => {
  try {
    // Check API with Newton School using email only
    const response = await fetch(
      `https://django.newtonschool.co/api/v1/marketing/refer/s/btech-computer-science/check_status?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify NSAT registration');
    }

    const data = await response.json();
    return {
      ...data,
      isRegistered: data.status === 'registered' || data.status === 'verified'
    };
  } catch (error) {
    console.error('Error verifying NSAT registration:', error);
    throw error;
  }
};