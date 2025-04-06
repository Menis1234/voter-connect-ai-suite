export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      communications: {
        Row: {
          content: string
          id: string
          message_type: string
          recipient_count: number | null
          sent_at: string
          sent_by: string | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          content: string
          id?: string
          message_type: string
          recipient_count?: number | null
          sent_at?: string
          sent_by?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          content?: string
          id?: string
          message_type?: string
          recipient_count?: number | null
          sent_at?: string
          sent_by?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      delegates: {
        Row: {
          created_at: string | null
          id: string
          last_activity: string | null
          name: string
          performance_score: number | null
          phone: string | null
          region: string | null
          role: string | null
          updated_at: string | null
          ward: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          name: string
          performance_score?: number | null
          phone?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string | null
          ward?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          name?: string
          performance_score?: number | null
          phone?: string | null
          region?: string | null
          role?: string | null
          updated_at?: string | null
          ward?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          location: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      polling_stations: {
        Row: {
          capacity: number | null
          constituency: string | null
          coordinator_name: string | null
          coordinator_phone: string | null
          county: string | null
          created_at: string
          id: string
          location: string
          name: string
          notes: string | null
          updated_at: string
          ward: string | null
        }
        Insert: {
          capacity?: number | null
          constituency?: string | null
          coordinator_name?: string | null
          coordinator_phone?: string | null
          county?: string | null
          created_at?: string
          id?: string
          location: string
          name: string
          notes?: string | null
          updated_at?: string
          ward?: string | null
        }
        Update: {
          capacity?: number | null
          constituency?: string | null
          coordinator_name?: string | null
          coordinator_phone?: string | null
          county?: string | null
          created_at?: string
          id?: string
          location?: string
          name?: string
          notes?: string | null
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      voters: {
        Row: {
          age_group: string | null
          created_at: string
          created_by: string | null
          delegate_id: string | null
          full_name: string
          gender: string | null
          has_voted: boolean | null
          id: string
          id_number: string | null
          languages: string[] | null
          last_contact: string | null
          location: string | null
          notes: string | null
          phone_number: string | null
          polling_station: string | null
          sentiment_score: number | null
          status: string | null
          tags: string[] | null
          updated_at: string
          voter_status: string | null
          ward: string | null
        }
        Insert: {
          age_group?: string | null
          created_at?: string
          created_by?: string | null
          delegate_id?: string | null
          full_name: string
          gender?: string | null
          has_voted?: boolean | null
          id?: string
          id_number?: string | null
          languages?: string[] | null
          last_contact?: string | null
          location?: string | null
          notes?: string | null
          phone_number?: string | null
          polling_station?: string | null
          sentiment_score?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          voter_status?: string | null
          ward?: string | null
        }
        Update: {
          age_group?: string | null
          created_at?: string
          created_by?: string | null
          delegate_id?: string | null
          full_name?: string
          gender?: string | null
          has_voted?: boolean | null
          id?: string
          id_number?: string | null
          languages?: string[] | null
          last_contact?: string | null
          location?: string | null
          notes?: string | null
          phone_number?: string | null
          polling_station?: string | null
          sentiment_score?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          voter_status?: string | null
          ward?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
