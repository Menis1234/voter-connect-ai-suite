
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Calendar, 
  MapPin, 
  Settings,
  Menu,
  X,
  UserCheck,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Voters", href: "/voters", icon: Users },
    { name: "Delegates", href: "/delegates", icon: UserCheck },
    { name: "Messaging", href: "/messaging", icon: MessageSquare },
    { name: "AI Assistant", href: "/ai-assistant", icon: MessageCircle },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Campaign Scheduler", href: "/scheduler", icon: Calendar },
    { name: "Election Day", href: "/election-day", icon: MapPin },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      expanded ? "w-64" : "w-20",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-6">
        {expanded ? (
          <h1 className="text-xl font-bold">VoterOS</h1>
        ) : (
          <span className="mx-auto text-xl font-bold">V</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="text-sidebar-foreground"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )
                }
              >
                <item.icon size={20} />
                {expanded && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {expanded ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">Campaign Manager</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            A
          </div>
        )}
      </div>
    </div>
  );
}
