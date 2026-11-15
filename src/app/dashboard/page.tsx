"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAppSelector } from "@/store";
import { formatNumber } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Link href={href} className="text-sm text-primary underline-offset-4 hover:underline">
          {linkLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</p>
);

export default function DashboardPage() {
  const { datasets } = useAppSelector((state) => state.dataset);
  const { savedViews, searchHistory } = useAppSelector((state) => state.savedViews);
  const { role } = useAppSelector((state) => state.auth);

  const totalRecords = datasets.reduce((sum, d) => sum + d.totalRecords, 0);

  // Hardcode na kore search history theke gorhe hishab kora
  const avgSearchMs = searchHistory.length
    ? Math.round(searchHistory.reduce((sum, h) => sum + h.executionTimeMs, 0) / searchHistory.length)
    : null;

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";

  const kpis = [
    { label: "Total records", value: formatNumber(totalRecords), note: `Across ${datasets.length} ${datasets.length === 1 ? "dataset" : "datasets"}` },
    { label: "Datasets", value: formatNumber(datasets.length), note: "Available to you" },
    { label: "Saved views", value: formatNumber(savedViews.length), note: "Filters you can reopen" },
    {
      label: "Average search time",
      value: avgSearchMs === null ? "-" : `${avgSearchMs} ms`,
      note: avgSearchMs === null ? "No searches yet" : "From your recent searches",
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {roleLabel ? `You're signed in as ${roleLabel}. ` : ""}Here's where things stand.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/analytics"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              View analytics
            </Link>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open explorer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Key figures */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border bg-card divide-y sm:divide-y-0 sm:divide-x divide-border">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="p-4 sm:p-5"
            >
              <dt className="text-xs sm:text-sm text-muted-foreground">{k.label}</dt>
              <dd className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums text-foreground">{k.value}</dd>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">{k.note}</p>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Datasets */}
          <Panel title="Your datasets" href="/datasets" linkLabel={`View all (${datasets.length})`}>
            {datasets.length === 0 ? (
              <Empty>No datasets yet.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {datasets.map((ds) => (
                  <li key={ds.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{ds.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{ds.source}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm tabular-nums text-foreground">
                        {formatNumber(ds.totalRecords)} records
                      </p>
                      <p className="text-xs text-muted-foreground">{ds.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Recent searches */}
          <Panel title="Recent searches" href="/history" linkLabel="See all">
            {searchHistory.length === 0 ? (
              <Empty>Your searches will show up here.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {searchHistory.slice(0, 4).map((h) => (
                  <li key={h.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{h.querySummary}</p>
                      <p className="text-xs text-muted-foreground">
                        {h.recordsCount.toLocaleString()} {h.recordsCount === 1 ? "match" : "matches"}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {h.executionTimeMs} ms
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}