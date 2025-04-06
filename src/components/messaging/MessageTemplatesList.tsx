
import { useState } from "react";
import { MessageTemplate } from "@/types/database";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMessageTemplate } from "@/services/messageService";
import { Pencil, Copy, Plus, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MessageTemplatesListProps {
  templates: MessageTemplate[];
  isLoading: boolean;
}

export function MessageTemplatesList({ templates, isLoading }: MessageTemplatesListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    content: "",
    message_type: "sms",
    language: "sw"
  });

  const handleCreateTemplate = async () => {
    if (!newTemplate.title || !newTemplate.content) return;
    
    setIsCreating(true);
    await createMessageTemplate({
      title: newTemplate.title,
      content: newTemplate.content,
      message_type: newTemplate.message_type as "sms" | "whatsapp" | "telegram" | "ussd",
      language: newTemplate.language
    });
    
    setIsCreating(false);
    setNewTemplate({
      title: "",
      content: "",
      message_type: "sms",
      language: "sw"
    });
  };

  const handleUseTemplate = (content: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(content);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Message Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Message Templates</h3>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" /> Create Template
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>New Message Template</SheetTitle>
              <SheetDescription>
                Create a reusable template for your messages
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-title">Template Title</Label>
                <Input
                  id="template-title"
                  placeholder="E.g. Election Day Reminder"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="message-type">Message Type</Label>
                  <Select 
                    value={newTemplate.message_type}
                    onValueChange={(value) => setNewTemplate(prev => ({ ...prev, message_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="ussd">USSD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={newTemplate.language}
                    onValueChange={(value) => setNewTemplate(prev => ({ ...prev, language: value }))}
                  >
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-content">Message Content</Label>
                <Textarea
                  id="template-content"
                  placeholder="Type your message template here..."
                  className="h-32"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                />
                <div className="text-xs text-muted-foreground">
                  Characters: {newTemplate.content.length} | Messages: {Math.ceil(newTemplate.content.length / 160) || 1}
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleCreateTemplate}
                disabled={isCreating || !newTemplate.title || !newTemplate.content}
              >
                {isCreating ? "Creating..." : "Save Template"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {templates.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No message templates yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create templates to save time when sending messages</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-md">{template.title}</CardTitle>
                  <Badge variant="outline">{template.message_type.toUpperCase()}</Badge>
                </div>
                <CardDescription>
                  {new Date(template.created_at).toLocaleDateString()} · {template.language.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{template.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template.content)}>
                  <Copy size={14} className="mr-1" /> Use
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil size={14} className="mr-1" /> Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
