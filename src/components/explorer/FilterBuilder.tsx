"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addFilter,
  removeFilter,
  clearAllFilters,
  setGlobalSearch,
} from "@/store/slices/searchSlice";
import { setQueryBuilderOpen } from "@/store/slices/uiSlice";
import { FilterCondition, FilterOperator } from "@/types";
import {
  Plus,
  X,
  Filter,
  Trash2,
  Sliders,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const FILTERABLE_FIELDS = [
  { label: "Status", value: "status", type: "select", options: ["Active", "Pending", "Suspended", "Archived"] },
  { label: "Customer Tier", value: "tier", type: "select", options: ["Enterprise", "Growth", "Starter"] },
  { label: "Country", value: "country", type: "select", options: ["United States", "Germany", "United Kingdom", "France", "Japan", "Canada", "Australia", "Singapore"] },
  { label: "Revenue ($)", value: "revenue", type: "number" },
  { label: "Deal Size ($)", value: "dealSize", type: "number" },
  { label: "Churn Risk", value: "churnRisk", type: "select", options: ["Low", "Medium", "High"] },
  { label: "Health Score", value: "score", type: "number" },
  { label: "Company Name", value: "company", type: "text" },
];

export function FilterBuilder() {
  const dispatch = useAppDispatch();
  const { filters, globalSearch } = useAppSelector((state) => state.search);

  const [selectedField, setSelectedField] = useState(FILTERABLE_FIELDS[0].value);
  const [operator, setOperator] = useState<FilterOperator>("equals");
  const [filterValue, setFilterValue] = useState("Active");

  const currentFieldDef = FILTERABLE_FIELDS.find((f) => f.value === selectedField) || FILTERABLE_FIELDS[0];

  const handleFieldChange = (fieldVal: string) => {
    setSelectedField(fieldVal);
    const def = FILTERABLE_FIELDS.find((f) => f.value === fieldVal);
    if (def?.type === "select" && def.options) {
      setOperator("equals");
      setFilterValue(def.options[0]);
    } else if (def?.type === "number") {
      setOperator("gt");
      setFilterValue("10000");
    } else {
      setOperator("contains");
      setFilterValue("");
    }
  };

  const handleAddCondition = () => {
    if (!filterValue && currentFieldDef.type !== "number") return;

    const newFilter: FilterCondition = {
      id: `filter_${Date.now()}`,
      field: selectedField,
      operator,
      value: currentFieldDef.type === "number" ? Number(filterValue) : filterValue,
    };

    dispatch(addFilter(newFilter));
  };

  return (
    <div className="bg-card/70 border border-border rounded-xl p-4 shadow-xs space-y-3">
      {/* Top Bar: Quick Add & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">
            <Filter className="h-3.5 w-3.5 text-primary" /> Filter Engine
          </div>

          {/* Field Selector */}
          <select
            value={selectedField}
            onChange={(e) => handleFieldChange(e.target.value)}
            className="text-xs bg-muted/60 border border-input rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium w-full sm:w-auto"
          >
            {FILTERABLE_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Operator Selector */}
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as FilterOperator)}
            className="text-xs bg-muted/60 border border-input rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium w-full sm:w-auto"
          >
            {currentFieldDef.type === "number" ? (
              <>
                <option value="gt">Greater Than (&gt;)</option>
                <option value="gte">Greater or Equal (&gt;=)</option>
                <option value="lt">Less Than (&lt;)</option>
                <option value="lte">Less or Equal (&lt;=)</option>
                <option value="equals">Equals (=)</option>
              </>
            ) : currentFieldDef.type === "select" ? (
              <>
                <option value="equals">Is</option>
                <option value="in">Is Any Of</option>
              </>
            ) : (
              <>
                <option value="contains">Contains</option>
                <option value="startsWith">Starts With</option>
                <option value="equals">Exact Match</option>
              </>
            )}
          </select>

          {/* Value Input */}
          {currentFieldDef.type === "select" && currentFieldDef.options ? (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="text-xs bg-muted/60 border border-input rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium w-full sm:w-auto"
            >
              {currentFieldDef.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={currentFieldDef.type === "number" ? "number" : "text"}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Enter value..."
              className="text-xs bg-muted/60 border border-input rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground w-full sm:w-36"
            />
          )}

          {/* Add Filter Button */}
          <button
            onClick={handleAddCondition}
            className="flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs w-full sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5" /> Add Condition
          </button>
        </div>

        {/* Visual Query Builder Modal Trigger (Bonus Challenge A) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(setQueryBuilderOpen(true))}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-input transition-all"
            title="Open Visual SQL Query Builder"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Visual Query Builder</span>
          </button>

          {(filters.length > 0 || globalSearch) && (
            <button
              onClick={() => dispatch(clearAllFilters())}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips / Badges */}
      {(filters.length > 0 || globalSearch) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
          <span className="text-[11px] font-medium text-muted-foreground">Active Conditions:</span>

          {globalSearch && (
            <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md">
              <span className="font-semibold">Global:</span> &quot;{globalSearch}&quot;
              <button
                onClick={() => dispatch(setGlobalSearch(""))}
                className="hover:text-primary-foreground hover:bg-primary rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filters.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-1.5 text-xs bg-muted border border-border px-2.5 py-1 rounded-md text-foreground"
            >
              <span className="font-medium text-muted-foreground capitalize">{String(f.field)}</span>
              <span className="text-primary font-bold">
                {f.operator === "equals"
                  ? "="
                  : f.operator === "gt"
                  ? ">"
                  : f.operator === "lt"
                  ? "<"
                  : f.operator}
              </span>
              <span className="font-semibold text-foreground">
                {typeof f.value === "number" ? `$${f.value.toLocaleString()}` : String(f.value)}
              </span>
              <button
                onClick={() => dispatch(removeFilter(f.id))}
                className="hover:text-rose-500 text-muted-foreground ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

