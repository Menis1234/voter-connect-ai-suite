import { useState, useEffect } from 'react';
import { 
  getMessageTemplates, 
  getScheduledMessages, 
  getRecentCommunications, 
  subscribeToNewCommunications 
} from '@/services/messageService';
import { MessageTemplate, ScheduledMessage, Communication } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

export const useMessaging = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState({
    templates: false,
    scheduled: false,
    communications: false,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, templates: true }));
      const templatesData = await getMessageTemplates();
      setTemplates(templatesData);
      setLoading(prev => ({ ...prev, templates: false }));

      setLoading(prev => ({ ...prev, scheduled: true }));
      const scheduledData = await getScheduledMessages();
      setScheduledMessages(scheduledData);
      setLoading(prev => ({ ...prev, scheduled: false }));

      setLoading(prev => ({ ...prev, communications: true }));
      const communicationsData = await getRecentCommunications();
      setCommunications(communicationsData);
      setLoading(prev => ({ ...prev, communications: false }));
    };

    fetchData();
  }, []);

  // Subscribe to real-time updates for communications
  useEffect(() => {
    const communicationsSubscription = subscribeToNewCommunications((payload) => {
      const newCommunication = payload.new as unknown as Communication;
      // Ensure message_type is properly typed
      const typedCommunication = {
        ...newCommunication,
        message_type: newCommunication.message_type as "sms" | "whatsapp" | "telegram" | "ussd"
      };
      setCommunications(prev => [typedCommunication, ...prev]);
    });

    return () => {
      supabase.removeChannel(communicationsSubscription);
    };
  }, []);

  // Separate useEffect for templates subscription to avoid dependency cycles
  useEffect(() => {
    // Subscribe to message templates updates
    const templatesSubscription = supabase
      .channel('templates-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'message_templates' }, 
        (payload) => {
          const newTemplate = payload.new as unknown as MessageTemplate;
          // Ensure message_type is properly typed
          const typedTemplate = {
            ...newTemplate,
            message_type: newTemplate.message_type as "sms" | "whatsapp" | "telegram" | "ussd"
          };
          setTemplates(prev => [typedTemplate, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(templatesSubscription);
    };
  }, []);

  // Separate useEffect for scheduled messages subscription
  useEffect(() => {
    // Subscribe to scheduled messages updates
    const scheduledSubscription = supabase
      .channel('scheduled-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'scheduled_messages' }, 
        (payload) => {
          const newScheduled = payload.new as unknown as ScheduledMessage;
          // Ensure message_type is properly typed
          const typedScheduled = {
            ...newScheduled,
            message_type: newScheduled.message_type as "sms" | "whatsapp" | "telegram" | "ussd"
          };
          setScheduledMessages(prev => [typedScheduled, ...prev]);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'scheduled_messages' }, 
        (payload) => {
          const updatedScheduled = payload.new as unknown as ScheduledMessage;
          // Ensure message_type is properly typed
          const typedScheduled = {
            ...updatedScheduled,
            message_type: updatedScheduled.message_type as "sms" | "whatsapp" | "telegram" | "ussd"
          };
          setScheduledMessages(prev => 
            prev.map(msg => msg.id === typedScheduled.id ? typedScheduled : msg)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(scheduledSubscription);
    };
  }, []);

  return {
    templates,
    scheduledMessages,
    communications,
    loading
  };
};
