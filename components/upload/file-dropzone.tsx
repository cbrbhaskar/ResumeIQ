"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn, validateFile, formatFileSize } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export function FileDropzone({
  onFileSelect,
  className,
}: FileDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0];
      if (err?.code === "file-too-large") {
        setError("File too large. Maximum size is 5MB.");
      } else if (err?.code === "file-invalid-type") {
        setError("Invalid file type. Please upload a PDF or DOCX file.");
      } else {
        setError("Invalid file. Please try again.");
      }
    },
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-2xl border-2 border-dashed transition-all cursor-pointer",
          isDragActive
            ? "border-violet-400 bg-violet-50 dark:bg-violet-950/20 scale-[1.01]"
            : selectedFile
            ? "border-green-300 dark:border-green-800/50 bg-green-50 dark:bg-green-950/20"
            : error
            ? "border-red-300 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20"
            : "border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-950/10"
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1"
            >
              <X className="w-3 h-3" /> Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                isDragActive ? "bg-violet-100 dark:bg-violet-900/30" : "bg-gray-100 dark:bg-zinc-700"
              )}
            >
              <Upload
                className={cn(
                  "w-6 h-6 transition-colors",
                  isDragActive ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-zinc-500"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                PDF or DOCX · Max 5MB
              </p>
            </div>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
              Click to browse or drag & drop
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
