
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, User, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Delegate } from "@/types";

type AssignDelegateDialogProps = {
  open: boolean;
  onClose: () => void;
  voterId: string;
  onAssigned: () => void;
};

const AssignDelegateDialog = ({ 
  open, 
  onClose, 
  voterId, 
  onAssigned 
}: AssignDelegateDialogProps) => {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDelegates();
    }
  }, [open]);

  const fetchDelegates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('delegates')
        .select('*');
      
      if (error) throw error;
      
      setDelegates(data as Delegate[]);
    } catch (error) {
      console.error("Error fetching delegates:", error);
      toast.error("Failed to load delegates");
    } finally {
      setLoading(false);
    }
  };

  const assignDelegate = async (delegateId: string) => {
    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('voters')
        .update({ delegate_id: delegateId })
        .eq('id', voterId);
      
      if (error) throw error;
      
      toast.success("Delegate assigned successfully");
      onAssigned();
      onClose();
    } catch (error) {
      console.error("Error assigning delegate:", error);
      toast.error("Failed to assign delegate");
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredDelegates = searchTerm
    ? delegates.filter(delegate => 
        delegate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delegate.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delegate.phone?.includes(searchTerm)
      )
    : delegates;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Delegate</DialogTitle>
          <DialogDescription>
            Select a delegate to assign to this voter.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search delegates..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border overflow-hidden max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Loading delegates...
                  </TableCell>
                </TableRow>
              ) : filteredDelegates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No delegates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDelegates.map((delegate) => (
                  <TableRow key={delegate.id} className="cursor-pointer hover:bg-muted" onClick={() => assignDelegate(delegate.id)}>
                    <TableCell>
                      <User size={18} />
                    </TableCell>
                    <TableCell className="font-medium">{delegate.name}</TableCell>
                    <TableCell>{delegate.region || 'N/A'}</TableCell>
                    <TableCell>{delegate.phone || 'N/A'}</TableCell>
                    <TableCell className="text-right capitalize">{delegate.role}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isAssigning}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDelegateDialog;
