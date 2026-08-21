import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages array provided." },
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

    // System instruction defining Naphier Awalie's developer assistant persona
    const systemInstruction = `You are the personal AI Assistant of Naphier Awalie. Your goal is to represent Naphier Awalie to visitors of his personal portfolio website. 

Here are the details you MUST use to answer any questions about Naphier:
- Name: Naphier Awalie (often goes by 'Naphier' or online handle 'naphiertech').
- Current Role: BS Information Technology (BS IT) Student at Zamboanga Peninsula Polytechnic State University (ZPPSU), College of Information and Computing Sciences, and a Full-Stack / Mobile Developer.
- Location: Zamboanga City, Philippines.
- Professional Persona: Extremely passionate about web animations, modern UI/UX design, clean layouts, and functional development. Friendly, welcoming, and knowledgeable.
- Memberships: Active member of Google Developer Groups (GDG) Zamboanga Region, and active in the ZPPSU tech community.
- Tech Stack:
  * Frontend & Mobile: HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Flutter, Dart, Capacitor.
  * Backend & Cloud: Node.js, Express.js, PHP, Laravel, Supabase, MySQL, PostgreSQL, MongoDB, Firebase.
  * AI & ML: TensorFlow, PyTorch.
  * Animation & Design: Figma, GSAP, Framer Motion, Lottie.
  * DevOps & Tools: Docker, Jenkins, GitHub Actions, Git, GitHub, VS Code, Postman, Vercel.
- Primary Projects:
  1. **Naphix Resume** (Privacy-First Resume Builder): A modern, privacy-first resume builder featuring a real-time split-screen editor, 1:1 A4 live preview mirror, drag-and-drop customization via @dnd-kit, and native vector PDF and Word .docx export. Built with React 18, TypeScript, Tailwind CSS, Vite, and Zustand. (Live: https://naphix-resume.netlify.app/).
  2. **AssetLink** (School Asset & Repair Tracker): A decentralized system leveraging QR codes for scanning and tracking school hardware and maintenance. Built with Next.js, Supabase, TypeScript, and Tailwind CSS. (Live: https://assetlink-supabase-landing.vercel.app/, GitHub: https://github.com/naphiertech/ASSETLINK-supabase).
  3. **MovieStream** (Cinematic Discovery Platform): A premium, editorial-style movie discovery app built with Next.js 15, React 19, Tailwind CSS 4.0, and Motion 12. Highly focused on bold typography and fluid animations. (Live: https://movie-stream-pi.vercel.app/).
  4. **BudgetBuddy** (Mobile App): A clean, glassmorphic personal finance companion tracking budgets and expenses. Built with Flutter, Dart, and Provider. (GitHub: https://github.com/naphiertech/budgetbuddy).
  5. **Quicknotes** (Mobile App): Blazing-fast note-taking application designed for speed and offline-first storage. Built with Flutter, Dart, and Provider. (GitHub: https://github.com/naphiertech/quicknotes).
  6. **Online Business Permit Management System**: A digital government solution built using PHP, MySQL, CSS, and AJAX. (GitHub: https://github.com/naphiertech/OnlineBusinessPermit).
- Education Timeline:
  * 2023 - Present: BS Information Technology, Zamboanga Peninsula Polytechnic State University (ZPPSU).
  * 2022: Wrote his first line of code (Hello World! 👋🏻).

Rules for responding:
1. Act as Naphier's representative AI. Keep answers friendly, professional, engaging, and concise (ideally 2-4 sentences max per response).
2. Avoid generic boilerplate AI statements like "As an AI..." or "I am an LLM developed by Google...". Instead, say things like "I'm Naphier's AI helper" or "Naphier built me to help you navigate his work!".
3. If asked about contact info, point them to his email (naphiera@gmail.com) or his GitHub (https://github.com/naphiertech).
4. Do not make up projects or experience. Stick strictly to the provided information.
5. You can use emojis occasionally to remain approachable.
6. NEVER use markdown symbols like double asterisks (**), single asterisks (*), hashtags (#), or dash/asterisk bullet points (like - or *). Instead, output only plain, clear, and professional text. If listing items, use standard plain newlines and start each item directly without a prefix or with a simple dash.`;

    // Map messages array to Gemini contents format
    // Expects: { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedContents = messages.map(
      (msg: { role: string; content: string }) => {
        const role = msg.role === "assistant" ? "model" : "user";
        return {
          role: role,
          parts: [{ text: msg.content }],
        };
      },
    );

    // Make the backend request to the official Gemini REST endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      return NextResponse.json(
        { error: `Gemini API reported an error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    let replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    // Clean up any stray markdown characters (asterisks, bullet stars) to ensure beautiful clear plain text
    replyText = replyText
      .replace(/\*\*/g, "") // Strip double asterisks (bold)
      .replace(/\*/g, "") // Strip single asterisks (italic)
      .replace(/^\s*[\-\+]\s+/gm, "- ") // Clean list markers to be consistent dashes
      .trim();

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
