"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { formatNumber } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  Database,
  Zap,
  BookmarkCheck,
  History,
  ArrowRight,
  ShieldCheck,
  Server,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  const { datasets } = useAppSelector((state) => state.dataset);
  const { savedViews, searchHistory } = useAppSelector((state) => state.savedViews);
  const { role } = useAppSelector((state) => state.auth);

  const totalIndexedRecords = datasets.reduce((acc, d) => acc + d.totalRecords, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 p-8 shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
              <ShieldCheck className="h-3.5 w-3.5" /> Logged in as {role.toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Enterprise Data Intelligence Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              Explore, filter, and inspect high-volume business datasets with sub-second full-text queries and real-time backend indexing.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/explorer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                Open Data Explorer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-all"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Indexed Records</span>
              <Database className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{formatNumber(totalIndexedRecords)}</p>
            <p className="text-[11px] text-emerald-400 font-medium">PostgreSQL Partitioned</p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Search Speed</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400">12.4 ms</p>
            <p className="text-[11px] text-muted-foreground">GIN + Trigram Index Optimized</p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Saved Filter Presets</span>
              <BookmarkCheck className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{savedViews.length}</p>
            <p className="text-[11px] text-muted-foreground">Synchronized across roles</p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Cache Hit Efficiency</span>
              <Server className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">94.8%</p>
            <p className="text-[11px] text-emerald-400 font-medium">Redis + RTK Query Active</p>
          </div>
        </div>

        {/* Two Column Layout: Active Datasets & Recent Searches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Active Data Collections
              </h3>
              <Link href="/datasets" className="text-xs text-primary hover:underline font-medium">
                View All ({datasets.length})
              </Link>
            </div>

            <div className="space-y-3">
              {datasets.map((ds) => (
                <div
                  key={ds.id}
                  className="p-3.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">{ds.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{ds.source}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {formatNumber(ds.totalRecords)} recs
                    </span>
                    <span className="block text-[10px] text-primary uppercase font-bold">{ds.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-400" /> Recent Search History
              </h3>
              <Link href="/history" className="text-xs text-primary hover:underline font-medium">
                Full History
              </Link>
            </div>

            <div className="space-y-3">
              {searchHistory.slice(0, 4).map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-foreground line-clamp-1">{h.querySummary}</p>
                    <p className="text-[10px] text-muted-foreground">{h.recordsCount.toLocaleString()} matches found</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold">{h.executionTimeMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

