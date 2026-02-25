"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/upload/file-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();

  const isReady = file && jobDescription.trim().length >= 30;
  const isLoading = uploading || analyzing;

  async function handleAnalyze() {
    if (!file || !jobDescription.trim()) return;

    if (jobDescription.trim().length < 30) {
      toast({
        title: "Job description too short",
        description: "Please paste the full job description for accurate analysis.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    let resumeText = "";
    let resumeUrl = "";
    let resumeFileName = file.name;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        if (uploadRes.status === 401) {
          router.push("/login?redirectTo=/upload");
          return;
        }
        throw new Error(uploadData.error || "Upload failed");
      }

      resumeText = uploadData.resumeText;
      resumeUrl = uploadData.resumeUrl;
      resumeFileName = uploadData.fileName || file.name;
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Could not upload your resume.",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    setUploading(false);
    setAnalyzing(true);

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          resumeUrl,
          resumeFileName,
        }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        if (analyzeData.upgrade_needed) {
          router.push("/pricing?reason=limit");
          return;
        }
        throw new Error(analyzeData.error || "Analysis failed");
      }

      router.push(`/results/${analyzeData.scanId}`);
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Could not analyze your resume.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Scan</h1>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mt-1">
          Upload your resume and paste the job description to get your ATS score
        </p>
      </div>

      <div className="space-y-5">
        {/* Step 1 — Resume */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">1</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Upload Resume</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">PDF or DOCX, max 5MB</p>
              </div>
              <FileText className="w-4 h-4 text-gray-300 dark:text-zinc-600 ml-auto" />
            </div>
          </div>
          <div className="p-6">
            <FileDropzone onFileSelect={setFile} />
          </div>
        </div>

        {/* Step 2 — Job description */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Job Description</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  Paste the full job posting for most accurate analysis
                </p>
              </div>
              <Target className="w-4 h-4 text-gray-300 dark:text-zinc-600 ml-auto" />
            </div>
          </div>
          <div className="p-6 space-y-3">
            <Textarea
              placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, and qualifications for best results."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[220px] resize-none text-sm"
            />
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
              <span>{jobDescription.length} characters</span>
              {jobDescription.length > 0 && jobDescription.length < 30 && (
                <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  Add more detail for better accuracy
                </span>
              )}
              {jobDescription.length >= 30 && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Looks good
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Analyze button + progress */}
        <div className="space-y-4">
          <Button
            size="lg"
            disabled={!isReady || isLoading}
            onClick={handleAnalyze}
            className="w-full h-12 font-semibold text-base shadow-md shadow-violet-200/50 dark:shadow-violet-900/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? "Uploading resume..." : "Analyzing with AI..."}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Resume
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {isLoading && (
            <div className="rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                  {uploading ? (
                    <Upload className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-pulse" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">
                    {uploading ? "Uploading your resume" : "AI is analyzing your resume"}
                  </p>
                  <p className="text-xs text-violet-400 dark:text-violet-500 mt-0.5">
                    {uploading
                      ? "Extracting text from your file..."
                      : "Scoring keywords, skills, and formatting — about 15 seconds"}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1 bg-violet-100 dark:bg-violet-900/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{
                    width: analyzing ? "75%" : "30%",
                    transition: "width 3s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
