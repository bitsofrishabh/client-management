import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';
import { Client, WeightEntry, Comment } from '../types';
import { toast } from 'sonner';

// Fetch all clients with their weight entries and comments
export const useClients = () => {
  return useQuery('clients', async (): Promise<Client[]> => {
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (clientsError) {
      throw new Error(clientsError.message);
    }

    // Fetch weight entries for all clients
    const { data: weightEntriesData, error: weightError } = await supabase
      .from('weight_entries')
      .select('*')
      .order('date', { ascending: true });

    if (weightError) {
      throw new Error(weightError.message);
    }

    // Fetch comments for all clients
    const { data: commentsData, error: commentsError } = await supabase
      .from('client_comments')
      .select('*')
      .order('created_at', { ascending: true });

    if (commentsError) {
      throw new Error(commentsError.message);
    }

    // Combine data
    const clients: Client[] = clientsData.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      startDate: client.start_date,
      startWeight: client.start_weight,
      currentWeight: client.current_weight,
      goalWeight: client.goal_weight,
      height: client.height,
      status: client.status,
      notes: client.notes,
      healthIssues: client.health_issues,
      dietEndDate: client.diet_end_date,
      routine: client.routine,
      healthSummary: client.health_summary,
      weightEntries: weightEntriesData
        .filter(entry => entry.client_id === client.id)
        .map(entry => ({
          date: entry.date,
          weight: entry.weight
        })),
      comments: commentsData
        .filter(comment => comment.client_id === client.id)
        .map(comment => ({
          id: comment.id,
          text: comment.text,
          author: comment.author,
          timestamp: comment.created_at
        }))
    }));

    return clients;
  });
};

// Create multiple clients (for CSV import)
export const useCreateClients = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (clients: Client[]) => {
      // Insert clients
      const clientsToInsert = clients.map(client => ({
        name: client.name,
        email: client.email,
        start_date: client.startDate,
        start_weight: client.startWeight,
        current_weight: client.currentWeight,
        goal_weight: client.goalWeight,
        height: client.height,
        status: client.status,
        notes: client.notes,
        health_issues: client.healthIssues || [],
        diet_end_date: client.dietEndDate,
        routine: client.routine,
        health_summary: client.healthSummary
      }));

      const { data: insertedClients, error: clientsError } = await supabase
        .from('clients')
        .insert(clientsToInsert)
        .select();

      if (clientsError) {
        throw new Error(clientsError.message);
      }

      // Insert weight entries
      const weightEntriesToInsert: any[] = [];
      clients.forEach((client, index) => {
        const clientId = insertedClients[index].id;
        client.weightEntries.forEach(entry => {
          weightEntriesToInsert.push({
            client_id: clientId,
            date: entry.date,
            weight: entry.weight
          });
        });
      });

      if (weightEntriesToInsert.length > 0) {
        const { error: weightError } = await supabase
          .from('weight_entries')
          .insert(weightEntriesToInsert);

        if (weightError) {
          throw new Error(weightError.message);
        }
      }

      // Insert comments
      const commentsToInsert: any[] = [];
      clients.forEach((client, index) => {
        const clientId = insertedClients[index].id;
        client.comments.forEach(comment => {
          commentsToInsert.push({
            client_id: clientId,
            text: comment.text,
            author: comment.author
          });
        });
      });

      if (commentsToInsert.length > 0) {
        const { error: commentsError } = await supabase
          .from('client_comments')
          .insert(commentsToInsert);

        if (commentsError) {
          throw new Error(commentsError.message);
        }
      }

      return insertedClients;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        toast.success('Clients imported successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to import clients: ${error.message}`);
      }
    }
  );
};

// Update client
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      const clientUpdates: any = {};
      
      if (updates.name !== undefined) clientUpdates.name = updates.name;
      if (updates.email !== undefined) clientUpdates.email = updates.email;
      if (updates.startDate !== undefined) clientUpdates.start_date = updates.startDate;
      if (updates.startWeight !== undefined) clientUpdates.start_weight = updates.startWeight;
      if (updates.currentWeight !== undefined) clientUpdates.current_weight = updates.currentWeight;
      if (updates.goalWeight !== undefined) clientUpdates.goal_weight = updates.goalWeight;
      if (updates.height !== undefined) clientUpdates.height = updates.height;
      if (updates.status !== undefined) clientUpdates.status = updates.status;
      if (updates.notes !== undefined) clientUpdates.notes = updates.notes;
      if (updates.healthIssues !== undefined) clientUpdates.health_issues = updates.healthIssues;
      if (updates.dietEndDate !== undefined) clientUpdates.diet_end_date = updates.dietEndDate;
      if (updates.routine !== undefined) clientUpdates.routine = updates.routine;
      if (updates.healthSummary !== undefined) clientUpdates.health_summary = updates.healthSummary;

      const { error } = await supabase
        .from('clients')
        .update(clientUpdates)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        toast.success('Client updated successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to update client: ${error.message}`);
      }
    }
  );
};

// Delete client
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (clientId: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        toast.success('Client deleted successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to delete client: ${error.message}`);
      }
    }
  );
};

// Add comment to client
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ clientId, text, author }: { clientId: string; text: string; author: string }) => {
      const { error } = await supabase
        .from('client_comments')
        .insert({
          client_id: clientId,
          text,
          author
        });

      if (error) {
        throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        toast.success('Comment added successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to add comment: ${error.message}`);
      }
    }
  );
};

// Add weight entry
export const useAddWeightEntry = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ clientId, date, weight }: { clientId: string; date: string; weight: number }) => {
      const { error } = await supabase
        .from('weight_entries')
        .insert({
          client_id: clientId,
          date,
          weight
        });

      if (error) {
        throw new Error(error.message);
      }

      // Update current weight in clients table
      const { error: updateError } = await supabase
        .from('clients')
        .update({ current_weight: weight })
        .eq('id', clientId);

      if (updateError) {
        throw new Error(updateError.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
        toast.success('Weight entry added successfully!');
      },
      onError: (error: Error) => {
        toast.error(`Failed to add weight entry: ${error.message}`);
      }
    }
  );
};