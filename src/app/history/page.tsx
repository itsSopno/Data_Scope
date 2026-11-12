"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearSearchHistory } from "@/store/slices/savedViewsSlice";
import { loadSearchState } from "@/store/slices/searchSlice";
import { formatDate } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  History,
  Trash2,
  Clock,
  Play,
  Zap,
} from "lucide-react";

export default function SearchHistoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchHistory } = useAppSelector((state) => state.savedViews);

  const handleReRun = (item: any) => {
    dispatch(loadSearchState(item.searchState));
    router.push("/explorer");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" /> Search Query Execution History
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Audit trail of recently executed database search queries with latency metrics
            </p>
          </div>

          {searchHistory.length > 0 && (
            <button
              onClick={() => dispatch(clearSearchHistory())}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear History
            </button>
          )}
        </div>

        {searchHistory.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
            <p className="text-sm font-semibold text-foreground">No search history recorded yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Execute queries in the Data Explorer to automatically populate execution logs.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs divide-y divide-border">
            {searchHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{item.querySummary}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-input">
                      {item.recordsCount.toLocaleString()} matches
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDate(item.executedAt)}
                    </span>
                    <span>•</span>
                    <span>{item.filtersCount} conditions</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Zap className="h-3 w-3" /> {item.executionTimeMs}ms
                  </div>

                  <button
                    onClick={() => handleReRun(item)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors"
                  >
                    <Play className="h-3 w-3 fill-current" /> Re-run
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

