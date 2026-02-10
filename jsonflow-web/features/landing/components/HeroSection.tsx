"use client";

import Link from "next/link";
import { FiPlay, FiBook } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16 md:px-12 md:pt-28 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            Schema-Aware Diagram Engine
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Turn JSON into
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Visual Diagrams
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="mt-6 max-w-2xl text-lg md:text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            A renderer-agnostic engine that validates, enriches, and transforms JSON into
            interactive graphs. Built with semantic checks and adapter-based rendering.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/web"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg-primary)",
              }}
            >
              <FiPlay className="h-4 w-4" />
              Try the Playground
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl border px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <FiBook className="h-4 w-4" />
              Read Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
