export type Plan = "free" | "pro_monthly" | "pro_yearly" | "teams_monthly" | "teams_yearly";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "incomplete";
export type ScanStatus = "pending" | "processing" | "completed" | "failed";

/**
 * User interface for mock authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Only stored in localStorage, never exposed
  avatar?: string;
  plan: Plan;
  joined: string;
  scans: string[]; // Array of scan IDs
}

/**
 * Auth response interface
 */
export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface LinkedInProfile {
  name: string;
  email: string;
  headline: string; // job title
  location: string;
  skills: string[];
  profilePicture?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at?: string;
  skills?: string[] | null; // Array of skill tags from LinkedIn or manual entry
  linkedin_data?: LinkedInProfile | string | null; // Cached LinkedIn profile data
}

export interface Scan {
  id: string;
  user_id: string;
  resume_url: string | null;
  resume_filename: string | null;
  job_description: string;
  job_title: string | null;
  ats_score: number | null;
  status: ScanStatus;
  created_at: string;
  scan_results?: ScanResult;
}

export interface ScanResult {
  id: string;
  scan_id: string;
  keyword_match_score: number;
  skills_match_score: number;
  experience_score: number;
  formatting_score: number;
  title_alignment_score: number;
  overall_score: number;
  keyword_matches: string[];
  missing_keywords: string[];
  hard_skills_matched: string[];
  hard_skills_missing: string[];
  soft_skills_matched: string[];
  soft_skills_missing: string[];
  formatting_issues: FormattingIssue[];
  suggestions: Suggestion[];
  section_quality: SectionQuality;
  seniority_alignment: string;
  recruiter_readability: number;
  created_at: string;
}

export interface FormattingIssue {
  severity: "high" | "medium" | "low";
  issue: string;
  fix: string;
}

export interface Suggestion {
  priority: "high" | "medium" | "low";
  category: string;
  suggestion: string;
  example?: string;
}

export interface SectionQuality {
  has_summary: boolean;
  has_experience: boolean;
  has_skills: boolean;
  has_education: boolean;
  has_contact: boolean;
  score: number;
}

export interface UsageInfo {
  scans_used: number;
  scans_limit: number;
  plan: Plan;
  can_scan: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
}

export interface ATSAnalysisInput {
  resumeText: string;
  jobDescription: string;
}

export interface ATSAnalysisResult {
  overall_score: number;
  keyword_match_score: number;
  skills_match_score: number;
  experience_score: number;
  formatting_score: number;
  title_alignment_score: number;
  keyword_matches: string[];
  missing_keywords: string[];
  hard_skills_matched: string[];
  hard_skills_missing: string[];
  soft_skills_matched: string[];
  soft_skills_missing: string[];
  formatting_issues: FormattingIssue[];
  suggestions: Suggestion[];
  section_quality: SectionQuality;
  seniority_alignment: string;
  recruiter_readability: number;
  job_title: string;
}
