
import { 
  Users, 
  UserCheck, 
  MessageSquare, 
  TrendingUp, 
  MapPin,
  Activity
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CampaignActivity } from "@/components/dashboard/CampaignActivity";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/types";

// Mock data for dashboard
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    action: "Bulk SMS sent to Mtaa Ward",
    timestamp: "10:30 AM",
    region: "Mtaa Ward",
    type: "sms",
    status: "success"
  },
  {
    id: "2",
    action: "WhatsApp reminder to supporters",
    timestamp: "9:15 AM",
    type: "whatsapp",
    status: "pending"
  },
  {
    id: "3",
    action: "Delegate John assigned 25 new voters",
    timestamp: "Yesterday",
    region: "Central",
    type: "delegate",
    status: "success"
  },
  {
    id: "4",
    action: "Failed to deliver SMS to 12 numbers",
    timestamp: "Yesterday",
    type: "sms",
    status: "failed"
  },
  {
    id: "5",
    action: "AI sentiment analysis completed",
    timestamp: "2 days ago",
    type: "system",
    status: "success"
  },
];

const sentimentData = [
  { type: "Positive", value: 540, color: "#10B981" },
  { type: "Neutral", value: 320, color: "#6B7280" },
  { type: "Negative", value: 140, color: "#EF4444" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
        <p className="text-muted-foreground">Overview of your campaign performance and activities</p>
      </div>
      
      <div className="dashboard-grid">
        <StatsCard 
          title="Total Voters" 
          value="1,245" 
          icon={<Users size={18} />} 
          description="Last 30 days"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="Active Delegates" 
          value="32" 
          icon={<UserCheck size={18} />} 
          description="Across 8 regions"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard 
          title="Messages Sent" 
          value="16,823" 
          icon={<MessageSquare size={18} />} 
          description="SMS, WhatsApp, Telegram"
        />
        <StatsCard 
          title="Supporter Conversion" 
          value="67%" 
          icon={<TrendingUp size={18} />} 
          description="From undecided voters"
          trend={{ value: 3, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentChart data={sentimentData} />
        <CampaignActivity activities={mockActivities} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Engagement by Region</CardTitle>
            <CardDescription>Voter engagement across different regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border border-dashed rounded-md">
              <p className="text-muted-foreground">Region Engagement Chart</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Election Day Countdown</CardTitle>
            <CardDescription>Time remaining for campaign activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">42</div>
              <div className="text-xl font-medium">Days Left</div>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium flex items-center gap-1">
                  <Activity size={16} /> Next Major Milestone
                </h4>
                <p className="text-sm mt-1">Regional Rally in Central Ward - 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Polling Stations</CardTitle>
          <CardDescription>Overview of voter distribution by polling station</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
            <div className="text-center space-y-2">
              <MapPin className="mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Polling Station Map</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
