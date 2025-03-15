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