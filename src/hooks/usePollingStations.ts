import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PollingStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const usePollingStations = () => {
  return useQuery({
    queryKey: ["polling-stations"],
    queryFn: async (): Promise<PollingStation[]> => {
      const { data, error } = await supabase
        .from("polling_stations")
        .select("id, name, latitude, longitude");

      if (error) {
        console.error("Supabase fetch error:", error.message);
        throw new Error("Failed to load polling stations");
      }

      return data ?? [];
    },
  });
};