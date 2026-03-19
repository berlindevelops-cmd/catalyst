import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { employerEmail, employerName, teenName, jobTitle, message } = await request.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Catalyst <notifications@yourcatalystdomain.com>",
        to: employerEmail,
        subject: `New application for ${jobTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #C8FF00; margin: 0; font-size: 24px;">catalyst.</h1>
            </div>
            <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 12px 12px;">
              <h2 style="color: #111; margin-top: 0;">New application received 📬</h2>
              <p style="color: #555;">Hey ${employerName},</p>
              <p style="color: #555;"><strong style="color: #111;">${teenName}</strong> just applied for your job listing:</p>
              <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #111;">${jobTitle}</p>
              </div>
              ${message ? `
              <div style="background: #fff; border-left: 3px solid #C8FF00; padding: 12px 16px; margin: 20px 0;">
                <p style="margin: 0; color: #555; font-style: italic;">"${message}"</p>
              </div>` : ""}
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/${employerName ? "employer" : "business"}/applicants"
                style="display: inline-block; background: #000; color: #C8FF00; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                View applicant
              </a>
              <p style="color: #999; font-size: 12px; margin-top: 32px;">You're receiving this because you have a job listed on Catalyst.</p>
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