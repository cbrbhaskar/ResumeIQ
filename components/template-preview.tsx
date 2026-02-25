"use client";

import { TemplateId, ResumeData, ALL_TEMPLATES } from "@/lib/templates";

interface TemplatePreviewProps {
  templateId: TemplateId;
  data: ResumeData;
}

export function TemplatePreview({ templateId, data }: TemplatePreviewProps) {
  const template = ALL_TEMPLATES[templateId];
  const { colors, fonts, spacing, layout } = template.style;

  const sectionHeaderStyle = {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: "13px",
    fontWeight: "bold",
    borderBottom: `2px solid ${colors.accent}`,
    paddingBottom: "6px",
    marginTop: spacing.sectionGap,
    marginBottom: spacing.sectionGap / 2,
  };

  const itemStyle = {
    marginBottom: spacing.itemGap,
    fontFamily: fonts.body,
    fontSize: "11px",
    color: colors.text,
  };

  const textStyle = {
    color: colors.secondary,
    fontSize: "10px",
  };

  if (layout.hasSidebar) {
    // Modern/Technical layout with sidebar
    return (
      <div
        className="p-12 min-h-[1100px]"
        style={{
          backgroundColor: colors.light,
          fontFamily: fonts.body,
          color: colors.text,
        }}
      >
        <div className="grid grid-cols-3 gap-8">
          {/* Sidebar */}
          <div
            className="pt-4"
            style={{
              borderRight: `2px solid ${colors.accent}`,
              paddingRight: "24px",
            }}
          >
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <div
                  style={{
                    ...sectionHeaderStyle,
                    borderBottom: `2px solid ${colors.accent}`,
                    marginTop: 0,
                  }}
                >
                  SKILLS
                </div>
                {data.skills.map((skillGroup, idx) => (
                  <div key={idx} className="mb-4">
                    <p
                      style={{
                        color: colors.primary,
                        fontWeight: "600",
                        fontSize: "10px",
                      }}
                    >
                      {skillGroup.category}
                    </p>
                    <p style={{ ...textStyle, marginTop: "4px" }}>
                      {skillGroup.items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-2">
            {/* Header */}
            <div className="mb-6">
              <h1
                style={{
                  fontFamily: fonts.heading,
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {data.personal.name}
              </h1>
              <p style={textStyle}>
                {data.personal.email} | {data.personal.phone} |{" "}
                {data.personal.location}
              </p>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="mb-4">
                <div style={sectionHeaderStyle}>PROFESSIONAL SUMMARY</div>
                <p style={itemStyle}>{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div>
                <div style={sectionHeaderStyle}>EXPERIENCE</div>
                {data.experience.map((job, idx) => (
                  <div key={idx} style={itemStyle}>
                    <div style={{ fontWeight: "600" }}>
                      {job.title} at {job.company}
                    </div>
                    <div style={textStyle}>
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </div>
                    <p style={{ fontSize: "10px", marginTop: "4px" }}>
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <div style={sectionHeaderStyle}>EDUCATION</div>
                {data.education.map((edu, idx) => (
                  <div key={idx} style={itemStyle}>
                    <div style={{ fontWeight: "600" }}>
                      {edu.degree} in {edu.field}
                    </div>
                    <div style={textStyle}>{edu.school}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // Single column layouts
    return (
      <div
        className="p-12 min-h-[1100px]"
        style={{
          backgroundColor: colors.light,
          fontFamily: fonts.body,
          color: colors.text,
        }}
      >
        {/* Header */}
        <div
          className={`mb-6 pb-6 ${
            layout.headerStyle === "prominent"
              ? "border-b-4"
              : layout.headerStyle === "accent"
              ? "border-b-2"
              : ""
          }`}
          style={
            layout.headerStyle !== "minimal"
              ? { borderColor: colors.accent }
              : {}
          }
        >
          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize:
                layout.headerStyle === "prominent"
                  ? "28px"
                  : layout.headerStyle === "accent"
                  ? "22px"
                  : "20px",
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            {data.personal.name}
          </h1>
          <p style={{ ...textStyle, marginTop: "6px" }}>
            {data.personal.email} | {data.personal.phone} |{" "}
            {data.personal.location}
          </p>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-4">
            <div style={sectionHeaderStyle}>PROFESSIONAL SUMMARY</div>
            <p style={itemStyle}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <div style={sectionHeaderStyle}>EXPERIENCE</div>
            {data.experience.map((job, idx) => (
              <div key={idx} style={itemStyle}>
                <div
                  style={{
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{job.title}</span>
                  <span style={textStyle}>
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </span>
                </div>
                <div style={textStyle}>{job.company}</div>
                <p style={{ fontSize: "10px", marginTop: "4px" }}>
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <div style={sectionHeaderStyle}>EDUCATION</div>
            {data.education.map((edu, idx) => (
              <div key={idx} style={itemStyle}>
                <div
                  style={{
                    fontWeight: "600",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{edu.school}</span>
                  <span style={textStyle}>{edu.graduationDate}</span>
                </div>
                <div style={textStyle}>
                  {edu.degree} in {edu.field}
                </div>
                {edu.gpa && (
                  <div style={textStyle}>GPA: {edu.gpa}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <div style={sectionHeaderStyle}>SKILLS</div>
            {data.skills.map((skillGroup, idx) => (
              <div key={idx} style={{ ...itemStyle, marginBottom: "8px" }}>
                <span style={{ fontWeight: "600", color: colors.primary }}>
                  {skillGroup.category}:
                </span>{" "}
                <span style={{ fontSize: "10px" }}>
                  {skillGroup.items.join(", ")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <div style={sectionHeaderStyle}>CERTIFICATIONS</div>
            {data.certifications.map((cert, idx) => (
              <div key={idx} style={itemStyle}>
                <div style={{ fontWeight: "600" }}>{cert.name}</div>
                <div style={textStyle}>
                  {cert.issuer} • {cert.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
