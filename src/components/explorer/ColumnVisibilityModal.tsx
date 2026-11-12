"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleColumnVisibility, setVisibleColumns } from "@/store/slices/uiSlice";
import { Columns3, Check, X, RotateCcw } from "lucide-react";

const ALL_COLUMNS = [
  { key: "recordNumber", label: "Record Number" },
  { key: "customerName", label: "Customer Name" },
  { key: "company", label: "Company" },
  { key: "email", label: "Email Address" },
  { key: "country", label: "Country" },
  { key: "status", label: "Status" },
  { key: "tier", label: "Tier" },
  { key: "revenue", label: "Revenue" },
  { key: "dealSize", label: "Deal Size" },
  { key: "churnRisk", label: "Churn Risk" },
  { key: "score", label: "Score" },
  { key: "createdAt", label: "Created Date" },
];

export function ColumnVisibilityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { visibleColumns } = useAppSelector((state) => state.ui);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-input transition-colors"
      >
        <Columns3 className="h-3.5 w-3.5" />
        <span>Columns ({visibleColumns.length})</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-9 z-50 w-56 rounded-xl border border-border bg-card p-3 shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">Visible Columns</span>
              <button
                onClick={() => dispatch(setVisibleColumns(ALL_COLUMNS.map((c) => c.key)))}
                className="text-[10px] text-primary hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Reset
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {ALL_COLUMNS.map((col) => {
                const isVisible = visibleColumns.includes(col.key);
                return (
                  <label
                    key={col.key}
                    onClick={() => dispatch(toggleColumnVisibility(col.key))}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-muted cursor-pointer transition-colors"
                  >
                    <span className={isVisible ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {col.label}
                    </span>
                    {isVisible && <Check className="h-3.5 w-3.5 text-primary" />}
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

