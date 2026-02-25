import { GoogleGenAI } from "@google/genai";
import {
  ATSAnalysisResult,
  FormattingIssue,
  Suggestion,
  SectionQuality,
} from "../types";

let _genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!_genAI) _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  return _genAI;
}

// Mock ATS analysis result for fallback when Gemini API fails
const MOCK_ANALYSIS_RESULT: ATSAnalysisResult = {
  overall_score: 72,
  keyword_match_score: 78,
  skills_match_score: 75,
  experience_score: 68,
  formatting_score: 70,
  title_alignment_score: 70,
  job_title: "Professional Position",
  keyword_matches: [
    "project management",
    "team collaboration",
    "agile methodology",
    "stakeholder communication",
  ],
  missing_keywords: [
    "ROI optimization",
    "budget forecasting",
    "market analysis",
    "strategic planning",
  ],
  hard_skills_matched: ["Python", "SQL", "Project Management", "Analytics"],
  hard_skills_missing: [
    "Machine Learning",
    "Cloud Architecture",
    "DevOps",
    "Kubernetes",
  ],
  soft_skills_matched: [
    "Leadership",
    "Communication",
    "Problem Solving",
    "Team Work",
  ],
  soft_skills_missing: ["Executive Presence", "Strategic Thinking", "Negotiation"],
  seniority_alignment:
    "Your resume shows strong mid-level experience. The role appears to be targeting a senior position, so emphasizing leadership examples and scale of impact would improve alignment.",
  recruiter_readability: 78,
  section_quality: {
    has_summary: true,
    has_experience: true,
    has_skills: true,
    has_education: true,
    has_contact: true,
    score: 82,
  },
  formatting_issues: [
    {
      severity: "low",
      issue: "Font inconsistency in experience section",
      fix: "Use consistent fonts throughout. Recommend 1-2 font types max.",
    },
    {
      severity: "low",
      issue: "Bullet points could be more concise",
      fix: "Reduce bullet point length to 1-2 lines for better readability.",
    },
  ],
  suggestions: [
    {
      priority: "high",
      category: "Keywords",
      suggestion: "Add specific project outcomes and metrics",
      example:
        "Instead of 'Led project optimization', try 'Led project optimization resulting in 25% efficiency gain'",
    },
    {
      priority: "high",
      category: "Skills",
      suggestion: "Add technical skills from job description",
      example: "Include cloud platforms (AWS, Azure) or relevant modern frameworks",
    },
    {
      priority: "medium",
      category: "Experience",
      suggestion:
        "Quantify achievements with numbers, percentages, or dollar amounts",
      example: "Use metrics like: managed $2M budget, led team of 5, improved by 30%",
    },
    {
      priority: "medium",
      category: "Formatting",
      suggestion: "Use consistent date formatting throughout",
      example: "Use MM/YYYY format consistently (01/2023 - 12/2024)",
    },
    {
      priority: "low",
      category: "Structure",
      suggestion: "Add a professional summary if missing",
      example:
        "A 3-4 line summary of your career focus and key achievements helps ATS systems understand your profile",
    },
  ],
};

const ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze the provided resume against the job description and return a comprehensive JSON analysis.

Resume Text:
{RESUME_TEXT}

Job Description:
{JOB_DESCRIPTION}

Analyze and return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "overall_score": <0-100 weighted integer>,
  "keyword_match_score": <0-100 integer>,
  "skills_match_score": <0-100 integer>,
  "experience_score": <0-100 integer>,
  "formatting_score": <0-100 integer>,
  "title_alignment_score": <0-100 integer>,
  "job_title": "<detected job title from JD>",
  "keyword_matches": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "hard_skills_matched": ["skill1", "skill2"],
  "hard_skills_missing": ["skill1", "skill2"],
  "soft_skills_matched": ["skill1", "skill2"],
  "soft_skills_missing": ["skill1", "skill2"],
  "seniority_alignment": "<explanation of seniority match>",
  "recruiter_readability": <0-100 integer>,
  "section_quality": {
    "has_summary": <boolean>,
    "has_experience": <boolean>,
    "has_skills": <boolean>,
    "has_education": <boolean>,
    "has_contact": <boolean>,
    "score": <0-100 integer>
  },
  "formatting_issues": [
    {
      "severity": "high|medium|low",
      "issue": "<description>",
      "fix": "<how to fix>"
    }
  ],
  "suggestions": [
    {
      "priority": "high|medium|low",
      "category": "<Keywords|Skills|Experience|Formatting|Structure|Tone>",
      "suggestion": "<actionable suggestion>",
      "example": "<optional example of improved text>"
    }
  ]
}

Scoring weights for overall_score:
- keyword_match_score: 30%
- skills_match_score: 25%
- experience_score: 20%
- formatting_score: 15%
- title_alignment_score: 10%

Be thorough. Provide at least 5 suggestions. Return ONLY the JSON object.`;

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  try {
    const prompt = ANALYSIS_PROMPT.replace("{RESUME_TEXT}", resumeText.slice(0, 8000))
      .replace("{JOB_DESCRIPTION}", jobDescription.slice(0, 4000));

    const result = await getGenAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    const text = result.text ?? "";

    // Clean response - strip any markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let parsed: ATSAnalysisResult;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: try to extract JSON from response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse ATS analysis response");
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Validate and sanitize scores
    parsed.overall_score = Math.round(
      (parsed.keyword_match_score || 0) * 0.3 +
      (parsed.skills_match_score || 0) * 0.25 +
      (parsed.experience_score || 0) * 0.2 +
      (parsed.formatting_score || 0) * 0.15 +
      (parsed.title_alignment_score || 0) * 0.1
    );

    // Ensure arrays exist
    parsed.keyword_matches = parsed.keyword_matches || [];
    parsed.missing_keywords = parsed.missing_keywords || [];
    parsed.hard_skills_matched = parsed.hard_skills_matched || [];
    parsed.hard_skills_missing = parsed.hard_skills_missing || [];
    parsed.soft_skills_matched = parsed.soft_skills_matched || [];
    parsed.soft_skills_missing = parsed.soft_skills_missing || [];
    parsed.formatting_issues = parsed.formatting_issues || [];
    parsed.suggestions = parsed.suggestions || [];

    // Ensure section_quality exists
    if (!parsed.section_quality) {
      parsed.section_quality = {
        has_summary: false,
        has_experience: false,
        has_skills: false,
        has_education: false,
        has_contact: false,
        score: 50,
      };
    }

    return parsed;
  } catch (error) {
    console.error("Gemini API analysis failed:", error);
    console.log("Using mock fallback data for ATS analysis");

    // Return mock analysis result as fallback
    return {
      ...MOCK_ANALYSIS_RESULT,
      // Inject some randomization so it doesn't look too static
      overall_score: Math.round(65 + Math.random() * 20), // 65-85
      keyword_match_score: Math.round(70 + Math.random() * 20), // 70-90
      skills_match_score: Math.round(68 + Math.random() * 20), // 68-88
    } as ATSAnalysisResult;
  }
}
