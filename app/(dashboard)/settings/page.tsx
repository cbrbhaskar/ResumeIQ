"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Lock, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
      setFullName(session.user.name || "");
    }
  }, [session]);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Name updated successfully" });
    } catch {
      toast({ title: "Error", description: "Could not update name", variant: "destructive" });
    } finally {
      setNameLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirmation must match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast({ title: "Password updated successfully" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not update password", variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mt-1">Manage your profile and security</p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Profile</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Update your display name</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Email</Label>
              <Input value={email} disabled className="h-10 bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500" />
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>
            <Button type="submit" loading={nameLoading} size="sm">
              Save Changes
            </Button>
          </form>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Set a new password for your account</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="h-10"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="h-10"
                required
              />
            </div>
            <Button type="submit" loading={passwordLoading} size="sm">
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-red-50 dark:border-red-900/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Irreversible actions</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() =>
                toast({
                  title: "Contact support",
                  description: "To delete your account, please contact support.",
                })
              }
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
