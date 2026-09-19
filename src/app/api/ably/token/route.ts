import { NextRequest, NextResponse } from "next/server";
import * as Ably from "ably";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ABLY_API_KEY is not configured on server" },
      { status: 500 }
    );
  }

  // Retrieve anonymous stable client ID passed in query params
  const searchParams = request.nextUrl.searchParams;
  const clientId =
    searchParams.get("clientId") ||
    `anon-${Math.random().toString(36).slice(2, 10)}`;

  try {
    const client = new Ably.Rest({ key: apiKey });
    const tokenRequest = await client.auth.createTokenRequest({
      clientId,
      capability: {
        "portfolio-presence": ["subscribe", "presence"],
      },
      ttl: 3600000, // 1 hour short-lived token
    });

    return NextResponse.json(tokenRequest, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to create Ably token request:", error);
    return NextResponse.json(
      { error: "Failed to generate Ably token request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ABLY_API_KEY is not configured on server" },
      { status: 500 }
    );
  }

  let clientId: string | undefined;
  try {
    const body = await request.json();
    clientId = body?.clientId;
  } catch {
    const searchParams = request.nextUrl.searchParams;
    clientId = searchParams.get("clientId") || undefined;
  }

  clientId = clientId || `anon-${Math.random().toString(36).slice(2, 10)}`;

  try {
    const client = new Ably.Rest({ key: apiKey });
    const tokenRequest = await client.auth.createTokenRequest({
      clientId,
      capability: {
        "portfolio-presence": ["subscribe", "presence"],
      },
      ttl: 3600000,
    });

    return NextResponse.json(tokenRequest, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to create Ably token request:", error);
    return NextResponse.json(
      { error: "Failed to generate Ably token request" },
      { status: 500 }
    );
  }
}
