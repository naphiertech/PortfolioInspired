export interface FieldNoteContentSection {
  heading?: string;
  paragraphs: string[];
  callout?: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
}

export interface FieldNote {
  slug: string;
  number: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  formattedDate: string;
  readTime: string;
  tags: string[];
  content: {
    lead: string;
    sections: FieldNoteContentSection[];
    conclusion?: string;
  };
}

export const fieldNotes: FieldNote[] = [
  {
    slug: "software-should-feel-obvious",
    number: "01",
    title: "Software Should Feel Obvious",
    category: "UI / UX",
    excerpt: "Good interfaces shouldn't require instructions. If users have to pause and wonder what an element does, the design has already asked too much.",
    date: "2026.10",
    formattedDate: "October 2026",
    readTime: "4 min read",
    tags: ["Interface Design", "Affordances", "UX Architecture", "Ergonomics"],
    content: {
      lead: "Every piece of software communicates through friction or lack thereof. When a button looks pressable, when state transitions preserve spatial orientation, and when destructive actions require deliberate intent, users never think about the interface—they think about their work.",
      sections: [
        {
          heading: "The Cognitive Budget",
          paragraphs: [
            "Every second spent deciphering an obscure icon, a missing hover affordance, or an unexpected layout shift drains the user's finite cognitive budget. Complexity is often justified as 'power,' but the most powerful tools in history are straightforward to reason about.",
            "If an action produces an outcome that requires a tooltip explaining what just happened, the interaction model is flawed at its root. Direct manipulation and immediate, legible feedback beat explanatory modals every time.",
          ],
          callout: "Simplicity is not the lack of capability—it is the compression of capability into intuitive gestures.",
        },
        {
          heading: "Affordances Over Decoration",
          paragraphs: [
            "Modern design often oscillates between excessive skeumorphic ornament and hyper-flat minimalism where interactive elements blend indistinguishably into static typography. Neither serves the user.",
            "An element is interactive if it signals interactability: clear hit targets, typographic contrast, tactile focus rings for keyboard users, and predictable hover boundaries. In this portfolio, every border line and monospace tag exists to orient the eye, never merely to fill blank space.",
          ],
          codeSnippet: {
            language: "css",
            caption: "Affordance principle: fast, unambiguous interactive feedback",
            code: `.interactive-row {
  cursor: pointer;
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
              color 140ms ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .interactive-row { transition: none; }
}`,
          },
        },
        {
          heading: "Quiet Confidence in Software",
          paragraphs: [
            "Software that respects users doesn't scream for attention. It doesn't trigger confetti upon completing routine chores, nor does it bombard visitors with popovers before they have read a single sentence.",
            "The best digital experiences feel like precision laboratory instruments: sturdy, predictable, tactile, and obvious.",
          ],
        },
      ],
      conclusion: "When building my own tools—from AssetLink to MKBRiderTrack—my test is always the same: hand it to someone without saying a word, and see if they can accomplish their task without asking for a manual.",
    },
  },
  {
    slug: "building-with-ai",
    number: "02",
    title: "Building with AI: Velocity vs. Taste",
    category: "AI / DEVELOPMENT",
    excerpt: "AI makes implementation faster. Thinking still matters. Speed without architectural restraint is just high-velocity technical debt.",
    date: "2026.09",
    formattedDate: "September 2026",
    readTime: "5 min read",
    tags: ["AI Engineering", "Code Quality", "Architecture", "Software Craft"],
    content: {
      lead: "Language models have permanently collapsed the time between an architectural idea and its initial code scaffold. But generation is not engineering. The engineer's role has shifted from code author to system curator, architect, and auditor.",
      sections: [
        {
          heading: "The Illusion of Progress",
          paragraphs: [
            "It is trivial today to ask an LLM to generate three hundred lines of boilerplate React components or complex database migrations. It is equally trivial for those three hundred lines to conceal subtle race conditions, unhandled boundary cases, or gratuitous abstractions.",
            "High velocity with low taste produces systems that work in the demo but collapse under edge cases. The real challenge of AI-assisted engineering is knowing what NOT to write.",
          ],
          callout: "The speed of typing was never the bottleneck in software engineering. The bottleneck was always clarity of thought.",
        },
        {
          heading: "Verifiable Specifications as the True Unit of Work",
          paragraphs: [
            "When collaborating with AI agents, vague prompts yield generic, fragile code. To build robust software, you must define airtight interfaces, strict type contracts, and reproducible verification tests before a single token is generated.",
            "If you cannot articulate the invariant rules of your domain—who owns state, how errors bubble up, how data persists—the LLM will invent answers on your behalf, and those answers will rarely align with long-term maintenance.",
          ],
          codeSnippet: {
            language: "typescript",
            caption: "Contract-first development: tight schemas constrain generation",
            code: `// Define boundaries explicitly before implementation
type StorageMutationResult<T> = 
  | { ok: true; data: T; timestamp: number }
  | { ok: false; error: 'STORAGE_EXHAUSTED' | 'CONCURRENCY_CONFLICT'; retryAfterMs?: number };`,
          },
        },
        {
          heading: "Rejecting AI Slop in Product Design",
          paragraphs: [
            "We have all seen the ubiquitous 'AI template': saturated purple radial glows, glassmorphic cards with duplicate drop-shadows, and interchangeable hero sections. These are mathematical averages of the internet's most common patterns.",
            "Engineering with AI requires deliberate resistance against default outputs. We use AI to accelerate implementation, but the aesthetic stance, typographic hierarchy, and system ergonomics must remain strictly human.",
          ],
        },
      ],
      conclusion: "Use AI to move from hypothesis to prototype in minutes. But verify every invariant, refine every edge, and ensure that the code in production is code you understand down to the last byte.",
    },
  },
  {
    slug: "the-boring-part-matters",
    number: "03",
    title: "The Boring Part Matters",
    category: "ARCHITECTURE / RELIABILITY",
    excerpt: "The invisible work is what keeps software healthy. Idempotency, resilient fallbacks, typed contracts, and clean error states outlive trendy abstractions.",
    date: "2026.09",
    formattedDate: "September 2026",
    readTime: "4 min read",
    tags: ["Backend Architecture", "Reliability", "Database Design", "Pragmatism"],
    content: {
      lead: "In developer discourse, excitement gravitates toward shiny front-end frameworks and experimental libraries. Yet when a product is used in production by real people, none of that matters if network disconnects corrupt state or missing foreign keys leave orphaned data.",
      sections: [
        {
          heading: "The Glamour Deficit of Reliability",
          paragraphs: [
            "Nobody writes viral social media threads about database indexes, connection pooling back-off, or idempotency keys. Yet these are the foundational choices that determine whether a system survives traffic spikes or loses customer transactions.",
            "In MKBRiderTrack, an offline-first mobile sync failure could mean a dispatch rider losing hours of verified shift records. Beautiful animations mean nothing if the underlying sync protocol drops payloads silently.",
          ],
          callout: "A system's quality is defined by how gracefully it behaves when external conditions are at their absolute worst.",
        },
        {
          heading: "Designing Failure States First",
          paragraphs: [
            "The happy path is easy; anyone can code an API endpoint assuming 200 OK responses and instantaneous latency. Real engineering happens when you design the failure states before the success state.",
            "What happens if Supabase is momentarily unreachable? What happens if local storage quota is exhausted? What happens if the user double-taps the submit button on an unstable 3G connection? Writing resilient fallbacks is not an afterthought—it is the job.",
          ],
          codeSnippet: {
            language: "typescript",
            caption: "Idempotent mutation guard pattern",
            code: `async function commitRiderDispatch(payload: DispatchPayload) {
  const idempotentKey = \`dispatch:\${payload.riderId}:\${payload.shiftId}\`;
  // Atomic insert with conflict deduplication prevents double-logging
  return await db.from('dispatches').upsert(payload, { onConflict: 'idempotentKey' });
}`,
          },
        },
        {
          heading: "Boring Technology as a Superpower",
          paragraphs: [
            "Choose boring, proven technologies for core state: PostgreSQL, standard HTTP REST semantics, strict TypeScript schemas, and semantic HTML. Save your innovation tokens for solving actual user problems.",
          ],
        },
      ],
      conclusion: "When software is built on solid, boring primitives, you sleep better at night and ship with unshakeable confidence.",
    },
  },
  {
    slug: "restraint-over-novelty",
    number: "04",
    title: "Restraint Over Novelty",
    category: "DESIGN / CRAFT",
    excerpt: "Every animation, shadow, and decoration is a tax on user attention. True polish isn't how much you can add—it's how much you can remove while heightening clarity.",
    date: "2026.08",
    formattedDate: "August 2026",
    readTime: "3 min read",
    tags: ["Visual Design", "Typography", "Motion Design", "Minimalism"],
    content: {
      lead: "When developers discover modern animation and styling libraries, the natural impulse is to animate everything: bounce transitions on text, staggered parallax on every heading, and decorative gradient blurs across every section. Restraint is the difference between amusement and craft.",
      sections: [
        {
          heading: "The Tax on Attention",
          paragraphs: [
            "Every sensory element in a viewport competes for the viewer's attention. If your navigation bar pulses, your background grid glows, and your cards zoom on hover, the user has no idea where to direct their focus.",
            "Whitespace is not empty space waiting to be filled—it is functional architectural breathing room. It gives typography room to speak and allows important interactive triggers to stand out with effortless authority.",
          ],
          callout: "True design polish is invisible. Users shouldn't exclaim 'what an animated website'—they should effortlessly find what they came for.",
        },
        {
          heading: "Calibrated Motion Principles",
          paragraphs: [
            "In this portfolio, motion is purposeful and disciplined: 180 to 240 millisecond transitions using cubic-bezier curves that emulate physical inertia. No lingering 1-second fades. No decorative layout jank. And most critically: strict adherence to prefers-reduced-motion for anyone who needs or prefers instant rendering.",
          ],
        },
      ],
      conclusion: "Strip away the embellishments until only the structure, typography, and essential feedback remain. What survives is timeless.",
    },
  },
];

export function getFieldNotes(): FieldNote[] {
  return fieldNotes;
}

export function getFieldNoteBySlug(slug: string): FieldNote | undefined {
  return fieldNotes.find((note) => note.slug === slug);
}

export function getNextPrevFieldNotes(slug: string): {
  prev?: FieldNote;
  next?: FieldNote;
} {
  const index = fieldNotes.findIndex((note) => note.slug === slug);
  if (index === -1) return {};

  return {
    prev: index > 0 ? fieldNotes[index - 1] : undefined,
    next: index < fieldNotes.length - 1 ? fieldNotes[index + 1] : undefined,
  };
}
