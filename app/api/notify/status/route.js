import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { teenEmail, teenName, jobTitle, status, employerName } = await request.json();

    const isAccepted = status === "accepted";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Catalyst <notifications@yourcatalystdomain.com>",
        to: teenEmail,
        subject: isAccepted
          ? `You got the job! 🎉 — ${jobTitle}`
          : `Update on your application for ${jobTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #C8FF00; margin: 0; font-size: 24px;">catalyst.</h1>
            </div>
            <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 12px 12px;">
              ${isAccepted ? `
                <h2 style="color: #111; margin-top: 0;">You got the job! 🎉</h2>
                <p style="color: #555;">Hey ${teenName},</p>
                <p style="color: #555;">Great news — <strong style="color: #111;">${employerName}</strong> has accepted your application for:</p>
                <div style="background: #C8FF00; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0; font-weight: bold; color: #000;">${jobTitle}</p>
                </div>
                <p style="color: #555;">Log in to Catalyst to message them and get started.</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/teen/applications"
                  style="display: inline-block; background: #000; color: #C8FF00; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                  View your applications
                </a>
              ` : `
                <h2 style="color: #111; margin-top: 0;">Application update</h2>
                <p style="color: #555;">Hey ${teenName},</p>
                <p style="color: #555;">Unfortunately <strong style="color: #111;">${employerName}</strong> has decided to move forward with another applicant for:</p>
                <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="margin: 0; font-weight: bold; color: #111;">${jobTitle}</p>
                </div>
                <p style="color: #555;">Don't sweat it — there are plenty more gigs waiting for you.</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/teen"
                  style="display: inline-block; background: #000; color: #C8FF00; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                  Browse more jobs
                </a>
              `}
              <p style="color: #999; font-size: 12px; margin-top: 32px;">You're receiving this because you have an account on Catalyst.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}