// @ts-nocheck
/**
 * Analysis PDF Export
 * Generates PDF reports of ATS analysis results
 */

import { ScanResult, Scan } from "@/lib/types";

interface AnalysisReportData {
  scan: Scan;
  result: ScanResult;
}

/**
 * Generate HTML for analysis PDF report
 */
function generateAnalysisHTML(data: AnalysisReportData): string {
  const { scan, result } = data;
  const timestamp = new Date(result.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background-color: white;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          border-bottom: 3px solid #7c3aed;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          color: #7c3aed;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .job-title {
          color: #666;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .meta {
          color: #999;
          font-size: 13px;
        }

        .score-section {
          display: flex;
          gap: 30px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .score-card {
          flex: 1;
          min-width: 150px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .score-card.high {
          border-color: #10b981;
          background-color: #f0fdf4;
        }
        .score-card.medium {
          border-color: #f59e0b;
          background-color: #fffbf0;
        }
        .score-card.low {
          border-color: #ef4444;
          background-color: #fef2f2;
        }
        .score-value {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .score-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section {
          margin-bottom: 35px;
        }
        h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #7c3aed;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background-color: #f3f4f6;
          color: #374151;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #d1d5db;
          font-size: 13px;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        tr:last-child td {
          border-bottom: none;
        }

        .keyword-matched {
          color: #10b981;
          font-weight: 600;
        }
        .keyword-missing {
          color: #ef4444;
          font-weight: 600;
        }

        .skill-matched {
          display: inline-block;
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 4px 8px;
          border-radius: 4px;
          margin: 2px;
          font-size: 12px;
        }
        .skill-missing {
          display: inline-block;
          background-color: #ffe4e6;
          color: #be123c;
          padding: 4px 8px;
          border-radius: 4px;
          margin: 2px;
          font-size: 12px;
        }

        .issue-high {
          border-left: 4px solid #ef4444;
          background-color: #fef2f2;
        }
        .issue-medium {
          border-left: 4px solid #f59e0b;
          background-color: #fffbf0;
        }
        .issue-low {
          border-left: 4px solid #06b6d4;
          background-color: #f0f9fa;
        }

        .issue-box {
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        .issue-title {
          font-weight: 600;
          margin-bottom: 5px;
          font-size: 13px;
        }
        .issue-description {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .issue-fix {
          font-size: 12px;
          color: #10b981;
          font-style: italic;
        }

        .suggestion-box {
          border-left: 4px solid #7c3aed;
          padding: 12px;
          margin-bottom: 12px;
          background-color: #faf5ff;
          border-radius: 4px;
        }
        .suggestion-priority {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 3px;
          margin-right: 8px;
          margin-bottom: 5px;
        }
        .suggestion-priority.high {
          background-color: #fee2e2;
          color: #c2255c;
        }
        .suggestion-priority.medium {
          background-color: #fef3c7;
          color: #d97706;
        }
        .suggestion-priority.low {
          background-color: #dbeafe;
          color: #0284c7;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #999;
          text-align: center;
        }

        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>ATS Analysis Report</h1>
          ${scan.job_title ? `<div class="job-title">${scan.job_title}</div>` : ""}
          <div class="meta">
            Generated on ${timestamp}
          </div>
        </div>

        <!-- Overall Score -->
        <div class="score-section">
          <div class="score-card ${result.overall_score >= 80 ? "high" : result.overall_score >= 60 ? "medium" : "low"}">
            <div class="score-value">${result.overall_score}</div>
            <div class="score-label">Overall ATS Score</div>
          </div>
          <div class="score-card ${result.keyword_match_score >= 80 ? "high" : result.keyword_match_score >= 60 ? "medium" : "low"}">
            <div class="score-value">${result.keyword_match_score}</div>
            <div class="score-label">Keyword Match</div>
          </div>
          <div class="score-card ${result.skills_match_score >= 80 ? "high" : result.skills_match_score >= 60 ? "medium" : "low"}">
            <div class="score-value">${result.skills_match_score}</div>
            <div class="score-label">Skills Match</div>
          </div>
          <div class="score-card ${result.formatting_score >= 80 ? "high" : result.formatting_score >= 60 ? "medium" : "low"}">
            <div class="score-value">${result.formatting_score}</div>
            <div class="score-label">Formatting</div>
          </div>
        </div>

        <!-- Role Alignment -->
        ${
          result.seniority_alignment
            ? `
          <div class="section">
            <h2>Role Alignment</h2>
            <p>${result.seniority_alignment}</p>
          </div>
        `
            : ""
        }

        <!-- Keywords -->
        <div class="section">
          <h2>Keyword Analysis</h2>
          ${
            result.keyword_matches.length > 0
              ? `
            <h3 style="color: #10b981; font-size: 14px; margin-bottom: 8px;">Matched Keywords (${result.keyword_matches.length})</h3>
            <div style="margin-bottom: 15px;">
              ${result.keyword_matches.map((kw) => `<span class="keyword-matched">${kw}</span>`).join("")}
            </div>
          `
              : ""
          }
          ${
            result.missing_keywords.length > 0
              ? `
            <h3 style="color: #ef4444; font-size: 14px; margin-bottom: 8px;">Missing Keywords (${result.missing_keywords.length})</h3>
            <div>
              ${result.missing_keywords.map((kw) => `<span class="keyword-missing">${kw}</span>`).join("")}
            </div>
          `
              : ""
          }
        </div>

        <!-- Skills -->
        <div class="section">
          <h2>Skills Analysis</h2>
          ${
            result.hard_skills_matched.length > 0
              ? `
            <h3 style="font-size: 13px; margin-bottom: 8px; color: #0369a1;">Hard Skills Matched</h3>
            <div style="margin-bottom: 15px;">
              ${result.hard_skills_matched.map((s) => `<span class="skill-matched">${s}</span>`).join("")}
            </div>
          `
              : ""
          }
          ${
            result.hard_skills_missing.length > 0
              ? `
            <h3 style="font-size: 13px; margin-bottom: 8px; color: #be123c;">Hard Skills Missing</h3>
            <div style="margin-bottom: 15px;">
              ${result.hard_skills_missing.map((s) => `<span class="skill-missing">${s}</span>`).join("")}
            </div>
          `
              : ""
          }
          ${
            result.soft_skills_matched.length > 0
              ? `
            <h3 style="font-size: 13px; margin-bottom: 8px; color: #0369a1;">Soft Skills Matched</h3>
            <div style="margin-bottom: 15px;">
              ${result.soft_skills_matched.map((s) => `<span class="skill-matched">${s}</span>`).join("")}
            </div>
          `
              : ""
          }
        </div>

        <!-- Formatting Issues -->
        ${
          result.formatting_issues.length > 0
            ? `
          <div class="section page-break">
            <h2>Formatting & ATS Safety Issues</h2>
            ${result.formatting_issues
              .map(
                (issue) => `
              <div class="issue-box issue-${issue.severity}">
                <div class="issue-title">${issue.issue}</div>
                <div class="issue-description">${issue.issue}</div>
                <div class="issue-fix">Fix: ${issue.fix}</div>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <!-- Section Quality -->
        <div class="section">
          <h2>Resume Structure</h2>
          <table>
            <tr>
              <th>Section</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>Contact Information</td>
              <td>${result.section_quality.has_contact ? "✓ Yes" : "✗ Missing"}</td>
            </tr>
            <tr>
              <td>Professional Summary</td>
              <td>${result.section_quality.has_summary ? "✓ Yes" : "✗ Missing"}</td>
            </tr>
            <tr>
              <td>Experience</td>
              <td>${result.section_quality.has_experience ? "✓ Yes" : "✗ Missing"}</td>
            </tr>
            <tr>
              <td>Education</td>
              <td>${result.section_quality.has_education ? "✓ Yes" : "✗ Missing"}</td>
            </tr>
            <tr>
              <td>Skills</td>
              <td>${result.section_quality.has_skills ? "✓ Yes" : "✗ Missing"}</td>
            </tr>
          </table>
        </div>

        <!-- Suggestions -->
        ${
          result.suggestions.length > 0
            ? `
          <div class="section">
            <h2>Improvement Suggestions</h2>
            ${result.suggestions
              .map(
                (suggestion) => `
              <div class="suggestion-box">
                <span class="suggestion-priority ${suggestion.priority}">${suggestion.priority.toUpperCase()}</span>
                <div style="font-weight: 600; color: #1f2937; margin-bottom: 5px; font-size: 13px;">
                  ${suggestion.category}
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 5px;">
                  ${suggestion.suggestion}
                </div>
                ${suggestion.example ? `<div style="font-size: 12px; color: #7c3aed; font-style: italic;">Example: ${suggestion.example}</div>` : ""}
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <!-- Footer -->
        <div class="footer">
          <p>This report was generated by ResumeOps ATS Analysis Tool</p>
          <p>For best results, implement the suggestions above and re-scan your resume</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Export analysis to PDF
 */
export async function exportAnalysisToPDF(
  data: AnalysisReportData
): Promise<void> {
  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const html = generateAnalysisHTML(data);
    const element = document.createElement("div");
    element.innerHTML = html;

    const opt = {
      margin: 5,
      filename: `ATS_Analysis_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "png" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Failed to export analysis PDF:", error);
    throw new Error("Failed to export analysis results as PDF");
  }
}

/**
 * Generate analysis PDF blob
 */
export async function generateAnalysisPDFBlob(
  data: AnalysisReportData
): Promise<Blob> {
  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const html = generateAnalysisHTML(data);
    const element = document.createElement("div");
    element.innerHTML = html;

    const opt = {
      margin: 5,
      image: { type: "png" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      pagebreak: { mode: ["css", "legacy"] },
    };

    return new Promise((resolve, reject) => {
      html2pdf()
        .set(opt)
        .from(element)
        .outputPdf("blob")
        .then(resolve)
        .catch(reject);
    });
  } catch (error) {
    console.error("Failed to generate analysis PDF blob:", error);
    throw new Error("Failed to generate analysis PDF");
  }
}
