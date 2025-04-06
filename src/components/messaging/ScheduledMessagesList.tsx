
import { useState } from "react";
import { ScheduledMessage } from "@/types/database";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertCircle, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ScheduledMessagesListProps {
  messages: ScheduledMessage[];
  isLoading: boolean;
}

export function ScheduledMessagesList({ messages, isLoading }: ScheduledMessagesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Scheduled Messages</h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case 'sent': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'cancelled': return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case 'failed': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scheduled Messages</h3>
        <Button variant="outline" size="sm">
          <Calendar size={16} className="mr-1" /> Schedule Message
        </Button>
      </div>
      
      {messages.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No scheduled messages</p>
            <p className="text-sm text-muted-foreground mb-4">Plan your communication in advance</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Smartphone size={18} />
                    <CardTitle className="text-md">{message.message_type.toUpperCase()}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(message.status)}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Calendar size={14} />
                  {format(new Date(message.scheduled_for), "MMM dd, yyyy")}
                  <Clock size={14} className="ml-2" />
                  {format(new Date(message.scheduled_for), "h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap mb-2">{message.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Recipients: {message.estimated_recipients || "Unknown"}</span>
                  <span>•</span>
                  <span>Language: {message.language.toUpperCase()}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                {message.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      Cancel
                    </Button>
                  </>
                )}
                {message.status === 'failed' && (
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <AlertCircle size={14} className="mr-1" /> View Error
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
