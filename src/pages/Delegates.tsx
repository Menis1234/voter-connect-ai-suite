import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  MessageSquare, 
  Users,
  Edit, 
  Trash, 
  Filter, 
  Download 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Delegate } from "@/types";
import AddDelegateDialog from "@/components/delegates/AddDelegateDialog";
import TanzanianFlag from "@/components/TanzanianFlag"; // Updated import

const Delegates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDelegateOpen, setAddDelegateOpen] = useState(false);
  
  useEffect(() => {
    fetchDelegates();
  }, []);
  
  const fetchDelegates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('delegates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDelegates(data as Delegate[]);
    } catch (error) {
      console.error("Error fetching delegates:", error);
      toast.error("Failed to load delegates");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteDelegate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this delegate?")) {
      try {
        const { error } = await supabase
          .from('delegates')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setDelegates(prev => prev.filter(delegate => delegate.id !== id));
        toast.success("Delegate deleted successfully");
      } catch (error) {
        console.error("Error deleting delegate:", error);
        toast.error("Failed to delete delegate");
      }
    }
  };
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "senior": return "bg-blue-100 text-blue-800";
      case "coordinator": return "bg-purple-100 text-purple-800";
      case "junior":
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const filteredDelegates = searchTerm
    ? delegates.filter(delegate => 
        delegate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delegate.phone?.includes(searchTerm) ||
        delegate.region?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : delegates;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
    }}>
      <div className="flex justify-between items-center bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <TanzanianFlag className="w-12 h-8" /> {/* Updated to TanzanianFlag */}
          <div>
            <h1 className="text-3xl font-bold">Delegates Network</h1>
            <p className="text-muted-foreground">Manage and track your campaign delegates</p>
          </div>
        </div>
        <Button className="flex items-center gap-1" onClick={() => setAddDelegateOpen(true)}>
          <Plus size={16} /> Add Delegate
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Campaign Delegates</CardTitle>
              <CardDescription>
                Total of {delegates.length} delegates in the network
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search delegates..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter size={16} />
                </Button>
                <Button variant="outline" size="icon">
                  <Download size={16} />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      Loading delegates...
                    </TableCell>
                  </TableRow>
                ) : filteredDelegates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No delegates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDelegates.map((delegate) => (
                    <TableRow key={delegate.id}>
                      <TableCell>
                        {delegate.profile_picture ? (
                          <img
                            src={delegate.profile_picture}
                            alt={delegate.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">{delegate.name.charAt(0)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{delegate.name}</div>
                      </TableCell>
                      <TableCell>{delegate.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <div>{delegate.region || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{delegate.ward || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeClass(delegate.role)}>
                          {delegate.role.charAt(0).toUpperCase() + delegate.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(delegate.performanceScore || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {delegate.performanceScore ? (delegate.performanceScore * 100).toFixed(0) + '%' : 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Users className="mr-2 h-4 w-4" /> View Assigned Voters
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-destructive"
                              onClick={() => handleDeleteDelegate(delegate.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddDelegateDialog 
        open={addDelegateOpen} 
        onClose={() => setAddDelegateOpen(false)} 
        onDelegateAdded={fetchDelegates}
      />
    </div>
  );
};

export default Delegates;