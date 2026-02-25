/**
 * Resume Template Definitions
 * 5 professional ATS-optimized templates with layout, styling, and spacing
 */

export type TemplateId = "classic" | "modern" | "executive" | "creative" | "technical";

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    link?: string;
    date?: string;
  }>;
  publications?: Array<{
    title: string;
    publication: string;
    date: string;
    link?: string;
  }>;
}

export interface TemplateStyle {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    light: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    padding: number;
  };
  layout: {
    hasHeaderImage?: boolean;
    hasSidebar?: boolean;
    headerStyle: "minimal" | "prominent" | "accent";
  };
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  style: TemplateStyle;
  previewImage?: string;
}

// 1. CLASSIC TEMPLATE - Clean, minimal, professional
export const classicTemplate: Template = {
  id: "classic",
  name: "Classic",
  description: "Clean and minimal design, perfect for any industry",
  style: {
    name: "Classic",
    description: "Traditional ATS-friendly format",
    colors: {
      primary: "#1f2937",
      secondary: "#6b7280",
      text: "#111827",
      light: "#f3f4f6",
      accent: "#3b82f6",
    },
    fonts: {
      heading: "Arial, sans-serif",
      body: "Calibri, sans-serif",
    },
    spacing: {
      sectionGap: 12,
      itemGap: 8,
      padding: 0.5,
    },
    layout: {
      hasHeaderImage: false,
      hasSidebar: false,
      headerStyle: "minimal",
    },
  },
};

// 2. MODERN TEMPLATE - With sidebar for skills
export const modernTemplate: Template = {
  id: "modern",
  name: "Modern",
  description: "Contemporary design with sidebar for skills and highlights",
  style: {
    name: "Modern",
    description: "Two-column layout with sidebar",
    colors: {
      primary: "#0f172a",
      secondary: "#64748b",
      text: "#1e293b",
      light: "#f1f5f9",
      accent: "#06b6d4",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Segoe UI, sans-serif",
    },
    spacing: {
      sectionGap: 16,
      itemGap: 10,
      padding: 1,
    },
    layout: {
      hasHeaderImage: false,
      hasSidebar: true,
      headerStyle: "accent",
    },
  },
};

// 3. EXECUTIVE TEMPLATE - Formal, professional
export const executiveTemplate: Template = {
  id: "executive",
  name: "Executive",
  description: "Professional and polished for leadership and executive roles",
  style: {
    name: "Executive",
    description: "Formal executive presentation",
    colors: {
      primary: "#1e1e1e",
      secondary: "#404040",
      text: "#2d2d2d",
      light: "#f5f5f5",
      accent: "#d4a574",
    },
    fonts: {
      heading: "Garamond, serif",
      body: "Times New Roman, serif",
    },
    spacing: {
      sectionGap: 14,
      itemGap: 8,
      padding: 0.75,
    },
    layout: {
      hasHeaderImage: false,
      hasSidebar: false,
      headerStyle: "prominent",
    },
  },
};

// 4. CREATIVE TEMPLATE - Modern with visual elements
export const creativeTemplate: Template = {
  id: "creative",
  name: "Creative",
  description: "Modern and visually appealing for creative professionals",
  style: {
    name: "Creative",
    description: "Creative professional layout with visual accents",
    colors: {
      primary: "#5b21b6",
      secondary: "#9333ea",
      text: "#1f2937",
      light: "#f3e8ff",
      accent: "#ec4899",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Open Sans, sans-serif",
    },
    spacing: {
      sectionGap: 18,
      itemGap: 12,
      padding: 1.2,
    },
    layout: {
      hasHeaderImage: true,
      hasSidebar: false,
      headerStyle: "accent",
    },
  },
};

