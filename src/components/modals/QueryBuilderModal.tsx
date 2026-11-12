"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setQueryBuilderOpen } from "@/store/slices/uiSlice";
import { addFilter, clearAllFilters } from "@/store/slices/searchSlice";
import { FilterCondition } from "@/types";
import {
  X,
  Sliders,
  Plus,
  Trash2,
  Code2,
  ArrowRight,
  Database,
} from "lucide-react";

export function QueryBuilderModal() {
  const dispatch = useAppDispatch();
  const { isQueryBuilderOpen } = useAppSelector((state) => state.ui);

  const [builderRules, setBuilderRules] = useState<FilterCondition[]>([
    { id: "qb_1", field: "status", operator: "equals", value: "Active" },
    { id: "qb_2", field: "country", operator: "equals", value: "Germany" },
    { id: "qb_3", field: "revenue", operator: "gt", value: 10000 },
  ]);

  if (!isQueryBuilderOpen) return null;

  const addRule = () => {
    setBuilderRules([
      ...builderRules,
      { id: `qb_${Date.now()}`, field: "status", operator: "equals", value: "Active" },
    ]);
  };

  const updateRule = (id: string, updates: Partial<FilterCondition>) => {
    setBuilderRules(builderRules.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const removeRule = (id: string) => {
    setBuilderRules(builderRules.filter((r) => r.id !== id));
  };

  // Generate live SQL query string representation
  const generatedSql = `SELECT * FROM "dataset_records"
WHERE "dataset_id" = 'ds_enterprise_revenue'
  ${builderRules
    .map((r) => {
      const op = r.operator === "equals" ? "=" : r.operator === "gt" ? ">" : r.operator === "lt" ? "<" : "LIKE";
      const val = typeof r.value === "number" ? r.value : `'${r.value}'`;
      return `AND "${String(r.field)}" ${op} ${val}`;
    })
    .join("\n  ")}
ORDER BY "revenue" DESC
LIMIT 25 OFFSET 0;`;

  const handleApplyToExplorer = () => {
    dispatch(clearAllFilters());
    builderRules.forEach((r) => dispatch(addFilter(r)));
    dispatch(setQueryBuilderOpen(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Visual Query Builder</h3>
              <p className="text-[11px] text-muted-foreground">
                Construct multi-clause nested queries with instant SQL code generation
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setQueryBuilderOpen(false))}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Rules Builder Container */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-primary" /> WHERE Clause Conditions (AND)
              </span>
              <button
                onClick={addRule}
                className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Rule
              </button>
            </div>

            <div className="space-y-2.5">
              {builderRules.map((rule, idx) => (
                <div key={rule.id} className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                  <span className="text-[11px] font-mono text-muted-foreground w-6 text-center">
                    {idx === 0 ? "IF" : "AND"}
                  </span>

                  <select
                    value={String(rule.field)}
                    onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                    className="text-xs bg-muted/60 border border-input rounded-md px-2 py-1.5 text-foreground font-medium"
                  >
                    <option value="status">Status</option>
                    <option value="country">Country</option>
                    <option value="tier">Tier</option>
                    <option value="revenue">Revenue</option>
                    <option value="churnRisk">Churn Risk</option>
                    <option value="score">Health Score</option>
                    <option value="company">Company</option>
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(rule.id, { operator: e.target.value as any })}
                    className="text-xs bg-muted/60 border border-input rounded-md px-2 py-1.5 text-foreground font-medium"
                  >
                    <option value="equals">Equals (=)</option>
                    <option value="gt">Greater Than (&gt;)</option>
                    <option value="lt">Less Than (&lt;)</option>
                    <option value="contains">Contains (ILIKE)</option>
                  </select>

                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    className="text-xs bg-muted/60 border border-input rounded-md px-2.5 py-1.5 text-foreground flex-1"
                    placeholder="Value..."
                  />

                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-500 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Generated SQL */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Code2 className="h-3.5 w-3.5 text-emerald-400" /> Compiled PostgreSQL Output:
            </div>
            <pre className="text-xs font-mono bg-background/90 text-emerald-400 p-4 rounded-xl border border-border overflow-x-auto">
              {generatedSql}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground">
            {builderRules.length} condition{builderRules.length > 1 ? "s" : ""} defined
          </span>
          <button
            onClick={handleApplyToExplorer}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            Execute in Explorer <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

