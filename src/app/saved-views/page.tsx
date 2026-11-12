"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteSavedView,
  setActiveViewId,
} from "@/store/slices/savedViewsSlice";
import { loadSearchState } from "@/store/slices/searchSlice";
import { setVisibleColumns } from "@/store/slices/uiSlice";
import { formatDate } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  BookmarkCheck,
  Play,
  Trash2,
} from "lucide-react";

export default function SavedViewsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { savedViews } = useAppSelector((state) => state.savedViews);

  const handleApplyView = (view: any) => {
    dispatch(setActiveViewId(view.id));
    dispatch(loadSearchState(view.searchConditions));
    if (view.visibleColumns) {
      dispatch(setVisibleColumns(view.visibleColumns));
    }
    router.push("/explorer");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-primary" /> Saved Search Views &amp; Presets
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Frequently used multi-condition query configurations shared with team members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedViews.map((view) => (
            <div
              key={view.id}
              className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {view.isShared ? "Team Shared" : "Private View"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(view.createdAt)}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">{view.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {view.description || "Custom saved explorer configuration."}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    Configured Conditions ({view.searchConditions.filters.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {view.searchConditions.filters.map((f, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-muted/60 text-foreground px-2 py-0.5 rounded border border-input font-medium"
                      >
                        {String(f.field)} {f.operator} {String(f.value)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  onClick={() => dispatch(deleteSavedView(view.id))}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete view"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleApplyView(view)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Play className="h-3 w-3 fill-current" /> Apply in Explorer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

