// @ts-nocheck
/**
 * PDF Export Function
 * Generates professional PDF resumes from template
 * Uses html2pdf for client-side PDF generation
 */

import { TemplateId, ResumeData, ALL_TEMPLATES } from "./templates";

/**
 * Generate HTML markup for resume based on template
 */
function generateResumeHTML(
  templateId: TemplateId,
  data: ResumeData
): string {
  const template = ALL_TEMPLATES[templateId];
  const { colors, fonts, spacing, layout } = template.style;

  const sectionHeaderStyle = `
    color: ${colors.primary};
    font-family: ${fonts.heading};
    font-size: 12px;
    font-weight: bold;
    border-bottom: 2px solid ${colors.accent};
    padding-bottom: 6px;
    margin-top: ${spacing.sectionGap}pt;
    margin-bottom: ${spacing.sectionGap / 2}pt;
  `;

  const itemStyle = `
    margin-bottom: ${spacing.itemGap}pt;
    font-family: ${fonts.body};
    font-size: 10px;
    color: ${colors.text};
  `;

  const textStyle = `
    color: ${colors.secondary};
    font-size: 9px;
  `;

  if (layout.hasSidebar) {
    // Sidebar layout
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; }
          body {
            font-family: ${fonts.body};
            color: ${colors.text};
            line-height: 1.4;
          }
          .container {
            display: flex;
            width: 100%;
            gap: 24pt;
          }
          .sidebar {
            width: 30%;
            border-right: 2px solid ${colors.accent};
            padding-right: 24pt;
          }
          .main {
            width: 70%;
          }
          .header { margin-bottom: 24pt; }
          .header h1 {
            font-family: ${fonts.heading};
            font-size: 20pt;
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 4pt;
          }
          .header p {
            font-size: 9px;
            color: ${colors.secondary};
          }
          .section-header { ${sectionHeaderStyle} }
          .job { ${itemStyle} }
          .job-title {
            font-weight: 600;
            font-size: 10px;
          }
          .job-meta { ${textStyle} margin-top: 2pt; }
          .job-desc { font-size: 10px; margin-top: 4pt; }
          .skill-category {
            color: ${colors.primary};
            font-weight: 600;
            font-size: 9px;
            margin-top: 8pt;
          }
          .skill-items {
            ${textStyle}
            margin-top: 2pt;
            word-wrap: break-word;
          }
          .edu { ${itemStyle} }
          .edu-school {
            font-weight: 600;
            font-size: 10px;
            display: flex;
            justify-content: space-between;
          }
          .edu-meta { ${textStyle} }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Sidebar -->
          <div class="sidebar">
            ${
              data.skills && data.skills.length > 0
                ? `
              <div class="section-header">SKILLS</div>
              ${data.skills
                .map(
                  (sg) => `
                <div class="skill-category">${sg.category}</div>
                <div class="skill-items">${sg.items.join(", ")}</div>
              `
                )
                .join("")}
            `
                : ""
            }
          </div>

          <!-- Main Content -->
          <div class="main">
            <!-- Header -->
            <div class="header">
              <h1>${data.personal.name}</h1>
              <p>${data.personal.email} | ${data.personal.phone} | ${data.personal.location}</p>
            </div>

            ${
              data.summary
                ? `
              <div class="section-header">PROFESSIONAL SUMMARY</div>
              <p style="font-size: 10px; margin-bottom: ${spacing.itemGap}pt;">${data.summary}</p>
            `
                : ""
            }

            ${
              data.experience && data.experience.length > 0
                ? `
              <div class="section-header">EXPERIENCE</div>
              ${data.experience
                .map(
                  (job) => `
                <div class="job">
                  <div class="job-title">${job.title} at ${job.company}</div>
                  <div class="job-meta">${job.startDate} – ${job.current ? "Present" : job.endDate}</div>
                  <div class="job-desc">${job.description}</div>
                </div>
              `
                )
                .join("")}
            `
                : ""
            }

            ${
              data.education && data.education.length > 0
                ? `
              <div class="section-header">EDUCATION</div>
              ${data.education
                .map(
                  (edu) => `
                <div class="edu">
                  <div class="edu-school">
                    <span>${edu.school}</span>
                    <span style="color: ${colors.secondary}; font-size: 9px;">${edu.graduationDate}</span>
                  </div>
                  <div class="edu-meta">${edu.degree} in ${edu.field}</div>
                  ${edu.gpa ? `<div class="edu-meta">GPA: ${edu.gpa}</div>` : ""}
                </div>
              `
                )
                .join("")}
            `
                : ""
            }

            ${
              data.certifications && data.certifications.length > 0
                ? `
              <div class="section-header">CERTIFICATIONS</div>
              ${data.certifications
                .map(
                  (cert) => `
                <div style="margin-bottom: ${spacing.itemGap}pt;">
                  <div style="font-weight: 600; font-size: 10px;">${cert.name}</div>
                  <div style="color: ${colors.secondary}; font-size: 9px;">${cert.issuer} • ${cert.date}</div>
                </div>
              `
                )
                .join("")}
            `
                : ""
            }
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    // Single column layouts
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; }
          body {
            font-family: ${fonts.body};
            color: ${colors.text};
            line-height: 1.4;
            max-width: 8.5in;
            margin: 0 auto;
          }
          .header {
            margin-bottom: 24pt;
            ${layout.headerStyle !== "minimal" ? `border-bottom: ${layout.headerStyle === "prominent" ? "4px" : "2px"} solid ${colors.accent};` : ""}
            padding-bottom: 12pt;
          }
          .header h1 {
            font-family: ${fonts.heading};
            font-size: ${layout.headerStyle === "prominent" ? "24pt" : layout.headerStyle === "accent" ? "18pt" : "16pt"};
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 4pt;
          }
          .header p {
            font-size: 9px;
            color: ${colors.secondary};
          }
          .section-header { ${sectionHeaderStyle} }
          .job { ${itemStyle} }
          .job-header {
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          .job-meta { ${textStyle} }
          .job-desc { font-size: 10px; margin-top: 4pt; }
          .edu { ${itemStyle} }
          .edu-header {
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          .edu-meta { ${textStyle} }
          .skill-line {
            margin-bottom: 6pt;
            font-size: 10px;
          }
          .skill-category {
            font-weight: 600;
            color: ${colors.primary};
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <h1>${data.personal.name}</h1>
          <p>${data.personal.email} | ${data.personal.phone} | ${data.personal.location}</p>
        </div>

        ${
          data.summary
            ? `
          <div class="section-header">PROFESSIONAL SUMMARY</div>
          <p style="font-size: 10px; margin-bottom: ${spacing.itemGap}pt;">${data.summary}</p>
        `
            : ""
        }

        ${
          data.experience && data.experience.length > 0
            ? `
          <div class="section-header">EXPERIENCE</div>
          ${data.experience
            .map(
              (job) => `
            <div class="job">
              <div class="job-header">
                <span>${job.title}</span>
                <span style="color: ${colors.secondary}; font-size: 9px;">${job.startDate} – ${job.current ? "Present" : job.endDate}</span>
              </div>
              <div class="job-meta">${job.company}</div>
              <div class="job-desc">${job.description}</div>
            </div>
          `
            )
            .join("")}
        `
            : ""
        }

        ${
          data.education && data.education.length > 0
            ? `
          <div class="section-header">EDUCATION</div>
          ${data.education
            .map(
              (edu) => `
            <div class="edu">
              <div class="edu-header">
                <span>${edu.school}</span>
                <span style="color: ${colors.secondary}; font-size: 9px;">${edu.graduationDate}</span>
              </div>
              <div class="edu-meta">${edu.degree} in ${edu.field}</div>
              ${edu.gpa ? `<div class="edu-meta">GPA: ${edu.gpa}</div>` : ""}
            </div>
          `
            )
            .join("")}
        `
            : ""
        }

        ${
          data.skills && data.skills.length > 0
            ? `
          <div class="section-header">SKILLS</div>
          ${data.skills
            .map(
              (sg) => `
            <div class="skill-line">
              <span class="skill-category">${sg.category}:</span> ${sg.items.join(", ")}
            </div>
          `
            )
            .join("")}
        `
            : ""
        }

        ${
          data.certifications && data.certifications.length > 0
            ? `
          <div class="section-header">CERTIFICATIONS</div>
          ${data.certifications
            .map(
              (cert) => `
            <div style="margin-bottom: ${spacing.itemGap}pt;">
              <div style="font-weight: 600; font-size: 10px;">${cert.name}</div>
              <div style="color: ${colors.secondary}; font-size: 9px;">${cert.issuer} • ${cert.date}</div>
            </div>
          `
            )
            .join("")}
        `
            : ""
        }
      </body>
      </html>
    `;
  }
}

/**
 * Export resume to PDF
 * @param userData - Resume data to export
 * @param templateId - Template to use
 * @returns Promise that resolves when PDF is downloaded
 */
export async function exportResumeToPDF(
  userData: ResumeData,
  templateId: TemplateId
): Promise<void> {
  const template = ALL_TEMPLATES[templateId];

  try {
    // Dynamically import html2pdf
    const html2pdf = (await import("html2pdf.js")).default;

    const html = generateResumeHTML(templateId, userData);
    const element = document.createElement("div");
    element.innerHTML = html;

    const opt = {
      margin: 10,
      filename: `Resume_${userData.personal.name.replace(/\s+/g, "_")}_${templateId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Failed to export PDF:", error);
    throw new Error("Failed to export resume as PDF");
  }
}

/**
 * Generate base64 PDF blob for preview
 */
export async function generateResumePDFBlob(
  userData: ResumeData,
  templateId: TemplateId
): Promise<Blob> {
  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const html = generateResumeHTML(templateId, userData);
    const element = document.createElement("div");
    element.innerHTML = html;

    const opt = {
      margin: 10,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
    console.error("Failed to generate PDF blob:", error);
    throw new Error("Failed to generate PDF");
  }
}
