import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SupportFormValues } from '@/shared/schema';
import { useAuth } from './use-auth';

interface SupportTicket extends SupportFormValues {
  id: string;
  user_id: string | null;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export function useSupport() {
  const { user } = useAuth();

  // Get user's support tickets
  const { data: tickets, isLoading, error, refetch } = useQuery({
    queryKey: ['supportTickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user,
  });

  // Create a new support ticket
  const createTicketMutation = useMutation({
    mutationFn: async (formData: SupportFormValues) => {
      const ticketData = {
        ...formData,
        created_at: new Date().toISOString(),
        user_id: user?.id || null,
        status: 'open'
      };
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert(ticketData)
        .select()
        .single();
        
      if (error) throw error;
      return data as SupportTicket;
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Get a single support ticket by ID
  const getTicketById = async (ticketId: string) => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
      
    if (error) throw error;
    return data as SupportTicket;
  };

  return {
    tickets,
    isLoading,
    error,
    createTicketMutation,
    getTicketById,
    refetch,
  };
} 