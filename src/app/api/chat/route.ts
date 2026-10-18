import { NextResponse } from "next/server";
import {
  buildPortfolioSystemPrompt,
  PortfolioPageContext,
} from "@/lib/portfolioContext";
import { classifyVisitorIntent } from "@/lib/chatIntentGate";
import { inspectGeneratedOutput } from "@/lib/chatOutputGuard";
import { tryDeterministicAnswer } from "@/lib/deterministicResponder";
import { normalizeUserQuery } from "@/lib/queryNormalizer";
import { retrieveGroundedContext } from "@/lib/portfolioKnowledge";

const chatRateMap = new Map<string, number[]>();
const CHAT_WINDOW_MS = 60 * 1000;
const MAX_CHAT_REQUESTS_PER_MIN = 20;

function checkChatRateLimit(ip: string): boolean {
  const now = Date.now();
  if (chatRateMap.size > 500) {
    for (const [k, times] of chatRateMap.entries()) {
      const active = times.filter((t) => now - t < CHAT_WINDOW_MS);
      if (active.length === 0) chatRateMap.delete(k);
      else chatRateMap.set(k, active);
    }
  }
  const recent = (chatRateMap.get(ip) || []).filter(
    (t) => now - t < CHAT_WINDOW_MS
  );
  if (recent.length >= MAX_CHAT_REQUESTS_PER_MIN) return false;
  recent.push(now);
  chatRateMap.set(ip, recent);
  return true;
}

export async function POST(req: Request) {
  try {
    const secFetchSite = req.headers.get("sec-fetch-site");
    if (
      secFetchSite &&
      secFetchSite !== "same-origin" &&
      secFetchSite !== "none"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (!checkChatRateLimit(ip)) {
      return NextResponse.json(
        {
          reply:
            "You're sending messages pretty fast! Give me a few seconds and ask me anything about my projects or experience.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    let messages = body.messages;
    const pageContext: PortfolioPageContext | undefined = body.pageContext;

    if (!messages && body.message) {
      messages = [{ role: "user", content: String(body.message).slice(0, 1000) }];
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty messages provided." },
        { status: 400 },
      );
    }

    messages = messages.slice(-20).map((m: { role?: unknown; content?: unknown }) => ({
      role: m?.role === "assistant" ? "assistant" : "user",
      content: String(m?.content || "").slice(0, 1200),
    }));

    // 1. Extract latest user query for Pre-Generation Intent Gate
    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // 2. Application-Level Pre-Generation Intent Gate (Layer 1)
    const gateResult = classifyVisitorIntent(lastUserMessage, messages);

    if (
      gateResult.classification === "OUT_OF_SCOPE" ||
      gateResult.classification === "SENSITIVE_REQUEST"
    ) {
      // Deny-by-default: zero Gemini API call, zero token usage, zero prompt-injection risk.
      return NextResponse.json({
        reply: gateResult.suggestedReply,
      });
    }

    // 2.5 Local Fault-Tolerant Deterministic Fallback
    // Return instant, verified structured answers without calling Gemini when the intent is factual
    const deterministicRes = tryDeterministicAnswer(
      gateResult.normalizedQuery || normalizeUserQuery(lastUserMessage),
      messages,
      pageContext
    );

    if (deterministicRes.answered && deterministicRes.reply) {
      return NextResponse.json({
        reply: deterministicRes.reply,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Graceful local fallback when external LLM API key is not configured
      const grounded = retrieveGroundedContext(
        gateResult.normalizedQuery?.normalizedText || lastUserMessage,
        messages,
        pageContext,
      );

      let fallbackText = "";
      if (grounded.matchedProjects.length > 0) {
        const p = grounded.matchedProjects[0];
        fallbackText = `I am currently operating in local portfolio mode. Regarding **[${p.title}](/projects/${p.slug})**: ${p.overview}\n\n**Technologies:** ${p.techStack.join(", ")}.`;
      } else if (grounded.matchedTechs.length > 0) {
        const tech = grounded.matchedTechs[0];
        const projs = grounded.techToProjectsMap[tech] || [];
        fallbackText = `I am currently operating in local portfolio mode. Naphier uses **${tech}**${projs.length > 0 ? ` across projects including ${projs.join(", ")}` : ""}.`;
      } else {
        fallbackText = `I am currently operating in local portfolio mode without an active external AI connection. You can ask me directly about Naphier's featured projects ([MKBRiderTrack](/projects/mkb-ridertrack), [AssetLink](/projects/assetlink), [MovieStream](/projects/moviestream), [Naphix-Resume](/projects/naphix-resume)), tech stack, experience, or contact information!`;
      }

      const guardResult = inspectGeneratedOutput(fallbackText);
      return NextResponse.json({ reply: guardResult.sanitizedReply.trim() });
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

    // Default to Gemini 3.5 Flash-Lite ($0 highest free-tier quota), with fallback to Gemini 3.5 Flash
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
    ];
    let replyText = "";

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey.trim(),
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
        }
      } catch {
        // Try next candidate model or fall back to local grounded response
      }
    }

    if (!replyText) {
      const grounded = retrieveGroundedContext(
        gateResult.normalizedQuery?.normalizedText || lastUserMessage,
        messages,
        pageContext,
      );

      let fallbackText = "";
      if (grounded.matchedProjects.length > 0) {
        const p = grounded.matchedProjects[0];
        fallbackText = `Regarding **[${p.title}](/projects/${p.slug})**: ${p.overview}\n\n**Core Tech:** ${p.techStack.join(", ")}.`;
      } else {
        fallbackText = `I am temporarily operating in local fallback mode. You can ask me directly about Naphier's projects (MKBRiderTrack, AssetLink, MovieStream, Naphix-Resume), his tech stack, AI models, experience, or contact details!`;
      }

      const guardResult = inspectGeneratedOutput(fallbackText);
      return NextResponse.json({ reply: guardResult.sanitizedReply.trim() });
    }

    // 4. Application-Level Post-Generation Output Guard (Layer 3)
    const guardResult = inspectGeneratedOutput(replyText);
    const finalReply = guardResult.sanitizedReply.trim();

    return NextResponse.json({ reply: finalReply });
  } catch {
    return NextResponse.json({
      reply:
        "I am currently operating in local mode. Feel free to ask about Naphier's projects (MKBRiderTrack, AssetLink, MovieStream, Naphix-Resume), technical skills, or experience!",
    });
  }
}
