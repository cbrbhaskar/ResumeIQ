"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportAnalysisToPDF } from "@/lib/analysis-pdf-export";
import { Scan, ScanResult } from "@/lib/types";

interface ExportAnalysisButtonProps {
  scan: Scan;
  result: ScanResult;
}

export function ExportAnalysisButton({ scan, result }: ExportAnalysisButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAnalysisToPDF({ scan, result });
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {isExporting ? "Exporting..." : "Export PDF"}
    </Button>
  );
}
