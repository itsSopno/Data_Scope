"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAIModalOpen, setExportModalOpen, setDensity } from "@/store/slices/uiSlice";
import { setGlobalSearch } from "@/store/slices/searchSlice";
import {
  Search,
  Sparkles,
  Download,
  Zap,
  SlidersHorizontal,
  Bell,
  CheckCircle2,
} from "lucide-react";

export function Topbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { globalSearch } = useAppSelector((state) => state.search);
  const { density } = useAppSelector((state) => state.ui);
  const [searchInput, setSearchInput] = useState(globalSearch);

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Overview Dashboard";
      case "/explorer":
        return "Data Explorer";
      case "/datasets":
        return "Dataset Management Library";
      case "/saved-views":
        return "Saved Views & Presets";
      case "/history":
        return "Search Query History";
      case "/analytics":
        return "Intelligence & Analytics";
      case "/settings":
        return "Platform Settings & Access Control";
      default:
        return "DataScope Platform";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setGlobalSearch(searchInput));
  };

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-6 flex items-center justify-between z-20">
      {/* Page Title & Status Indicator */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <CheckCircle2 className="h-3 w-3" /> RTK Query Cache Online
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-500 font-medium">
              <Zap className="h-3 w-3" /> PostgreSQL Indexed (100k+)
            </span>
          </div>
        </div>
      </div>

      {/* Topbar Center / Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Global search (press Enter)..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-background/80 text-muted-foreground px-1.5 py-0.5 rounded border border-border">
            ↵
          </kbd>
        </form>

        {/* AI Natural Language Search (Bonus Challenge E) */}
        <button
          onClick={() => dispatch(setAIModalOpen(true))}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-xs"
          title="AI Natural Language Query Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span className="hidden sm:inline">AI Query</span>
        </button>

        {/* Table Density Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-input text-xs">
          <button
            onClick={() => dispatch(setDensity("compact"))}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              density === "compact" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground"
            }`}
          >
            Compact
          </button>
          <button
            onClick={() => dispatch(setDensity("standard"))}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              density === "standard" ? "bg-background text-foreground shadow-xs font-semibold" : "text-muted-foreground"
            }`}
          >
            Standard
          </button>
        </div>

        {/* Export Data Button (Bonus Challenge B & C) */}
        <button
          onClick={() => dispatch(setExportModalOpen(true))}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>
    </header>
  );
}

