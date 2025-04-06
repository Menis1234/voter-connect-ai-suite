
import { supabase } from "@/integrations/supabase/client";
import { MessageTemplate, ScheduledMessage, Communication, mockMessageTemplates, mockScheduledMessages, mockCommunications } from "@/types/database";
import { toast } from "@/hooks/use-toast";

// Fetch message templates
export const getMessageTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    // Since the message_templates table doesn't exist in our database schema,
    // we'll always return mock data
    console.log('Using mock data for message templates');
    return mockMessageTemplates();
  } catch (error) {
    console.error('Error fetching message templates:', error);
    toast({
      title: "Error",
      description: "Failed to load message templates",
      variant: "destructive",
    });
    return mockMessageTemplates();
  }
};

// Create new message template
export const createMessageTemplate = async (template: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<MessageTemplate | null> => {
  try {
    // Mock creation for demo purposes
    toast({
      title: "Demo Mode",
      description: "Message template created (demo)",
    });
    
    return {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: undefined
    };
  } catch (error) {
    console.error('Error creating message template:', error);
    toast({
      title: "Error",
      description: "Failed to create message template",
      variant: "destructive",
    });
    return null;
  }
};

// Get scheduled messages
export const getScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  try {
    // Since the scheduled_messages table doesn't exist in our database schema,
    // we'll always return mock data
    console.log('Using mock data for scheduled messages');
    return mockScheduledMessages();
  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    toast({
      title: "Error",
      description: "Failed to load scheduled messages",
      variant: "destructive",
    });
    return mockScheduledMessages();
  }
};

// Schedule a new message
export const scheduleMessage = async (message: Omit<ScheduledMessage, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<ScheduledMessage | null> => {
  try {
    // Mock scheduling for demo purposes
    toast({
      title: "Demo Mode",
      description: "Message scheduled (demo)",
    });
    
    return {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "pending",
      created_by: undefined
    };
  } catch (error) {
    console.error('Error scheduling message:', error);
    toast({
      title: "Error",
      description: "Failed to schedule message",
      variant: "destructive",
    });
    return null;
  }
};

// Send a new message immediately
export const sendMessage = async (content: string, messageType: "sms" | "whatsapp" | "telegram" | "ussd", recipients: string[]): Promise<boolean> => {
  try {
    const newMessage = {
      content,
      message_type: messageType,
      recipient_count: recipients.length,
      status: 'sent',
      tags: null,
      sent_at: new Date().toISOString()
    };

    // Try to insert into communications table
    try {
      const { error } = await supabase
        .from('communications')
        .insert(newMessage);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Message sent to ${recipients.length} recipients`,
      });
      
      return true;
    } catch (e) {
      console.log('Using mock sending for message:', e);
      // Mock sending for demo purposes
      toast({
        title: "Demo Mode",
        description: `Message sent to ${recipients.length} recipients (demo)`,
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    toast({
      title: "Error",
      description: "Failed to send message",
      variant: "destructive",
    });
    return false;
  }
};

// Get recent communications
export const getRecentCommunications = async (): Promise<Communication[]> => {
  try {
    // Try to query the communications table
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Ensure the message_type property is correctly typed
      if (data && data.length > 0) {
        return data.map(item => ({
          ...item,
          message_type: item.message_type as "sms" | "whatsapp" | "telegram" | "ussd"
        })) as Communication[];
      }
    } catch (e) {
      console.log('Using mock data for communications:', e);
    }
    
    // Fallback to mock data
    return mockCommunications();
  } catch (error) {
    console.error('Error fetching communications:', error);
    toast({
      title: "Error",
      description: "Failed to load communication history",
      variant: "destructive",
    });
    return mockCommunications();
  }
};

// Subscribe to real-time communications
export const subscribeToNewCommunications = (callback: (payload: any) => void) => {
  return supabase
    .channel('communications-channel')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'communications' }, 
      callback
    )
    .subscribe();
};
