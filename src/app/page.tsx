import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Product preview-er sample data (illustration, real data noy)
const SAMPLE_ROWS = [
  { company: "Northwind Traders", industry: "Logistics", region: "Dhaka", status: "Active", updated: "Today" },
  { company: "Northfield Textiles", industry: "Manufacturing", region: "Chattogram", status: "Active", updated: "Today" },
  { company: "North Star Foods", industry: "Retail", region: "Sylhet", status: "Pending", updated: "Yesterday" },
  { company: "Northbridge Capital", industry: "Finance", region: "Dhaka", status: "Active", updated: "2 days ago" },
  { company: "Northgate Labs", industry: "Healthcare", region: "Khulna", status: "Inactive", updated: "Last week" },
];

const STATUS_DOT: Record<string, string> = {
  Active: "bg-emerald-500",
  Pending: "bg-amber-500",
  Inactive: "bg-muted-foreground/50",
};

const FEATURES = [
  {
    title: "Search that stays fast",
    text: "Searches run on the server, not in the browser, so the page doesn't slow down as your data grows. Typing a few letters is enough to narrow down 100,000+ records.",
  },
  {
    title: "A table you can shape",
    text: "Show or hide columns, drag to resize them, sort by more than one column, and see your search words highlighted in the results.",
  },
  {
    title: "Views you can share",
    text: "Your filters and sorting live in the page address. Copy the link, send it to a teammate, and they see exactly what you see.",
  },
  {
    title: "The right access for each person",
    text: "Roles decide who can view, edit or manage data, so people only see what they need for their work.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              D
            </span>
            <span className="text-base font-semibold tracking-tight">DataScope</span>
          </Link>

          <nav className="flex items-center gap-2.5 sm:gap-6 text-xs sm:text-sm">
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/login" className="text-muted-foreground transition-colors hover:text-foreground">
              Sign in
            </Link>
            <Link
              href="/explorer"
              className="rounded-md bg-primary px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 text-xs sm:text-sm"
            >
              Open explorer
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1fr_1.1fr] md:py-24">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Find anything in your data, without the wait.
            </h1>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
              DataScope gives your team one place to search, filter and sort large datasets. It
              stays quick even with hundreds of thousands of rows.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/explorer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open the explorer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                See the dashboard
              </Link>
            </div>
          </div>

          {/* Product preview */}
          <figure>
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                <div className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
                  north
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">5 results</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Company</th>
                      <th className="px-4 py-2.5 font-medium">Industry</th>
                      <th className="px-4 py-2.5 font-medium">Region</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                      <th className="px-4 py-2.5 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_ROWS.map((r) => (
                      <tr key={r.company} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium">
                          <mark className="bg-primary/15 text-foreground">North</mark>
                          {r.company.slice(5)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.industry}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.region}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[r.status]}`} />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Sample data, shown for illustration.
            </figcaption>
          </figure>
        </section>

        {/* What it does */}
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1fr_2fr] md:py-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Made for working with big tables
            </h2>

            <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="border-t border-border pt-4">
                  <dt className="font-medium">{f.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Under the hood */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">For the technical team: </span>
              search uses PostgreSQL full-text indexes (GIN) with trigram matching, the interface
              caches requests with RTK Query, and repeat queries are served from Redis.
            </p>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ready to look at your data?</h2>
              <p className="mt-1 text-muted-foreground">Sign in and open the explorer to get started.</p>
            </div>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open the explorer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground">
          <span>&copy; 2026 DataScope</span>
          <span>Enterprise data discovery</span>
        </div>
      </footer>
    </div>
  );
}