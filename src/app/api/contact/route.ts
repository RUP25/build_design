import { NextResponse } from "next/server";
import { Resend } from "resend";
import { companyEmail } from "@/lib/content";
import {
  getRequestIp,
  isContactRateLimitConfigured,
  limitContactRequest,
} from "@/lib/rate-limit";

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

function getFromAddress() {
  const address =
    process.env.CONTACT_FROM_ADDRESS?.trim() ||
    process.env.CONTACT_FROM_EMAIL?.trim();

  if (!address) {
    return "Build Design Projects <hello@buildesignprojects.com>";
  }

  if (address.includes("<") && address.includes("@")) {
    return address;
  }

  if (address.includes("@")) {
    const name = process.env.CONTACT_FROM_NAME?.trim() || "Build Design Projects";
    return `${name} <${address}>`;
  }

  return address;
}

export async function POST(request: Request) {
  if (!resend) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  if (!isContactRateLimitConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("Contact rate limiting is not configured in production.");
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
  } else {
    const ip = getRequestIp(request);
    const rateLimit = await limitContactRequest(`contact:${ip}`);

    if (!rateLimit) {
      console.error("Contact rate limit check failed.");
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }

    const { success, limit, remaining, reset } = rateLimit;

    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));

      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${retryAfter} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
            "Retry-After": String(retryAfter),
          },
        },
      );
    }
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
  const from = getFromAddress();

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
      {
        error:
          error.message ||
          "Unable to send your request. Please try again.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
