import { NextResponse } from "next/server";
import { buildPortfolioSystemPrompt, PortfolioPageContext } from "@/lib/portfolioContext";

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

    // Build authoritative dynamic system prompt grounded in src/lib/data.ts and active page context
    const systemInstruction = buildPortfolioSystemPrompt(pageContext);

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
                maxOutputTokens: 600,
                temperature: 0.7,
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

    // Clean up excessive whitespace while preserving markdown links and structure
    replyText = replyText.trim();

    return NextResponse.json({ reply: replyText });
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
