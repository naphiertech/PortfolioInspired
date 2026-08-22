import { NextResponse } from "next/server";

// Valid allowed relationships
const ALLOWED_RELATIONSHIPS = [
  "Worked together",
  "Studied together",
  "Project collaboration",
  "Mentor / Teacher",
  "Community / Organization",
  "Other",
];

// Simple in-memory rate-limiting by IP (resets on server restart)
const submissionTracker = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_SUBMISSIONS_PER_WINDOW = 3;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Check rate limit
    const timestamps = submissionTracker.get(ip) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recentTimestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      role,
      relationship,
      recommendation,
      profileUrl,
      email,
      consent,
      website_hp, // Honeypot field
    } = body;

    // Honeypot spam trap: if filled by a bot, silently reject or fail
    if (website_hp) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    // Required Field Validations
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "Please provide your full name (2–100 characters)." },
        { status: 400 }
      );
    }

    if (!relationship || !ALLOWED_RELATIONSHIPS.includes(relationship)) {
      return NextResponse.json(
        { error: "Please select a valid relationship." },
        { status: 400 }
      );
    }

    if (
      !recommendation ||
      typeof recommendation !== "string" ||
      recommendation.trim().length < 20 ||
      recommendation.trim().length > 1000
    ) {
      return NextResponse.json(
        { error: "Recommendation text must be between 20 and 1,000 characters." },
        { status: 400 }
      );
    }

    if (consent !== true) {
      return NextResponse.json(
        { error: "Consent is required to submit a recommendation." },
        { status: 400 }
      );
    }

    // Optional fields format checks
    if (role && (typeof role !== "string" || role.length > 100)) {
      return NextResponse.json(
        { error: "Role/Organization must be under 100 characters." },
        { status: 400 }
      );
    }

    if (email && (typeof email !== "string" || !email.includes("@") || email.length > 150)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (profileUrl && typeof profileUrl === "string" && profileUrl.trim().length > 0) {
      try {
        new URL(profileUrl);
      } catch {
        return NextResponse.json(
          { error: "Please provide a valid LinkedIn or portfolio URL (e.g. https://...)." },
          { status: 400 }
        );
      }
    }

    // Sanitize input values
    const sanitizedSubmission = {
      id: crypto.randomUUID(),
      name: name.trim().slice(0, 100),
      role: role ? role.trim().slice(0, 100) : "",
      relationship,
      recommendation: recommendation.trim().slice(0, 1000),
      profileUrl: profileUrl ? profileUrl.trim() : "",
      email: email ? email.trim() : "", // Kept private on server
      consent: true,
      status: "pending", // Requires manual moderation before publishing
      createdAt: new Date().toISOString(),
    };

    // Update rate limit tracker
    recentTimestamps.push(now);
    submissionTracker.set(ip, recentTimestamps);

    // Secure server log (without logging sensitive email if not needed)
    console.log(
      `[RECOMMENDATION_SUBMITTED] ID: ${sanitizedSubmission.id} | From: ${sanitizedSubmission.name} (${sanitizedSubmission.relationship}) | Length: ${sanitizedSubmission.recommendation.length} chars`
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! Your recommendation has been submitted and will be reviewed before appearing on the portfolio.",
    });
  } catch (err) {
    console.error("Failed to process recommendation submission:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
