"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPage, setPageSize } from "@/store/slices/searchSlice";
import { formatNumber } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Zap,
} from "lucide-react";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  executionTimeMs: number;
  cacheHit?: boolean;
}

export function DataTablePagination({
  total,
  page,
  pageSize,
  totalPages,
  executionTimeMs,
  cacheHit,
}: PaginationProps) {
  const dispatch = useAppDispatch();
  const [jumpPage, setJumpPage] = useState("");

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      dispatch(setPage(p));
      setJumpPage("");
    }
  };

  const startRecord = Math.min((page - 1) * pageSize + 1, total);
  const endRecord = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 py-3 px-1 sm:px-2 text-xs text-muted-foreground select-none">
      {/* Left: Total Records & Speed Metrics */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="font-medium text-foreground">
          Showing <span className="font-semibold text-primary">{formatNumber(startRecord)}</span> to{" "}
          <span className="font-semibold text-primary">{formatNumber(endRecord)}</span> of{" "}
          <span className="font-bold text-foreground">{formatNumber(total)}</span> records
        </span>

        {/* Execution Time Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono border ${
            cacheHit
              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          }`}
          title="Server Query Execution Duration"
        >
          {cacheHit ? <Zap className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
          <span>{executionTimeMs}ms {cacheHit ? "(Redis Cache Hit)" : "(PostgreSQL Index)"}</span>
        </div>
      </div>

      {/* Right: Page Size, Jump to Page & Nav Buttons */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
            className="bg-muted/60 border border-input rounded-md px-2 py-1 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Jump to Page Form */}
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
          <span>Page:</span>
          <input
            type="number"
            min={1}
            max={totalPages || 1}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            placeholder={String(page)}
            className="w-12 text-center bg-muted/60 border border-input rounded-md px-1.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span>of {totalPages || 1}</span>
        </form>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch(setPage(1))}
            disabled={page <= 1}
            className="p-1.5 rounded-md border border-input bg-card hover:bg-muted text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-md border border-input bg-card hover:bg-muted text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="px-2 text-xs font-semibold text-foreground">
            {page}
          </span>
          <button
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-md border border-input bg-card hover:bg-muted text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => dispatch(setPage(totalPages))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-md border border-input bg-card hover:bg-muted text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Last Page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

