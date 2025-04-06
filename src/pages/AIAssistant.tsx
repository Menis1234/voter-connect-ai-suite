
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, Languages, MicIcon, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI campaign assistant. How can I help you with your voter outreach today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I've analyzed your voter database. There are 324 undecided voters in Mtaa Ward who haven't been contacted in the last month. Would you like me to draft SMS templates for them?",
        "Based on sentiment analysis, your recent message campaign had an 82% positive response rate. The key concerns were about transport to polling stations.",
        "I've identified 57 supporters who might need voting assistance. Should I create a task list for your delegates?",
        "According to our data, there's a 17% increase in voter engagement when messages are sent in both Swahili and English. Would you like me to create bilingual templates?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Campaign Assistant</h1>
        <p className="text-muted-foreground">Intelligent help for your campaign communications</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Ask questions about your campaign and voters
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Bot size={14} /> AI Enabled
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4 pt-0">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex space-x-2 items-center">
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about voters, campaign stats, or get message suggestions..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage} disabled={isLoading}>
                  <Send size={16} />
                </Button>
                <Button size="icon" variant="outline">
                  <MicIcon size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
              <CardDescription>What your AI assistant can do</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="features">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="mt-4 space-y-4">
                  <div className="campaign-card">
                    <div className="flex items-start gap-3">
                      <div className="circle-icon-wrapper bg-primary/10 text-primary flex-shrink-0">
                        <MessageCircle size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Message Generation</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Create campaign messages and translations in English and Swahili
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="campaign-card">
                    <div className="flex items-start gap-3">
                      <div className="circle-icon-wrapper bg-primary/10 text-primary flex-shrink-0">
                        <RefreshCw size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Data Analysis</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Analyze voter data and provide campaign insights
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="campaign-card">
                    <div className="flex items-start gap-3">
                      <div className="circle-icon-wrapper bg-primary/10 text-primary flex-shrink-0">
                        <Languages size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Multilingual Support</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Translate and respond in English and Swahili
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Suggested Prompts:</h3>
                    <div className="space-y-2">
                      <div className="text-sm p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                        "Which voters need follow-up messages?"
                      </div>
                      <div className="text-sm p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                        "Create a reminder for election day in Swahili"
                      </div>
                      <div className="text-sm p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                        "Analyze sentiment from recent messages"
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Language Settings</Label>
                        <p className="text-sm text-muted-foreground">
                          AI response languages
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Badge>English</Badge>
                        <Badge>Swahili</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-translate" defaultChecked />
                      <Label htmlFor="auto-translate">Auto-translate responses</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="sentiment-analysis" defaultChecked />
                      <Label htmlFor="sentiment-analysis">Enable sentiment analysis</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="voice-input" />
                      <Label htmlFor="voice-input">Enable voice input</Label>
                    </div>
                    
                    <div className="border-t pt-4">
                      <Button variant="outline" className="w-full">Reset AI Assistant</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
