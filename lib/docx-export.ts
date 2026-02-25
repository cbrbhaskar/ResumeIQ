// @ts-nocheck
/**
 * DOCX Export Function
 * Generates professional DOCX resumes that are ATS-friendly and editable
 * Uses docx library for client-side DOCX generation
 */

import { TemplateId, ResumeData, ALL_TEMPLATES } from "./templates";

/**
 * Strip # from hex color for docx library
 */
function toDocxColor(hex: string): string {
  return hex.replace("#", "").toUpperCase().padStart(6, "0");
}

/**
 * Create a styled section header paragraph
 */
function makeSectionHeader(text: string, primaryColor: string) {
  const { Paragraph, TextRun, BorderStyle } = require("docx");
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 11 * 2,
        color: toDocxColor(primaryColor),
      }),
    ],
    border: {
      bottom: {
        color: "CCCCCC",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    spacing: { after: 150, before: 200 },
  });
}

/**
 * Export resume to DOCX
 */
export async function exportResumeToDocx(
  userData: ResumeData,
  templateId: TemplateId
): Promise<void> {
  try {
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      AlignmentType,
      BorderStyle,
      convertInchesToTwip,
    } = await import("docx");

    const template = ALL_TEMPLATES[templateId];
    const { colors } = template.style;
    const primaryColor = toDocxColor(colors.primary);

    const sections: any[] = [];

    // Header — Name
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: userData.personal.name,
            bold: true,
            size: 24 * 2,
            color: primaryColor,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

    // Contact info
    const contactParts = [
      userData.personal.email,
      userData.personal.phone,
      userData.personal.location,
      userData.personal.linkedin ? `LinkedIn: ${userData.personal.linkedin}` : "",
      userData.personal.website ? `Website: ${userData.personal.website}` : "",
    ].filter(Boolean);

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 9 * 2,
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Summary
    if (userData.summary) {
      sections.push(makeSectionHeader("PROFESSIONAL SUMMARY", colors.primary));
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: userData.summary, size: 10 * 2 })],
          spacing: { after: 150 },
        })
      );
    }

    // Experience
    if (userData.experience && userData.experience.length > 0) {
      sections.push(makeSectionHeader("EXPERIENCE", colors.primary));
      userData.experience.forEach((job) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: job.title, bold: true, size: 10 * 2 }),
              new TextRun({ text: ` at ${job.company}`, size: 10 * 2 }),
            ],
            spacing: { after: 50 },
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${job.startDate} – ${job.current ? "Present" : job.endDate}`,
                size: 9 * 2,
                color: "666666",
              }),
            ],
            spacing: { after: 50 },
          })
        );
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: job.description, size: 10 * 2 })],
            spacing: { after: 100 },
          })
        );
        if (job.achievements && job.achievements.length > 0) {
          job.achievements.forEach((achievement) => {
            sections.push(
              new Paragraph({
                children: [new TextRun({ text: `• ${achievement}`, size: 10 * 2 })],
                spacing: { after: 50 },
                indent: { left: 360 },
              })
            );
          });
        }
        sections.push(new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 100 } }));
      });
    }

    // Education
    if (userData.education && userData.education.length > 0) {
      sections.push(makeSectionHeader("EDUCATION", colors.primary));
      userData.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.school, bold: true, size: 10 * 2 }),
              new TextRun({ text: ` — ${edu.graduationDate}`, size: 9 * 2, color: "666666" }),
            ],
            spacing: { after: 50 },
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} in ${edu.field}${edu.gpa ? ` (GPA: ${edu.gpa})` : ""}`,
                size: 10 * 2,
                color: "666666",
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    // Skills
    if (userData.skills && userData.skills.length > 0) {
      sections.push(makeSectionHeader("SKILLS", colors.primary));
      userData.skills.forEach((skillGroup) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${skillGroup.category}: `, bold: true, size: 10 * 2 }),
              new TextRun({ text: skillGroup.items.join(", "), size: 10 * 2 }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    // Certifications
    if (userData.certifications && userData.certifications.length > 0) {
      sections.push(makeSectionHeader("CERTIFICATIONS", colors.primary));
      userData.certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: cert.name, bold: true, size: 10 * 2 }),
              new TextRun({ text: ` — ${cert.issuer} (${cert.date})`, size: 9 * 2, color: "666666" }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margins: {
                top: convertInchesToTwip(0.5),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.5),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: sections,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_${userData.personal.name.replace(/\s+/g, "_")}_${templateId}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Failed to export DOCX:", error);
    throw new Error("Failed to export resume as DOCX");
  }
}

/**
 * Generate DOCX blob for preview
 */
export async function generateResumeDocxBlob(
  userData: ResumeData,
  templateId: TemplateId
): Promise<Blob> {
  try {
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      AlignmentType,
      BorderStyle,
      convertInchesToTwip,
    } = await import("docx");

    const template = ALL_TEMPLATES[templateId];
    const { colors } = template.style;
    const primaryColor = toDocxColor(colors.primary);

    const sections: any[] = [];

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: userData.personal.name, bold: true, size: 24 * 2, color: primaryColor }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

    const contactInfo = [
      userData.personal.email,
      userData.personal.phone,
      userData.personal.location,
    ]
      .filter(Boolean)
      .join(" | ");

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: contactInfo, size: 9 * 2, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    if (userData.summary) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 11 * 2 })],
          spacing: { after: 100, before: 200 },
        })
      );
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: userData.summary, size: 10 * 2 })],
          spacing: { after: 150 },
        })
      );
    }

    if (userData.experience && userData.experience.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 11 * 2 })],
          spacing: { after: 100, before: 200 },
        })
      );
      userData.experience.forEach((job) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${job.title} at ${job.company}`, bold: true, size: 10 * 2 }),
            ],
            spacing: { after: 50 },
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${job.startDate} – ${job.current ? "Present" : job.endDate}`,
                size: 9 * 2,
                color: "666666",
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    if (userData.education && userData.education.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "EDUCATION", bold: true, size: 11 * 2 })],
          spacing: { after: 100, before: 200 },
        })
      );
      userData.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.school} — ${edu.degree} in ${edu.field} (${edu.graduationDate})`,
                size: 10 * 2,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    if (userData.skills && userData.skills.length > 0) {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: "SKILLS", bold: true, size: 11 * 2 })],
          spacing: { after: 100, before: 200 },
        })
      );
      userData.skills.forEach((skillGroup) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${skillGroup.category}: `, bold: true, size: 10 * 2 }),
              new TextRun({ text: skillGroup.items.join(", "), size: 10 * 2 }),
            ],
            spacing: { after: 100 },
          })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margins: {
                top: convertInchesToTwip(0.5),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.5),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: sections,
        },
      ],
    });

    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Failed to generate DOCX blob:", error);
    throw new Error("Failed to generate DOCX");
  }
}
