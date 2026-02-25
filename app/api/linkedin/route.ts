import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleLinkedInCallback } from "@/lib/linkedin";

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL("/linkedin-import", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    const errorDescription =
      searchParams.get("error_description") || "LinkedIn authorization was canceled.";
    return redirectWithError(request, errorDescription);
  }

  if (!code) {
    return redirectWithError(request, "No authorization code received from LinkedIn.");
  }

  const expectedState = request.cookies.get("linkedin_oauth_state")?.value;
  if (!state || !expectedState || state !== expectedState) {
    return redirectWithError(request, "Invalid LinkedIn OAuth state. Please try again.");
  }

  const user = await requireAuth();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", "/linkedin-import");
    return NextResponse.redirect(loginUrl);
  }

  try {
    await handleLinkedInCallback(code, request.nextUrl.origin);

    const successUrl = new URL("/linkedin-import", request.url);
    successUrl.searchParams.set("connected", "true");
    const response = NextResponse.redirect(successUrl);
    response.cookies.delete("linkedin_oauth_state");
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "LinkedIn synchronization failed.";
    console.error("LinkedIn callback error:", error);

    const response = redirectWithError(request, message);
    response.cookies.delete("linkedin_oauth_state");
    return response;
  }
}
