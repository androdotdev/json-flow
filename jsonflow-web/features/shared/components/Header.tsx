import Link from "next/link";
import ThemeToggle from "@/features/shared/components/ThemeToggle";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="flex w-full flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--text-muted)" }}
          >
            JSONFLOW / editor + renderer
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Schema-Aware Diagram Playground
          </h1>
          <p className="max-w-2xl text-sm" style={{ color: "var(--text-secondary)" }}>
            Paste JSON, validate with the engine, and render Cytoscape output.
            Flowchart-first, fast, and fully local.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition hover:-translate-y-0.5 cursor-pointer"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            }}
            href="/docs"
            target="_blank"
          >
            Open Docs
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
