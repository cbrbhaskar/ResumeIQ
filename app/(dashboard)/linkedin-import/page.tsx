"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Linkedin, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { LinkedInProfile } from "@/lib/types";

export default function LinkedInImportPage() {
  const [linkedInData, setLinkedInData] = useState<LinkedInProfile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    loadLinkedInData();
  }, []);

  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      toast({
        title: "LinkedIn connected",
        description: "Your profile data was synced successfully.",
      });
    }

    const error = searchParams.get("error");
    if (error) {
      toast({
        title: "LinkedIn sync failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [searchParams]);

  async function loadLinkedInData() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Get user profile with LinkedIn data
      const { data: profile } = await supabase
        .from("profiles")
        .select("linkedin_data, skills")
        .eq("id", user.id)
        .single();

      if (profile?.linkedin_data) {
        const parsed =
          typeof profile.linkedin_data === "string"
            ? JSON.parse(profile.linkedin_data)
            : profile.linkedin_data;
        setLinkedInData(parsed as LinkedInProfile);
      }

      if (profile?.skills) {
        setSkills(profile.skills);
      }
    } catch (error) {
      console.error("Failed to load LinkedIn data:", error);
      toast({
        title: "Error",
        description: "Failed to load LinkedIn data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleReImport() {
    setImporting(true);
    try {
      window.location.href = "/api/linkedin/start";
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Re-import failed",
        variant: "destructive",
      });
      setImporting(false);
    }
  }

  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkill.trim()) return;

    if (skills.includes(newSkill)) {
      toast({
        title: "Duplicate skill",
        description: "This skill is already in your list",
        variant: "destructive",
      });
      return;
    }

    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    setNewSkill("");
    await saveSkills(updatedSkills);
  }

  async function handleRemoveSkill(skillToRemove: string) {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
    await saveSkills(updatedSkills);
  }

  async function saveSkills(updatedSkills: string[]) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ skills: updatedSkills, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skills updated successfully",
      });
    } catch (error) {
      console.error("Failed to save skills:", error);
      toast({
        title: "Error",
        description: "Failed to save skills",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">LinkedIn Import</h1>
          <p className="text-gray-600 dark:text-zinc-400">Loading your LinkedIn data...</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">LinkedIn Integration</h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Import your professional profile data to auto-fill your resume
        </p>
      </div>

      {linkedInData ? (
        <>
          {/* LinkedIn Profile Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linkedin-blue/10 flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{linkedInData.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{linkedInData.email}</p>
                </div>
              </div>
              <Button
                onClick={handleReImport}
                loading={importing}
                className="gap-2"
              >
                Re-import Profile
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Job Title</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {linkedInData.headline}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Location</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{linkedInData.location}</p>
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Skills</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Manage your professional skills for resume optimization
              </p>
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <Input
                placeholder="Add a new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="h-11"
              />
              <Button type="submit" className="gap-2" disabled={!newSkill.trim()}>
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </form>

            {/* Skills List */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-full"
                  >
                    <span className="text-sm font-medium text-violet-900 dark:text-violet-200">{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="p-0.5 hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full transition-colors"
                      type="button"
                    >
                      <Trash2 className="w-3 h-3 text-violet-600 dark:text-violet-300" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-zinc-400 py-2">No skills added yet</p>
            )}
          </div>

          {/* Import to Resume */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl border border-violet-200 dark:border-violet-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ready to update your resume?</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
              Your LinkedIn data is synced and ready to auto-fill your resume form. Skills will be added as editable tags.
            </p>
            <Button
              onClick={() => router.push("/dashboard/resume")}
              className="gap-2"
              variant="default"
            >
              Go to Resume Builder
            </Button>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center space-y-4">
          <Linkedin className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No LinkedIn Data Found</h3>
          <p className="text-gray-600 dark:text-zinc-400 max-w-sm mx-auto">
            You haven't connected your LinkedIn profile yet. Use "Continue with LinkedIn" on the login or signup page to import your professional data.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
            <Button onClick={() => router.push("/signup")}>
              Create Account with LinkedIn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
