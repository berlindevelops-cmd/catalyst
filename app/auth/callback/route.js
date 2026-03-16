import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);

    // get user role and redirect accordingly
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role;

    if (role === "teen") {
      return NextResponse.redirect(new URL("/auth/onboarding/teen", requestUrl.origin));
    } else if (role === "employer") {
      return NextResponse.redirect(new URL("/auth/onboarding/employer", requestUrl.origin));
    } else {
      // returning user — check profile for role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "teen") {
        return NextResponse.redirect(new URL("/dashboard/teen", requestUrl.origin));
      } else if (profile?.role === "employer") {
        return NextResponse.redirect(new URL("/dashboard/employer", requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL("/auth/signup", requestUrl.origin));
}