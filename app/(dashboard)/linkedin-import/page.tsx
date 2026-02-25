"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Linkedin, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import type { LinkedInProfile } from "@/lib/types";

export default function LinkedInImportPage() {
  const { data: session, status } = useSession();
  const [linkedInData] = useState<LinkedInProfile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

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
      toast({ title: "Duplicate skill", description: "This skill is already in your list", variant: "destructive" });
      return;
    }

    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill("");
    toast({ title: "Success", description: "Skill added" });
  }

  async function handleRemoveSkill(skillToRemove: string) {
    setSkills(skills.filter((s) => s !== skillToRemove));
  }

  if (loading || status === "loading") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">LinkedIn Import</h1>
          <p className="text-gray-600 dark:text-zinc-400">Loading...</p>
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
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{linkedInData.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{linkedInData.email}</p>
                </div>
              </div>
              <Button onClick={handleReImport} loading={importing} className="gap-2">
                Re-import Profile
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Skills</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">Manage your professional skills</p>
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <Input placeholder="Add a new skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="h-11" />
              <Button type="submit" className="gap-2" disabled={!newSkill.trim()}>
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </form>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <div key={skill} className="inline-flex items-center gap-2 px-3 py-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-full">
                    <span className="text-sm font-medium text-violet-900 dark:text-violet-200">{skill}</span>
                    <button onClick={() => handleRemoveSkill(skill)} className="p-0.5 hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full transition-colors" type="button">
                      <Trash2 className="w-3 h-3 text-violet-600 dark:text-violet-300" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-zinc-400 py-2">No skills added yet</p>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center space-y-4">
          <Linkedin className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connect LinkedIn</h3>
          <p className="text-gray-600 dark:text-zinc-400 max-w-sm mx-auto">
            Import your LinkedIn profile to auto-populate resume data and skills.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={handleReImport} loading={importing} className="gap-2">
              <Linkedin className="w-4 h-4" />
              Connect LinkedIn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
