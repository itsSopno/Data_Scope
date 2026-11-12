"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setExportModalOpen } from "@/store/slices/uiSlice";
import {
  Download,
  X,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function ExportModal() {
  const dispatch = useAppDispatch();
  const { isExportModalOpen } = useAppSelector((state) => state.ui);
  const { filters, globalSearch } = useAppSelector((state) => state.search);
  const [exportMode, setExportMode] = useState<"stream" | "background">("stream");
  const [isExporting, setIsExporting] = useState(false);
  const [exportCompleted, setExportCompleted] = useState(false);

  if (!isExportModalOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    setExportCompleted(false);

    // Simulate backend stream generation and chunking
    setTimeout(() => {
      setIsExporting(false);
      setExportCompleted(true);

      // Trigger dummy CSV file download
      const dummyCsv = "recordNumber,customerName,company,email,country,status,revenue,dealSize\nDS-10001,John Smith,Acme Corp,john.smith@acme.com,Germany,Active,72500,68000\nDS-10002,Emma Vance,Nexus Dynamics,emma.vance@nexus.com,United States,Active,89000,75000\n";
      const blob = new Blob([dummyCsv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `datascope_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Export Engine</h3>
              <p className="text-[11px] text-muted-foreground">High-volume CSV data streaming</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setExportModalOpen(false))}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-2">
            <span className="font-semibold text-muted-foreground block">Select Export Strategy:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportMode("stream")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  exportMode === "stream"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <span className="font-bold block text-foreground">Direct Stream</span>
                <span className="text-[11px] text-muted-foreground">For filtered subsets (&lt; 25,000 records)</span>
              </button>
              <button
                onClick={() => setExportMode("background")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  exportMode === "background"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <span className="font-bold block text-foreground">Background Worker</span>
                <span className="text-[11px] text-muted-foreground">For 100k+ full dataset exports</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-1 text-[11px]">
            <span className="text-muted-foreground font-medium">Applied Filter Scope:</span>
            <p className="text-foreground font-semibold">
              {filters.length > 0 || globalSearch
                ? `Filtered Dataset (${filters.length} active filter conditions)`
                : "Entire Active Dataset (100,000 records)"}
            </p>
          </div>

          {exportCompleted && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Export job completed successfully. File downloaded.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <button
            onClick={() => dispatch(setExportModalOpen(false))}
            className="text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleStartExport}
            disabled={isExporting}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Streaming Data..." : "Start Export"}
          </button>
        </div>
      </div>
    </div>
  );
}

