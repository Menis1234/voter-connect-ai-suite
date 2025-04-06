
import { useState } from "react";
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
  UserCheck, 
  Edit, 
  Trash, 
  Filter, 
  Download 
} from "lucide-react";
import { useVoters } from "@/hooks/useVoters";
import AddVoterDialog from "@/components/voters/AddVoterDialog";
import AssignDelegateDialog from "@/components/voters/AssignDelegateDialog";
import { toast } from "sonner";

const Voters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addVoterOpen, setAddVoterOpen] = useState(false);
  const [assignDelegateOpen, setAssignDelegateOpen] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);
  
  const { voters, loading, fetchVoters, deleteVoter } = useVoters();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "supporter": return "bg-emerald-100 text-emerald-800";
      case "undecided": return "bg-amber-100 text-amber-800";
      case "opposed": return "bg-rose-100 text-rose-800";
      case "unknown": 
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getSentimentIcon = (score?: number) => {
    if (score === undefined) return null;
    if (score >= 0.6) return "🟢";
    if (score >= 0.3) return "🟡";
    if (score >= 0) return "⚪";
    return "🔴";
  };
  
  const handleDeleteVoter = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this voter?")) {
      const result = await deleteVoter(id);
      if (result.success) {
        toast.success("Voter deleted successfully");
      }
    }
  };
  
  const handleAssignDelegate = (voterId: string) => {
    setSelectedVoterId(voterId);
    setAssignDelegateOpen(true);
  };
  
  // Filter voters based on search term
  const filteredVoters = searchTerm
    ? voters.filter(voter => 
        voter.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.phone_number?.includes(searchTerm) ||
        voter.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.ward?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : voters;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Voters Database</h1>
          <p className="text-muted-foreground">Manage and track your campaign voters</p>
        </div>
        <Button className="flex items-center gap-1" onClick={() => setAddVoterOpen(true)}>
          <Plus size={16} /> Add Voter
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Registered Voters</CardTitle>
              <CardDescription>
                Total of {voters.length} voters in the database
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search voters..."
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
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Loading voters...
                    </TableCell>
                  </TableRow>
                ) : filteredVoters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No voters found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVoters.map((voter) => (
                    <TableRow key={voter.id}>
                      <TableCell className="font-medium">
                        <div>{voter.full_name}</div>
                        {voter.delegate_id && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <UserCheck size={12} /> Assigned to delegate
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{voter.phone_number || 'N/A'}</TableCell>
                      <TableCell>
                        <div>{voter.location || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{voter.ward || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(voter.voter_status || 'unknown')}>
                          {(voter.voter_status?.charAt(0).toUpperCase() + voter.voter_status?.slice(1)) || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{getSentimentIcon(voter.sentiment_score)}</span>
                          <span className="text-xs text-muted-foreground">
                            {voter.sentiment_score !== undefined 
                              ? (voter.sentiment_score * 100).toFixed(0) + '%' 
                              : 'N/A'}
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
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleAssignDelegate(voter.id)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" /> Assign Delegate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-destructive"
                              onClick={() => handleDeleteVoter(voter.id)}
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

      <AddVoterDialog 
        open={addVoterOpen} 
        onClose={() => setAddVoterOpen(false)} 
        onVoterAdded={fetchVoters}
      />

      {selectedVoterId && (
        <AssignDelegateDialog
          open={assignDelegateOpen}
          onClose={() => setAssignDelegateOpen(false)}
          voterId={selectedVoterId}
          onAssigned={fetchVoters}
        />
      )}
    </div>
  );
};

export default Voters;
