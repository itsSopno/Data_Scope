"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedRecordId } from "@/store/slices/uiSlice";
import { useGetRecordByIdQuery } from "@/store/api/dataScopeApi";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  X,
  Building,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  TrendingUp,
  History,
  Layers,
  ExternalLink,
  Activity,
} from "lucide-react";

export function RecordDetailDrawer() {
  const dispatch = useAppDispatch();
  const { selectedRecordId } = useAppSelector((state) => state.ui);
  const [activeTab, setActiveTab] = useState<"overview" | "related" | "history">("overview");

  const { data: record, isLoading } = useGetRecordByIdQuery(selectedRecordId || "", {
    skip: !selectedRecordId,
  });

  if (!selectedRecordId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {record?.recordNumber || "RECORD"}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-400">{record?.status || "Active"}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">
              {record?.customerName || "Loading record details..."}
            </h2>
            <p className="text-xs text-muted-foreground">{record?.company}</p>
          </div>

          <button
            onClick={() => dispatch(setSelectedRecordId(null))}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-4 sm:px-6 gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("related")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "related"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-3.5 w-3.5" /> Related Records
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="h-3.5 w-3.5" /> Audit History
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-muted rounded-xl" />
              <div className="h-48 bg-muted rounded-xl" />
            </div>
          ) : !record ? (
            <p className="text-xs text-muted-foreground">Record not found.</p>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Financial Metrics Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[11px] font-medium text-muted-foreground block">Annual Revenue</span>
                      <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                        {formatCurrency(record.revenue)}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <span className="text-[11px] font-medium text-muted-foreground block">Deal Valuation</span>
                      <span className="text-xl font-bold font-mono text-foreground mt-1 block">
                        {formatCurrency(record.dealSize)}
                      </span>
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Account Attributes
                    </h3>
                    <div className="grid grid-cols-2 gap-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Email</span>
                        <span className="font-mono text-foreground">{record.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Location</span>
                        <span className="text-foreground">{record.city}, {record.country}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Tier Level</span>
                        <span className="font-semibold text-primary">{record.tier}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Churn Risk</span>
                        <span className={record.churnRisk === "High" ? "text-rose-400 font-bold" : "text-emerald-400 font-medium"}>
                          {record.churnRisk} Risk ({record.score}/100)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata JSON Tree */}
                  {record.metadata && (
                    <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Custom Metadata Fields
                      </h3>
                      <pre className="text-[11px] font-mono bg-background/80 p-3 rounded-lg overflow-x-auto text-muted-foreground border border-border">
                        {JSON.stringify(record.metadata, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border">
                    <span>Created: {formatDate(record.createdAt)}</span>
                    <span>Last Updated: {formatDate(record.updatedAt)}</span>
                  </div>
                </div>
              )}

              {activeTab === "related" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Direct relational linkages detected in the PostgreSQL database:
                  </p>
                  {(record as any).relatedRecords?.map((rel: any) => (
                    <div
                      key={rel.id}
                      className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between hover:bg-muted/60 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-foreground">{rel.company}</p>
                        <p className="text-[11px] text-muted-foreground">{rel.relationship}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {formatCurrency(rel.revenue)}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">{rel.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Historical change events and automated pipeline logs:
                  </p>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {(record as any).auditHistory?.map((audit: any, index: number) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                        <p className="text-xs font-semibold text-foreground">{audit.action}</p>
                        <p className="text-[11px] text-muted-foreground">
                          by <span className="text-primary">{audit.user}</span> • {formatDate(audit.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

