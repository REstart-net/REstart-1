import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProgress, updateProgress } from '@/lib/api';
import { Subject, SubjectProgress } from '@/shared/schema';
import { useAuth } from './use-auth';

export function useProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ['progress', user?.id],
    queryFn: () => getUserProgress(user!.id),
    enabled: !!user,
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({
      subject,
      update,
    }: {
      subject: Subject;
      update: Partial<SubjectProgress>;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return updateProgress(user.id, subject, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', user?.id] });
    },
  });

  return {
    progress: progressQuery.data,
    isLoading: progressQuery.isLoading,
    error: progressQuery.error,
    updateProgress: (subject: Subject, update: Partial<SubjectProgress>) =>
      updateProgressMutation.mutate({ subject, update }),
  };
}