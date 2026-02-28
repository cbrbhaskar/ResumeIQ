"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/upload/file-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { ShimmerButton } from "@/components/ui/shimmer-button";
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
  ScanLine,
} from "lucide-react";

type Step = "idle" | "uploading" | "parsing" | "analyzing" | "finishing";

const STEP_MESSAGES: Record<Step, { heading: string; sub: string }> = {
  idle: { heading: "", sub: "" },
  uploading: { heading: "Uploading your resume", sub: "Securely transferring your file…" },
  parsing: { heading: "Parsing document", sub: "Extracting text and structure…" },
  analyzing: { heading: "Running analysis", sub: "Scoring keywords, skills & formatting — about 15 seconds" },
  finishing: { heading: "Almost done", sub: "Saving your results…" },
};

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Upload Resume" },
    { n: 2, label: "Job Description" },
    { n: 3, label: "Analyse" },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map(({ n, label }, i) => {
        const done = step > n;
        const active = step === n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-violet-700" : done ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 sm:w-16 mx-2 transition-colors ${
                  step > n + 1 ? "bg-emerald-400" : step > n ? "bg-violet-300" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CharacterRing({ count, min = 30 }: { count: number; min?: number }) {
  const pct = Math.min(count / min, 1);
  const radius = 10;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pct);

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90">
      <circle cx="14" cy="14" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle
        cx="14"
        cy="14"
        r={radius}
        fill="none"
        stroke={pct >= 1 ? "#10b981" : "#7c3aed"}
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
    </svg>
  );
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const router = useRouter();

  const jdLength = jobDescription.trim().length;
  const isReady = file !== null && jdLength >= 30;
  const isLoading = step !== "idle";

  // Derived step indicator
  const indicatorStep: 1 | 2 | 3 = file ? (jdLength >= 30 ? 3 : 2) : 1;

  async function handleAnalyze() {
    if (!file || jdLength < 30) return;

    setStep("uploading");

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

      setStep("parsing");
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
      setStep("idle");
      return;
    }

    setStep("analyzing");

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, resumeUrl, resumeFileName }),
      });

      setStep("finishing");
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
      setStep("idle");
    }
  }

  const progressPct =
    step === "uploading" ? 20 : step === "parsing" ? 40 : step === "analyzing" ? 70 : step === "finishing" ? 92 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-3 py-1 mb-3">
          <ScanLine className="w-3.5 h-3.5 text-violet-600" />
          <span className="text-xs font-semibold text-violet-700">New Analysis</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Analyse My Resume</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload your resume and paste the job description — we'll score it against ATS systems in seconds.
        </p>
      </div>

      <StepIndicator step={indicatorStep} />

      <div className="space-y-4">
        {/* Step 1 — Resume upload */}
        <div
          className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${
            file ? "border-emerald-200 shadow-emerald-100/50" : "border-gray-100"
          }`}
        >
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                file
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
              }`}
            >
              {file ? <CheckCircle2 className="w-3.5 h-3.5" /> : "1"}
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-900">Upload Resume</h2>
              <p className="text-xs text-gray-400">PDF or DOCX · max 5 MB</p>
            </div>
            <FileText className={`w-4 h-4 ${file ? "text-emerald-500" : "text-gray-300"}`} />
          </div>
          <div className="p-6">
            <FileDropzone onFileSelect={setFile} />
          </div>
        </div>

        {/* Step 2 — Job description */}
        <div
          className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all ${
            jdLength >= 30 ? "border-emerald-200 shadow-emerald-100/50" : "border-gray-100"
          }`}
        >
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                jdLength >= 30
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
              }`}
            >
              {jdLength >= 30 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "2"}
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-900">Job Description</h2>
              <p className="text-xs text-gray-400">Paste the full posting for best accuracy</p>
            </div>
            <Target className={`w-4 h-4 ${jdLength >= 30 ? "text-emerald-500" : "text-gray-300"}`} />
          </div>
          <div className="p-6 space-y-3">
            <Textarea
              placeholder={"Paste the full job description here…\n\nInclude requirements, responsibilities, and qualifications for the best results."}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] resize-none text-sm focus-visible:ring-violet-500"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {jobDescription.length > 0 && jobDescription.length < 30 && (
                  <span className="flex items-center gap-1 text-xs text-amber-500">
                    <AlertTriangle className="w-3 h-3" />
                    Add more detail for better accuracy
                  </span>
                )}
                {jdLength >= 30 && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Looks good
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{jobDescription.length} chars</span>
                <CharacterRing count={jobDescription.length} min={30} />
              </div>
            </div>
          </div>
        </div>

        {/* Analyse button */}
        <div className="space-y-3 pt-1">
          <ShimmerButton
            variant="primary"
            disabled={!isReady || isLoading}
            onClick={handleAnalyze}
            className="w-full h-13 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {STEP_MESSAGES[step].heading || "Processing…"}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyse Resume
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </ShimmerButton>

          {/* Progress panel */}
          {isLoading && (
            <div className="rounded-2xl bg-violet-50 border border-violet-100 p-5">
              {/* Step cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(["parsing", "analyzing", "finishing"] as Step[]).map((s, i) => {
                  const stepIdx = ["parsing", "analyzing", "finishing"].indexOf(step);
                  const thisIdx = i;
                  const done = stepIdx > thisIdx;
                  const active = stepIdx === thisIdx;
                  const labels = ["Parsing resume", "Running analysis", "Saving results"];
                  return (
                    <div
                      key={s}
                      className={`rounded-xl px-3 py-2.5 text-center text-xs font-medium border transition-all ${
                        done
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : active
                          ? "bg-violet-100 border-violet-200 text-violet-800"
                          : "bg-white border-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? "✓ " : active ? "⟳ " : ""}
                      {labels[i]}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(to right, #7c3aed, #4f46e5, #06b6d4)",
                    transition: "width 2s ease",
                  }}
                />
              </div>
              <p className="text-xs text-violet-500 mt-2 text-center">
                {STEP_MESSAGES[step].sub}
              </p>
            </div>
          )}

          {!isLoading && !isReady && (
            <p className="text-center text-xs text-gray-400">
              {!file ? "Upload a resume to continue" : "Paste a job description (30+ characters) to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
