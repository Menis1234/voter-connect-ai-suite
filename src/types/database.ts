
import { Database as GeneratedDatabase } from "@/integrations/supabase/types";
import { Message } from "./index";

// Extended types based on our database schema
export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  message_type: "sms" | "whatsapp" | "telegram" | "ussd";
  language: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ScheduledMessage {
  id: string;
  content: string;
  message_type: "sms" | "whatsapp" | "telegram" | "ussd";
  scheduled_for: string;
  recipient_filter: {
    regions?: string[];
    wards?: string[];
    voterStatus?: string[];
    gender?: string[];
  };
  estimated_recipients?: number;
  status: "pending" | "sent" | "cancelled" | "failed";
  language: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Communication {
  id: string;
  content: string;
  message_type: "sms" | "whatsapp" | "telegram" | "ussd";
  tags?: string[];
  recipient_count?: number;
  sent_at: string;
  sent_by?: string;
  status?: string;
}

export interface Delegate {
  id: string;
  full_name: string;
  phone_number?: string;
  region?: string;
  ward?: string;
  status: "active" | "inactive";
  role: "junior" | "senior" | "coordinator";
  performance_score?: number;
  last_activity?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  performed_at: string;
  performed_by?: string;
}

export type DatabaseTables = GeneratedDatabase['public']['Tables'];

// Mock data helper functions
export const mockMessageTemplates = (): MessageTemplate[] => [
  {
    id: "1",
    title: "Election Day Reminder",
    content: "Habari! Tunataka kukumbusha kuhuwa uchaguzi kesho. Kura yako ni muhimu.",
    message_type: "sms",
    language: "sw",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Registration Confirmation",
    content: "Thank you for registering to vote! Your polling station is at {{location}}.",
    message_type: "whatsapp",
    language: "en",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockScheduledMessages = (): ScheduledMessage[] => [
  {
    id: "1",
    content: "Remember to vote tomorrow at your designated polling station!",
    message_type: "sms",
    scheduled_for: new Date(Date.now() + 86400000).toISOString(),
    recipient_filter: {
      regions: ["Mtaa Ward"],
      voterStatus: ["supporter"]
    },
    estimated_recipients: 1200,
    status: "pending",
    language: "en",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockCommunications = (): Communication[] => [
  {
    id: "1",
    content: "Campaign rally happening today at Central Park at 3PM!",
    message_type: "sms",
    recipient_count: 2500,
    sent_at: new Date(Date.now() - 86400000).toISOString(),
    status: "sent"
  }
];
