import Link from "next/link";
import {
  Layers,
  ArrowRight,
  Database,
  Zap,
  ShieldCheck,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  TableProperties,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Navbar */}
      <header className="h-16 border-b border-border/80 backdrop-blur-md bg-card/60 sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            DataScope
          </span>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            Enterprise
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/explorer"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            Open Platform <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          <Zap className="h-3.5 w-3.5" /> Sub-second Discovery Across 100,000+ Records
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Enterprise Data Discovery &amp; Intelligence Platform
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Engineered for data-intensive enterprise workloads. Explore multi-column datasets, execute
          server-side full-text searches, and analyze millions of records with sub-15ms response times.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/explorer"
            className="text-sm font-semibold px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
          >
            <TableProperties className="h-4 w-4" /> Launch Data Explorer
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold px-6 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-all flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" /> Overview Dashboard
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground border-t border-border/60">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> PostgreSQL Full-Text Search (GIN)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> RTK Query Server State &amp; Cache
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Virtualized Resizable Table
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Multi-Role RBAC Authorization
          </span>
        </div>
      </section>

      {/* Architecture Highlights Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-border/60 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Engineered for Extreme Scalability &amp; Low Latency
          </h2>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            Addressing core enterprise big data bottlenecks through modern database indexing and frontend system design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Server-Side Query Engine</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero client memory bloat. Dynamic multi-condition WHERE clauses, GIN indexes, and Trigram matching execute directly on PostgreSQL.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Smart RTK Caching &amp; Deduplication</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automatic stale-while-revalidate data fetching with Redis tier caching, debounced query requests, and optimistic updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TableProperties className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">Advanced Explorer Table</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dynamic column management, drag resizing, multi-column sorting, keyword highlighting, and deep URL state synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 text-center text-xs text-muted-foreground">
        <p>DataScope – Enterprise Data Discovery &amp; Intelligence Platform © 2026.</p>
      </footer>
    </div>
  );
}