// 5. TECHNICAL TEMPLATE - Code-friendly, minimal
export const technicalTemplate: Template = {
  id: "technical",
  name: "Technical",
  description: "Optimized for technical roles with clean code-like formatting",
  style: {
    name: "Technical",
    description: "Code-friendly technical layout",
    colors: {
      primary: "#1e293b",
      secondary: "#475569",
      text: "#0f172a",
      light: "#e2e8f0",
      accent: "#10b981",
    },
    fonts: {
      heading: "Courier New, monospace",
      body: "Consolas, monospace",
    },
    spacing: {
      sectionGap: 10,
      itemGap: 6,
      padding: 0.4,
    },
    layout: {
      hasHeaderImage: false,
      hasSidebar: true,
      headerStyle: "minimal",
    },
  },
};

// All templates
export const ALL_TEMPLATES: Record<TemplateId, Template> = {
  classic: classicTemplate,
  modern: modernTemplate,
  executive: executiveTemplate,
  creative: creativeTemplate,
  technical: technicalTemplate,
};

// Template list for UI display
export const TEMPLATE_LIST: Template[] = [
  classicTemplate,
  modernTemplate,
  executiveTemplate,
  creativeTemplate,
  technicalTemplate,
];

// Mock data for template preview
export const MOCK_RESUME_DATA: ResumeData = {
  personal: {
    name: "Sarah Anderson",
    email: "sarah.anderson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sarahallison",
    website: "sarahallison.com",
  },
  summary:
    "Results-driven Product Manager with 5+ years of experience building and launching successful products. Proven track record of increasing user engagement by 40% and driving revenue growth. Passionate about solving complex problems through data-driven decisions and cross-functional collaboration.",
  experience: [
    {
      company: "TechCorp Inc.",
      title: "Senior Product Manager",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      description:
        "Leading development and launch of new product features impacting 2M+ users",
      achievements: [
        "Increased user retention by 35% through personalization features",
        "Led cross-functional team of 8 engineers, designers, and data analysts",
        "Delivered $2.5M in incremental annual revenue",
      ],
    },
    {
      company: "StartupXYZ",
      title: "Product Manager",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      description: "Owner of mobile product suite serving 500K active users",
      achievements: [
        "Launched mobile app that reached 100K downloads in first month",
        "Implemented data analytics framework improving decision making",
        "Reduced customer churn by 25% through retention programs",
      ],
    },
    {
      company: "DigitalAgency Ltd.",
      title: "Associate Product Manager",
      startDate: "Jul 2018",
      endDate: "May 2019",
      current: false,
      description: "Managed product strategy for web platform",
      achievements: [
        "Coordinated launch of 12+ product features",
        "Improved onboarding conversion rates by 18%",
      ],
    },
  ],
  education: [
    {
      school: "Stanford University",
      degree: "MBA",
      field: "Business Administration",
      graduationDate: "May 2018",
    },
    {
      school: "UC Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      graduationDate: "May 2016",
      gpa: "3.8",
    },
  ],
  skills: [
    {
      category: "Product Management",
      items: [
        "Product Strategy",
        "User Research",
        "Roadmap Planning",
        "Agile/Scrum",
      ],
    },
    {
      category: "Analytics & Data",
      items: ["SQL", "Tableau", "Google Analytics", "Statistical Analysis"],
    },
    {
      category: "Tools & Platforms",
      items: ["Jira", "Figma", "Mixpanel", "Amplitude", "Segment"],
    },
    {
      category: "Leadership",
      items: ["Team Leadership", "Cross-functional Collaboration", "Mentoring"],
    },
  ],
  certifications: [
    {
      name: "Certified Scrum Product Owner",
      issuer: "Scrum Alliance",
      date: "2020",
    },
    {
      name: "Data Analytics Professional",
      issuer: "Google",
      date: "2021",
    },
  ],
  projects: [
    {
      name: "Analytics Dashboard Project",
      description:
        "Built custom dashboard enabling real-time business metrics tracking",
      link: "github.com/sarahallison/analytics-dashboard",
      date: "2021",
    },
  ],
};

/**
 * Get template by ID
 */
export function getTemplate(id: TemplateId): Template {
  return ALL_TEMPLATES[id] || classicTemplate;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): Template[] {
  return TEMPLATE_LIST;
}
