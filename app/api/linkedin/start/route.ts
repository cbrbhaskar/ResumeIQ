import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRandomState, getLinkedInAuthUrl } from "@/lib/linkedin";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", "/linkedin-import");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const state = generateRandomState();
    const authUrl = getLinkedInAuthUrl(state, request.nextUrl.origin);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set("linkedin_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "LinkedIn OAuth could not be started.";

    const redirectUrl = new URL("/linkedin-import", request.url);
    redirectUrl.searchParams.set("error", message);
    return NextResponse.redirect(redirectUrl);
  }
}
