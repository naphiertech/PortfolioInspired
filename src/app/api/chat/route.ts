import { NextResponse } from "next/server";
import {
  buildPortfolioSystemPrompt,
  PortfolioPageContext,
} from "@/lib/portfolioContext";
import { classifyVisitorIntent } from "@/lib/chatIntentGate";
import { inspectGeneratedOutput } from "@/lib/chatOutputGuard";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let messages = body.messages;
    const pageContext: PortfolioPageContext | undefined = body.pageContext;

    if (!messages && body.message) {
      messages = [{ role: "user", content: body.message }];
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty messages provided." },
        { status: 400 },
      );
    }

    // 1. Extract latest user query for Pre-Generation Intent Gate
    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // 2. Application-Level Pre-Generation Intent Gate (Layer 1)
    const gateResult = classifyVisitorIntent(lastUserMessage, messages);

    if (
      gateResult.classification === "OUT_OF_SCOPE" ||
      gateResult.classification === "SENSITIVE_REQUEST"
    ) {
      // Intercept and return the fixed portfolio redirect immediately.
      // Deny-by-default: zero Gemini API call, zero token usage, zero prompt-injection risk.
      return NextResponse.json({
        reply: gateResult.suggestedReply,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          error:
            "API key is not configured. Please paste your Gemini API key in the .env file.",
        },
        { status: 500 },
      );
    }

    // 3. Build Hardened Authoritative System Prompt with Grounded Relational Retrieval (Layer 2)
    const systemInstruction = buildPortfolioSystemPrompt(
      pageContext,
      lastUserMessage,
      messages,
    );

    // Map messages array to Gemini contents format
    const formattedContents = messages.map(
      (msg: { role: string; content: string }) => {
        const role = msg.role === "assistant" ? "model" : "user";
        return {
          role: role,
          parts: [{ text: msg.content }],
        };
      },
    );

    // Default to Gemini 2.5 Flash, with graceful fallback to 1.5 Flash
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-3.5-flash",
    ];
    let replyText = "";
    let lastError = "";

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: formattedContents,
              systemInstruction: {
                parts: [
                  {
                    text: systemInstruction,
                  },
                ],
              },
              generationConfig: {
                maxOutputTokens: 1200,
                temperature: 0.4,
              },
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          replyText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (replyText) break;
        } else {
          lastError = await response.text();
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!replyText) {
      console.error("Gemini API Error Response:", lastError);
      return NextResponse.json(
        { error: "Could not generate a response from Gemini." },
        { status: 500 },
      );
    }

    // 4. Application-Level Post-Generation Output Guard (Layer 3)
    const guardResult = inspectGeneratedOutput(replyText);
    const finalReply = guardResult.sanitizedReply.trim();

    return NextResponse.json({ reply: finalReply });
  } catch (error: unknown) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An internal error occurred.",
      },
      { status: 500 },
    );
  }
}
