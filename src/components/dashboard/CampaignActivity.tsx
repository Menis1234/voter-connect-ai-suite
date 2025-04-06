
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActivityItem = {
  id: string;
  action: string;
  timestamp: string;
  region?: string;
  type: "sms" | "whatsapp" | "telegram" | "system" | "delegate";
  status?: "success" | "pending" | "failed";
};

type CampaignActivityProps = {
  activities: ActivityItem[];
};

export function CampaignActivity({ activities }: CampaignActivityProps) {
  const getTypeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "sms": return "bg-blue-100 text-blue-800";
      case "whatsapp": return "bg-green-100 text-green-800";
      case "telegram": return "bg-indigo-100 text-indigo-800";
      case "system": return "bg-gray-100 text-gray-800";
      case "delegate": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: ActivityItem["status"]) => {
    switch (status) {
      case "success": return "bg-emerald-100 text-emerald-800";
      case "pending": return "bg-amber-100 text-amber-800";
      case "failed": return "bg-rose-100 text-rose-800";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Activity</CardTitle>
        <CardDescription>Recent campaign actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-between items-start border-b pb-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getTypeColor(activity.type)}>
                    {activity.type.toUpperCase()}
                  </Badge>
                  {activity.status && (
                    <Badge variant="outline" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                {activity.region && (
                  <p className="text-xs text-muted-foreground">Region: {activity.region}</p>
                )}
              </div>
              <time className="text-xs text-muted-foreground">{activity.timestamp}</time>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
