
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Voter } from "@/types";
import { toast } from "sonner";

export const useVoters = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVoters(data as Voter[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching voters:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addVoter = async (voter: Omit<Voter, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('voters')
        .insert([voter])
        .select();
      
      if (error) throw error;
      
      setVoters(prev => [data[0] as Voter, ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error adding voter:", err);
      toast.error("Failed to add voter");
      return { success: false, error: err };
    }
  };

  const updateVoter = async (id: string, updates: Partial<Voter>) => {
    try {
      const { data, error } = await supabase
        .from('voters')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setVoters(prev => 
        prev.map(voter => voter.id === id ? { ...voter, ...updates } : voter)
      );
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error updating voter:", err);
      toast.error("Failed to update voter");
      return { success: false, error: err };
    }
  };

  const deleteVoter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('voters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setVoters(prev => prev.filter(voter => voter.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting voter:", err);
      toast.error("Failed to delete voter");
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  return {
    voters,
    loading,
    error,
    fetchVoters,
    addVoter,
    updateVoter,
    deleteVoter
  };
};
