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
} from "recharts";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// Status gulo-r jonno shamanyo muted rong
const STATUS_COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"];

// Tooltip Tailwind class diye, tai light/dark duita theme-e-i thik thake
function ChartTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  format: (n: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{format(Number(payload[0].value))}</p>
    </div>
  );
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const axisProps = {
  stroke: "currentColor",
  strokeOpacity: 0.2,
  tick: { fill: "currentColor", fontSize: 12 },
  tickLine: false,
} as const;

export default function AnalyticsPage() {
  const { selectedDatasetId } = useAppSelector((state) => state.dataset);
  const { data: analytics, isLoading, isError } = useGetAnalyticsQuery(selectedDatasetId);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
          Loading analytics...
        </div>
      </DashboardShell>
    );
  }

  if (isError || !analytics) {
    return (
      <DashboardShell>
        <div className="flex h-96 flex-col items-center justify-center gap-1 text-center">
          <p className="font-medium text-foreground">We couldn&apos;t load the analytics</p>
          <p className="text-sm text-muted-foreground">Please refresh the page or try again in a moment.</p>
        </div>
      </DashboardShell>
    );
  }

  // Hardcode na kore real data theke hishab kora
  const activeShare = analytics.totalRecords
    ? Math.round((analytics.activeCount / analytics.totalRecords) * 100)
    : 0;
  const statusTotal = analytics.recordsByStatus.reduce((sum, s) => sum + s.count, 0) || 1;
  const maxFilterUse = Math.max(1, ...analytics.frequentFilters.map((f) => f.usageCount));

  const kpis = [
    { label: "Total records", value: formatNumber(analytics.totalRecords), note: "In this dataset" },
    { label: "Total revenue", value: formatCurrency(analytics.totalRevenue), note: "Across all records" },
    {
      label: "Active accounts",
      value: formatNumber(analytics.activeCount),
      note: `${activeShare}% of all records`,
    },
    { label: "Average deal size", value: formatCurrency(analytics.avgDealSize), note: "Per contract" },
  ];

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A summary of the records in the selected dataset.
          </p>
        </div>

        {/* Key figures: ek box-e, shoman 4 bhag */}
        <dl className="grid grid-cols-2 divide-border rounded-lg border border-border bg-card lg:grid-cols-4 lg:divide-x">
          {kpis.map((k, i) => (
            <div
              key={k.label}
              className={`p-5 ${i < 2 ? "border-b border-border lg:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-border lg:border-r-0" : ""}`}
            >
              <dt className="text-sm text-muted-foreground">{k.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{k.value}</dd>
              <p className="mt-1 text-xs text-muted-foreground">{k.note}</p>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Revenue by month" note="Monthly totals">
            <div className="h-72 w-full text-muted-foreground">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.growthTrends} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.12} vertical={false} />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis {...axisProps} axisLine={false} tickFormatter={(v) => `$${compact.format(v)}`} />
                  <Tooltip content={<ChartTooltip format={(n) => formatCurrency(n)} />} />
                  <Area
                    className="text-primary"
                    type="monotone"
                    dataKey="revenue"
                    stroke="currentColor"
                    strokeWidth={2}
                    fill="currentColor"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Records by category" note="How many records sit in each category">
            <div className="h-72 w-full text-muted-foreground">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.recordsByCategory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="currentColor" strokeOpacity={0.12} vertical={false} />
                  <XAxis dataKey="category" {...axisProps} />
                  <YAxis {...axisProps} axisLine={false} tickFormatter={(v) => compact.format(v)} />
                  <Tooltip
                    cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                    content={<ChartTooltip format={(n) => `${formatNumber(n)} records`} />}
                  />
                  <Bar className="text-primary" dataKey="count" fill="currentColor" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Account status" note="Share of accounts in each status">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              {analytics.recordsByStatus.map((s, i) => (
                <div
                  key={s.status}
                  title={s.status}
                  style={{ width: `${(s.count / statusTotal) * 100}%`, backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                />
              ))}
            </div>

            <ul className="mt-5 divide-y divide-border text-sm">
              {analytics.recordsByStatus.map((s, i) => (
                <li key={s.status} className="flex items-center gap-3 py-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                  />
                  <span className="flex-1 text-foreground">{s.status}</span>
                  <span className="tabular-nums text-muted-foreground">{formatNumber(s.count)}</span>
                  <span className="w-12 text-right tabular-nums text-foreground">
                    {Math.round((s.count / statusTotal) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Most used filters" note="What people filter by most often">
            <ul className="space-y-4">
              {analytics.frequentFilters.map((f) => (
                <li key={f.field}>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{f.field}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatNumber(f.usageCount)} times
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(f.usageCount / maxFilterUse) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}