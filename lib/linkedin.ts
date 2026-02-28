/**
 * LinkedIn OAuth helpers for profile sync.
 *
 * This flow uses LinkedIn OpenID Connect scopes:
 * - openid
 * - profile
 * - email
 *
 * Returned profile data is intentionally limited to what these scopes provide.
 */

export interface LinkedInProfile {
  name: string;
  email: string;
  headline: string;
  location: string;
  skills: string[];
  profilePicture?: string;
}

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
}

interface LinkedInUserInfoResponse {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const LINKEDIN_SCOPES = "openid profile email";

function getLinkedInClientId(): string {
  const clientId =
    process.env.LINKEDIN_CLIENT_ID || process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  if (!clientId) {
    throw new Error("LinkedIn OAuth is not configured: missing LINKEDIN_CLIENT_ID.");
  }
  return clientId;
}

function getLinkedInClientSecret(): string {
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error(
      "LinkedIn OAuth is not configured: missing LINKEDIN_CLIENT_SECRET."
    );
  }
  return clientSecret;
}

function resolveRedirectUri(origin?: string): string {
  if (process.env.LINKEDIN_REDIRECT_URI) return process.env.LINKEDIN_REDIRECT_URI;
  if (origin) return `${origin}/api/linkedin`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumeops.in";
  return `${baseUrl}/api/linkedin`;
}

export function generateRandomState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getLinkedInAuthUrl(state: string, origin?: string): string {
  const clientId = getLinkedInClientId();
  const redirectUri = resolveRedirectUri(origin);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: LINKEDIN_SCOPES,
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  origin?: string
): Promise<string> {
  if (!code) {
    throw new Error("LinkedIn authorization code is required.");
  }

  const clientId = getLinkedInClientId();
  const clientSecret = getLinkedInClientSecret();
  const redirectUri = resolveRedirectUri(origin);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LinkedIn token exchange failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as LinkedInTokenResponse;
  if (!data.access_token) {
    throw new Error("LinkedIn token exchange failed: no access token returned.");
  }

  return data.access_token;
}

function localeToText(locale?: string): string {
  if (!locale) return "";
  return locale.replace(/[_-]/g, "-");
}

export async function parseLinkedInProfile(
  accessToken: string
): Promise<LinkedInProfile> {
  if (!accessToken) {
    throw new Error("LinkedIn access token is required.");
  }

  const response = await fetch(LINKEDIN_USERINFO_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LinkedIn profile fetch failed (${response.status}): ${text}`);
  }

  const userInfo = (await response.json()) as LinkedInUserInfoResponse;
  const fullName =
    userInfo.name ||
    `${userInfo.given_name || ""} ${userInfo.family_name || ""}`.trim();

  if (!userInfo.email) {
    throw new Error("LinkedIn did not return an email address.");
  }

  return {
    name: fullName || "LinkedIn User",
    email: userInfo.email,
    headline: fullName || "LinkedIn Profile",
    location: localeToText(userInfo.locale),
    skills: [],
    profilePicture: userInfo.picture,
  };
}

export async function handleLinkedInCallback(
  code: string,
  origin?: string
): Promise<LinkedInProfile> {
  const accessToken = await exchangeCodeForToken(code, origin);
  return parseLinkedInProfile(accessToken);
}

export function formatProfileForResume(profile: LinkedInProfile) {
  return {
    fullName: profile.name,
    email: profile.email,
    jobTitle: extractJobTitle(profile.headline),
    location: profile.location,
    skills: profile.skills,
    headline: profile.headline,
  };
}

export function extractJobTitle(headline: string): string {
  const match = headline.match(/^([^@]+?)(?:\s+at\s+|$)/i);
  return match ? match[1].trim() : headline;
}
