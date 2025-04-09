// src/components/voters/AddVoterDialog.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const voterSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone_number: z.string().regex(/^\+255\d{9}$/, "Phone number must be in the format +255XXXXXXXXX"),
  location: z.string().min(1, "Location is required"),
  ward: z.string().min(1, "Ward is required"),
  voter_status: z.enum(["supporter", "undecided", "opposed", "unknown"]).default("unknown"),
  sentiment_score: z.number().min(0).max(1).optional(),
  profile_picture: z.any().optional(),
  is_registered: z.boolean().default(false),
});

type VoterFormData = z.infer<typeof voterSchema>;

interface AddVoterDialogProps {
  open: boolean;
  onClose: () => void;
  onVoterAdded: () => void;
}

const AddVoterDialog = ({ open, onClose, onVoterAdded }: AddVoterDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<VoterFormData>({
    resolver: zodResolver(voterSchema),
    defaultValues: {
      full_name: "",
      phone_number: "+255",
      location: "",
      ward: "",
      voter_status: "unknown",
      sentiment_score: undefined,
      profile_picture: null,
      is_registered: false,
    },
  });

  const onSubmit = async (data: VoterFormData) => {
    setIsSubmitting(true);
    try {
      let profilePictureUrl: string | null = null;

      // Handle profile picture upload if a file is selected
      if (data.profile_picture && data.profile_picture instanceof File) {
        const fileExt = data.profile_picture.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, data.profile_picture);

        if (uploadError) {
          throw new Error("Failed to upload profile picture: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(fileName);

        profilePictureUrl = publicUrlData.publicUrl;
      }

      // Insert voter data into Supabase
      const { error } = await supabase.from("voters").insert({
        full_name: data.full_name,
        phone_number: data.phone_number,
        location: data.location,
        ward: data.ward,
        voter_status: data.voter_status,
        sentiment_score: data.sentiment_score,
        profile_picture: profilePictureUrl,
        is_registered: data.is_registered,
      });

      if (error) {
        throw new Error("Failed to add voter: " + error.message);
      }

      toast.success("Voter added successfully");
      onVoterAdded();
      form.reset();
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Error adding voter:", error);
      toast.error(error.message || "Failed to add voter");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Voter</DialogTitle>
          <DialogDescription>
            Enter the details of the new voter below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 9 digits (e.g., 123456789)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Dar es Salaam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <Input placeholder="Kivukoni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voter_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voter Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supporter">Supporter</SelectItem>
                        <SelectItem value="undecided">Undecided</SelectItem>
                        <SelectItem value="opposed">Opposed</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {preview ? (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              field.onChange(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <span className="text-xs">X</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreview(URL.createObjectURL(file));
                            field.onChange(file);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_registered"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    Is Registered Voter
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Voter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVoterDialog;