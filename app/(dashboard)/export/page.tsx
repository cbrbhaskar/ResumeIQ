"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "@/components/TemplateSelector";
import { TemplateId, MOCK_RESUME_DATA } from "@/lib/templates";
import { exportResumeToPDF } from "@/lib/pdf-export";
import { exportResumeToDocx } from "@/lib/docx-export";
import { Download, FileText, FileCode, Loader2 } from "lucide-react";

export default function ExportPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      setExportError(null);
      await exportResumeToPDF(MOCK_RESUME_DATA, selectedTemplate);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to download PDF"
      );
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      setExportError(null);
      await exportResumeToDocx(MOCK_RESUME_DATA, selectedTemplate);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to download DOCX"
      );
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Export Resume
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Select a template and download your professional resume as PDF or DOCX
        </p>
      </div>

      {/* Error messages */}
      {exportError && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">
            {exportError}
          </p>
        </div>
      )}

      {/* Template Selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          showPreview={true}
        />
      </div>

      {/* Download Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Download Options
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* PDF Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF || isExportingDocx}
            className="ring-1 ring-gray-200 dark:ring-zinc-800 rounded-lg p-6 text-left hover:ring-violet-400 dark:hover:ring-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              {isExportingPDF && (
                <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Download as PDF
            </h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-4">
              Professional PDF format. Perfect for submitting to job applications.
            </p>

            <Button
              size="sm"
              className="w-full"
              disabled={isExportingPDF || isExportingDocx}
            >
              <Download className="w-4 h-4" />
              {isExportingPDF ? "Downloading..." : "Download PDF"}
            </Button>
          </button>

          {/* DOCX Download */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingPDF || isExportingDocx}
            className="ring-1 ring-gray-200 dark:ring-zinc-800 rounded-lg p-6 text-left hover:ring-violet-400 dark:hover:ring-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                <FileCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              {isExportingDocx && (
                <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Download as DOCX
            </h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-4">
              Editable Word document. Customize further in Microsoft Word.
            </p>

            <Button
              size="sm"
              className="w-full"
              disabled={isExportingPDF || isExportingDocx}
            >
              <Download className="w-4 h-4" />
              {isExportingDocx ? "Downloading..." : "Download DOCX"}
            </Button>
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Both formats are ATS-optimized and designed to pass through applicant tracking systems while maintaining professional formatting.
          </p>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
          Export Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
          <li className="flex gap-2">
            <span className="text-violet-500 font-bold">•</span>
            <span>
              <strong>For job applications:</strong> Use PDF format to preserve
              exact formatting
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-500 font-bold">•</span>
            <span>
              <strong>For custom edits:</strong> Use DOCX format to make
              adjustments in Word
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-500 font-bold">•</span>
            <span>
              <strong>ATS Optimization:</strong> Simple formatting ensures better
              ATS compatibility
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-violet-500 font-bold">•</span>
            <span>
              <strong>File sizes:</strong> Both formats are under 500KB for quick
              uploads
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
