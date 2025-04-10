
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  MessageCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata.full_name || user.email?.split("@")[0] || "User");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

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
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        expanded ? "w-64" : "w-20",
        className
      )}
    >
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
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                {userName ? userName[0]?.toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-medium">{userName || "User"}</p>
                <p className="text-xs text-muted-foreground">Campaign Manager</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full flex items-center gap-x-3 px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
              {userName ? userName[0]?.toUpperCase() : "U"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
