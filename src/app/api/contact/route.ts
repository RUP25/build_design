import { NextResponse } from "next/server";
import { Resend } from "resend";
import { companyEmail } from "@/lib/content";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  if (!resend) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim() || "Not provided";
  const message = body.message?.trim();

  if (body.company) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and project details are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? companyEmail;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Build Design Projects <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `New consultation request from ${name}`,
    html: `
      <h2>New consultation request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Project details:</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Unable to send your request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
