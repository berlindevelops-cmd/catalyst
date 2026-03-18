import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role");
  const isLogin = requestUrl.searchParams.get("login");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));

    // always check profile first
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // has profile — send to their dashboard
    if (profile?.role === "teen") {
      return NextResponse.redirect(new URL("/dashboard/teen", requestUrl.origin));
    } else if (profile?.role === "business") {
      return NextResponse.redirect(new URL("/dashboard/business", requestUrl.origin));
    } else if (profile?.role === "employer") {
      return NextResponse.redirect(new URL("/dashboard/employer", requestUrl.origin));
    }

    // no profile + this was a login attempt — they don't have an account yet
    if (isLogin) {
      return NextResponse.redirect(new URL("/auth/signup", requestUrl.origin));
    }

    // no profile + signup flow — send to onboarding
    if (role === "teen") return NextResponse.redirect(new URL("/auth/onboarding/teen", requestUrl.origin));
    if (role === "employer") return NextResponse.redirect(new URL("/auth/onboarding/employer", requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}