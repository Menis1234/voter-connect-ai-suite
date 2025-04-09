// src/pages/Settings.tsx
import React, { useState, useEffect } from "react"; // Add React import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Fallback if use-local-storage is not available
const useLocalStorage = (key: string, initialValue: string) => {
  try {
    const [value, setValue] = useState(() => {
      const stored = localStorage.getItem(key);
      return stored ? stored : initialValue;
    });

    useEffect(() => {
      localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue] as const;
  } catch (error) {
    console.error("Error using localStorage:", error);
    return [initialValue, (newValue: string) => {}] as const;
  }
};

// Define validation schemas
const emailUsernameSchema = z.object({
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type EmailUsernameFormData = z.infer<typeof emailUsernameSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Settings = () => {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [language, setLanguage] = useLocalStorage("language", "en");
  const [region, setRegion] = useLocalStorage("region", "TZ");
  const [fontSize, setFontSize] = useLocalStorage("fontSize", "medium");
  const [layout, setLayout] = useLocalStorage("layout", "default");
  const [isEmailUsernameSubmitting, setIsEmailUsernameSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Apply the theme to the document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Apply font size and layout
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize === "small" ? "14px" : fontSize === "medium" ? "16px" : "18px");
    document.documentElement.classList.remove("layout-default", "layout-compact");
    document.documentElement.classList.add(`layout-${layout}`);
  }, [fontSize, layout]);

  // Email/Username form
  const emailUsernameForm = useForm<EmailUsernameFormData>({
    resolver: zodResolver(emailUsernameSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Handle email/username change
  const handleEmailUsernameChange = async (data: EmailUsernameFormData) => {
    if (!data.email && !data.username) {
      toast.error("Please provide at least an email or username to update");
      return;
    }

    setIsEmailUsernameSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email || undefined,
        data: { username: data.username || undefined },
      });
      if (error) throw error;
      toast.success("Email/Username updated successfully");
      emailUsernameForm.reset();
    } catch (error) {
      console.error("Error updating email/username:", error);
      toast.error("Failed to update email/username");
    } finally {
      setIsEmailUsernameSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsPasswordSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  // Handle language and region change
  const handleLanguageRegionChange = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { language, region },
      });
      if (error) throw error;
      toast.success(`Language set to ${language}, Region set to ${region}`);
    } catch (error) {
      console.error("Error saving language and region:", error);
      toast.error("Failed to save language and region");
    }
  };

  // Handle font size and layout change
  const handleFontSizeLayoutChange = () => {
    toast.success(`Font size set to ${fontSize}, Layout set to ${layout}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Manage your account and campaign settings.</p>

      {/* Change Email/Username */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Email/Username</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...emailUsernameForm}>
            <form onSubmit={emailUsernameForm.handleSubmit(handleEmailUsernameChange)} className="space-y-4">
              <FormField
                control={emailUsernameForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="newemail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailUsernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="newusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isEmailUsernameSubmitting}>
                {isEmailUsernameSubmitting ? "Updating..." : "Update Email/Username"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPasswordSubmitting}>
                {isPasswordSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TZ">Tanzania</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="UG">Uganda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleLanguageRegionChange}>Save Language & Region</Button>
        </CardContent>
      </Card>

      {/* Dark Mode / Light Mode Toggle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Font Size and Layout Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Font Size and Layout Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="font-size">Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="layout">Layout</Label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger id="layout">
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleFontSizeLayoutChange}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;