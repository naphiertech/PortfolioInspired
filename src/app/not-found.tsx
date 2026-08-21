"use client";

import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center select-none space-y-4">
      <div className="p-6 rounded-lg bg-surface/30 border border-border-hairline max-w-sm w-full space-y-3">
        <div className="w-10 h-10 rounded-[6px] bg-surface border border-border-hairline flex items-center justify-center mx-auto text-muted-foreground">
          <Terminal className="w-5 h-5" />
        </div>

        <h1 className="font-display text-4xl font-bold text-ink">404</h1>

        <p className="font-mono text-xs text-muted-foreground">
          {"// Error: The requested route could not be resolved in this workspace."}
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="tactile-btn !h-[30px] px-4 gap-1.5 w-full justify-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
