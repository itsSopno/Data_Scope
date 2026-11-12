"use client";

import React from "react";
import { useGetAnalyticsQuery } from "@/store/api/dataScopeApi";
import { useAppSelector } from "@/store";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Filter,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const { selectedDatasetId } = useAppSelector((state) => state.dataset);
  const { data: analytics, isLoading } = useGetAnalyticsQuery(selectedDatasetId);

  if (isLoading || !analytics) {
    return (
      <DashboardShell>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Dataset Intelligence & Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time backend aggregations computed over 100,000+ indexed PostgreSQL records
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Scaled Records
            </span>
            <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
              {formatNumber(analytics.totalRecords)}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">100% Ingested & Indexed</span>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Aggregate Revenue
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {formatCurrency(analytics.totalRevenue)}
            </span>
            <span className="text-[11px] text-muted-foreground">Across enterprise tiers</span>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Active Accounts
            </span>
            <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
              {formatNumber(analytics.activeCount)}
            </span>
            <span className="text-[11px] text-blue-400 font-medium">64.2% Health Ratio</span>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Average Deal Valuation
            </span>
            <span className="text-2xl font-bold font-mono text-foreground mt-1 block">
              {formatCurrency(analytics.avgDealSize)}
            </span>
            <span className="text-[11px] text-muted-foreground">Mean contract size</span>
          </div>
        </div>

        {/* Row 1: Growth Trends & Records by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> Data Ingestion & Revenue Trends
              </h3>
              <span className="text-xs font-mono text-muted-foreground">Monthly Aggregates</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.growthTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#718096" fontSize={11} />
                  <YAxis stroke="#718096" fontSize={11} tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(val: any) => [formatCurrency(Number(val)), "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" /> Volume Distribution by Category
              </h3>
              <span className="text-xs font-mono text-muted-foreground">Grouped Aggregations</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.recordsByCategory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.3} />
                  <XAxis dataKey="category" stroke="#718096" fontSize={11} />
                  <YAxis stroke="#718096" fontSize={11} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(val: any) => [`${formatNumber(Number(val))} records`, "Count"]}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 2: Status Breakdown & Frequently Used Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" /> Account Status Breakdown
              </h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.recordsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {analytics.recordsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(val: any) => [formatNumber(Number(val)), "Accounts"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4 text-purple-400" /> Most Frequently Executed Filters
              </h3>
              <span className="text-xs text-muted-foreground">Audit Log Insights</span>
            </div>

            <div className="space-y-3 pt-2">
              {analytics.frequentFilters.map((f, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">{f.field}</span>
                    <span className="font-mono text-muted-foreground">{formatNumber(f.usageCount)} runs</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${(f.usageCount / 4500) * 100}%` }}
                    />
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

