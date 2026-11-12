"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleColumnSort } from "@/store/slices/searchSlice";
import { setSelectedRecordId, setColumnWidth } from "@/store/slices/uiSlice";
import { RecordItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface DataTableProps {
  records: RecordItem[];
  isLoading: boolean;
  globalSearch: string;
}

export function DataTable({ records, isLoading, globalSearch }: DataTableProps) {
  const dispatch = useAppDispatch();
  const { visibleColumns, columnWidths, density } = useAppSelector((state) => state.ui);
  const { sorting } = useAppSelector((state) => state.search);

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [startX, setStartX] = useState<number>(0);
  const [startWidth, setStartWidth] = useState<number>(0);

  // Column headers definition
  const columnsMeta: Record<string, { label: string; align?: "left" | "right" | "center" }> = {
    recordNumber: { label: "Record #", align: "left" },
    customerName: { label: "Customer Name", align: "left" },
    company: { label: "Company", align: "left" },
    email: { label: "Email Address", align: "left" },
    country: { label: "Country", align: "left" },
    status: { label: "Status", align: "center" },
    tier: { label: "Tier", align: "center" },
    revenue: { label: "Revenue", align: "right" },
    dealSize: { label: "Deal Size", align: "right" },
    churnRisk: { label: "Churn Risk", align: "center" },
    score: { label: "Score", align: "right" },
    createdAt: { label: "Created Date", align: "left" },
  };

  // Checkbox multi-select helpers
  const isAllSelected = records.length > 0 && selectedRowIds.length === records.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(records.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  // Column Resizing handlers
  const handleMouseDownResize = (colKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResizingCol(colKey);
    setStartX(e.clientX);
    setStartWidth(columnWidths[colKey] || 150);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - e.clientX;
      const newWidth = Math.max(80, (columnWidths[colKey] || 150) + delta);
      dispatch(setColumnWidth({ column: colKey, width: newWidth }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setResizingCol(null);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Search keyword highlighter
  const highlightMatch = (text: string) => {
    if (!globalSearch || !text) return text;
    const parts = text.split(new RegExp(`(${globalSearch})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === globalSearch.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Status Badge Helper
  const renderStatusBadge = (status: RecordItem["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Active
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
            Suspended
          </span>
        );
      case "Archived":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
            Archived
          </span>
        );
    }
  };

  // Churn Risk Badge Helper
  const renderChurnBadge = (risk: RecordItem["churnRisk"]) => {
    switch (risk) {
      case "Low":
        return <span className="text-[11px] font-semibold text-emerald-500">Low</span>;
      case "Medium":
        return <span className="text-[11px] font-semibold text-amber-500">Medium</span>;
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            High Risk
          </span>
        );
    }
  };

  const pyClass = density === "compact" ? "py-1.5" : "py-3";

  return (
    <div className="relative border border-border rounded-xl bg-card overflow-hidden shadow-xs">
      {/* Table Container */}
      <div className="overflow-x-auto max-h-[620px] scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead className="sticky top-0 bg-muted/90 backdrop-blur-md z-10 border-b border-border text-muted-foreground uppercase tracking-wider font-semibold">
            <tr>
              {/* Checkbox All */}
              <th className="w-10 px-3 py-3 text-center">
                <button onClick={toggleSelectAll} className="hover:text-foreground">
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>

              {visibleColumns.map((colKey) => {
                const meta = columnsMeta[colKey] || { label: colKey };
                const sortState = sorting.find((s) => s.field === colKey);
                const width = columnWidths[colKey] || 150;

                return (
                  <th
                    key={colKey}
                    style={{ width: `${width}px`, minWidth: `${width}px` }}
                    className="relative px-3 py-3 select-none group"
                  >
                    <div
                      onClick={() => dispatch(toggleColumnSort(colKey))}
                      className={`flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors ${
                        meta.align === "right"
                          ? "justify-end"
                          : meta.align === "center"
                          ? "justify-center"
                          : "justify-start"
                      }`}
                    >
                      <span>{meta.label}</span>
                      {sortState ? (
                        sortState.direction === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-primary shrink-0" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-primary shrink-0" />
                        )
                      ) : (
                        <ArrowUpDown className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 shrink-0" />
                      )}
                    </div>

                    {/* Column Resizing Handle */}
                    <div
                      onMouseDown={(e) => handleMouseDownResize(colKey, e)}
                      className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary transition-colors ${
                        resizingCol === colKey ? "bg-primary" : "bg-border/60"
                      }`}
                    />
                  </th>
                );
              })}

              <th className="w-12 px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/60">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-3 py-3 text-center">
                    <div className="h-4 w-4 bg-muted rounded mx-auto" />
                  </td>
                  {visibleColumns.map((col) => (
                    <td key={col} className="px-3 py-3">
                      <div className="h-4 bg-muted/80 rounded w-4/5" />
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center">
                    <div className="h-4 w-4 bg-muted rounded mx-auto" />
                  </td>
                </tr>
              ))
            ) : records.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={visibleColumns.length + 2} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">No records match your criteria</p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Try adjusting or clearing your search filters to view more records from this dataset.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              records.map((record) => {
                const isSelected = selectedRowIds.includes(record.id);

                return (
                  <tr
                    key={record.id}
                    onClick={() => dispatch(setSelectedRecordId(record.id))}
                    className={`cursor-pointer transition-colors hover:bg-muted/40 ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Row Select Checkbox */}
                    <td
                      onClick={(e) => toggleSelectRow(record.id, e)}
                      className={`px-3 ${pyClass} text-center`}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground/60 hover:text-foreground mx-auto" />
                      )}
                    </td>

                    {/* Dynamic Cells */}
                    {visibleColumns.map((colKey) => {
                      return (
                        <td key={colKey} className={`px-3 ${pyClass} text-foreground font-normal`}>
                          {colKey === "recordNumber" && (
                            <span className="font-mono font-semibold text-primary">
                              {highlightMatch(record.recordNumber)}
                            </span>
                          )}
                          {colKey === "customerName" && (
                            <span className="font-semibold text-foreground">
                              {highlightMatch(record.customerName)}
                            </span>
                          )}
                          {colKey === "company" && (
                            <span className="text-foreground/90 font-medium">
                              {highlightMatch(record.company)}
                            </span>
                          )}
                          {colKey === "email" && (
                            <span className="text-muted-foreground font-mono text-[11px]">
                              {highlightMatch(record.email)}
                            </span>
                          )}
                          {colKey === "country" && (
                            <span>{highlightMatch(record.country)}</span>
                          )}
                          {colKey === "status" && (
                            <div className="text-center">{renderStatusBadge(record.status)}</div>
                          )}
                          {colKey === "tier" && (
                            <div className="text-center">
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                  record.tier === "Enterprise"
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : record.tier === "Growth"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {record.tier}
                              </span>
                            </div>
                          )}
                          {colKey === "revenue" && (
                            <div className="text-right font-semibold font-mono text-emerald-400">
                              {formatCurrency(record.revenue)}
                            </div>
                          )}
                          {colKey === "dealSize" && (
                            <div className="text-right font-mono text-muted-foreground">
                              {formatCurrency(record.dealSize)}
                            </div>
                          )}
                          {colKey === "churnRisk" && (
                            <div className="text-center">{renderChurnBadge(record.churnRisk)}</div>
                          )}
                          {colKey === "score" && (
                            <div className="text-right font-mono font-medium">
                              <span
                                className={
                                  record.score > 75
                                    ? "text-emerald-400 font-bold"
                                    : record.score > 50
                                    ? "text-amber-400"
                                    : "text-rose-400"
                                }
                              >
                                {record.score}/100
                              </span>
                            </div>
                          )}
                          {colKey === "createdAt" && (
                            <span className="text-muted-foreground">{formatDate(record.createdAt)}</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Action Cell */}
                    <td className={`px-3 ${pyClass} text-center`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setSelectedRecordId(record.id));
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="View Full Record Details"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

