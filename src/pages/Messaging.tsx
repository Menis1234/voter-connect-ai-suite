import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Send, Calendar, Smartphone, Languages, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageTemplatesList } from "@/components/messaging/MessageTemplatesList";
import { ScheduledMessagesList } from "@/components/messaging/ScheduledMessagesList";
import { sendMessage } from "@/services/messageService";
import { supabase } from "@/integrations/supabase/client";

const Messaging = () => {
  const [messageText, setMessageText] = useState("");
  const [aiAssisted, setAiAssisted] = useState(false);
  const [messageType, setMessageType] = useState<"sms" | "whatsapp" | "telegram" | "ussd">("sms");
  const [language, setLanguage] = useState("sw");
  const [recipientType, setRecipientType] = useState("all");
  const [region, setRegion] = useState("");
  const [estimatedRecipients, setEstimatedRecipients] = useState(1245);
  const [isSending, setIsSending] = useState(false);

  const { templates, scheduledMessages, communications, loading } = useMessaging();

  // Get estimated recipients count based on filters
  useEffect(() => {
    const getRecipientCount = async () => {
      try {
        // Build query based on filters
        let query = supabase.from('voters').select('id', { count: 'exact' });
        
        if (recipientType === 'supporters') {
          query = query.eq('status', 'supporter');
        } else if (recipientType === 'undecided') {
          query = query.eq('status', 'undecided');
        }
        
        if (region) {
          query = query.eq('location', region);
        }
        
        const { count, error } = await query;
        
        if (!error && count !== null) {
          setEstimatedRecipients(count);
        }
      } catch (e) {
        console.error("Error getting recipient count:", e);
        // Keep default count if there's an error
      }
    };
    
    getRecipientCount();
  }, [recipientType, region]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // In a real app, you'd get the actual recipient IDs based on filters
      const success = await sendMessage(
        messageText, 
        messageType, 
        ["recipient1", "recipient2"]
      );
      
      if (success) {
        setMessageText("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleMessage = () => {
    // Show scheduling interface or dialog
    toast({
      title: "Schedule Message",
      description: "This feature will be implemented soon",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaign Messaging</h1>
        <p className="text-muted-foreground">Send messages to voters via multiple channels</p>
      </div>
      
      <Tabs defaultValue="bulk-messaging">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="bulk-messaging">Bulk Messaging</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bulk-messaging" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                  <CardDescription>Create and send messages to voters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="message-type">Message Type</Label>
                    <Select 
                      value={messageType} 
                      onValueChange={(value: "sms" | "whatsapp" | "telegram" | "ussd") => setMessageType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="ussd">USSD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label htmlFor="message">Message Content</Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="ai-assisted" className="text-sm cursor-pointer">AI Assist</Label>
                        <Switch 
                          id="ai-assisted" 
                          checked={aiAssisted}
                          onCheckedChange={setAiAssisted}
                        />
                      </div>
                    </div>
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      className="h-32"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Characters: {messageText.length}</span>
                      <span>Messages: {Math.ceil(messageText.length / 160) || 1}</span>
                    </div>
                  </div>
                  
                  {aiAssisted && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 font-normal">
                            <Wand2 size={12} className="mr-1" /> AI Suggestions
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm cursor-pointer hover:bg-muted p-1.5 rounded-md transition-colors">
                            Habari! Tunataka kukumbusha kuhusu uchaguzi kesho. Kura yako ni muhimu.
                          </p>
                          <p className="text-sm cursor-pointer hover:bg-muted p-1.5 rounded-md transition-colors">
                            Hello! Just a reminder about tomorrow's election. Your vote matters.
                          </p>
                          <p className="text-sm cursor-pointer hover:bg-muted p-1.5 rounded-md transition-colors">
                            Ndugu mpigakura, tutafurahi kukuona katika kituo cha kupigia kura kesho.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="space-y-1">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex items-center gap-1" 
                      onClick={handleSendMessage}
                      disabled={isSending || !messageText.trim()}
                    >
                      <Send size={16} /> {isSending ? "Sending..." : "Send Now"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={handleScheduleMessage}
                    >
                      <Calendar size={16} /> Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recipients</CardTitle>
                  <CardDescription>Select who will receive this message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="recipient-type">Recipient Type</Label>
                    <Select value={recipientType} onValueChange={setRecipientType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Voters</SelectItem>
                        <SelectItem value="supporters">Supporters Only</SelectItem>
                        <SelectItem value="undecided">Undecided Voters</SelectItem>
                        <SelectItem value="region">By Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="region">Region (Optional)</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtaa">Mtaa Ward</SelectItem>
                        <SelectItem value="riverside">Riverside</SelectItem>
                        <SelectItem value="uptown">Uptown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-muted/30">
                    <div className="text-sm font-medium">Estimated Recipients</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-2xl font-bold">{estimatedRecipients}</div>
                      <div className="text-xs text-muted-foreground">Voters</div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Across 3 regions and 8 wards
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle>Message Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 max-w-xs mx-auto">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xs font-medium">Campaign Message</div>
                      <div className="text-xs text-muted-foreground">10:30 AM</div>
                    </div>
                    <div className="p-3 bg-primary text-primary-foreground rounded-lg text-sm mb-1">
                      {messageText || "Your message preview will appear here..."}
                    </div>
                    <div className="flex justify-end mt-1">
                      <div className="text-xs text-muted-foreground">Delivered</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <MessageTemplatesList 
            templates={templates} 
            isLoading={loading.templates} 
          />
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          <ScheduledMessagesList 
            messages={scheduledMessages} 
            isLoading={loading.scheduled} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messaging;
