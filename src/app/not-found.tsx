"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 px-4 select-none">
      <div className="bento-card p-8 max-w-sm w-full text-center space-y-4 border border-border-default dark:border-dark-border bg-white dark:bg-zinc-900">
        <h1 className="text-5xl font-extrabold tracking-tight text-text-primary dark:text-dark-text-primary">
          404
        </h1>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-all hover:bg-foreground/90 cursor-pointer"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
