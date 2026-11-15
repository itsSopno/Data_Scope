"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setAIModalOpen,
  setExportModalOpen,
  setDensity,
  toggleMobileSidebar,
} from "@/store/slices/uiSlice";
import { setGlobalSearch } from "@/store/slices/searchSlice";
import {
  Search,
  Sparkles,
  Download,
  Zap,
  Menu,
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
        return "Dashboard";
      case "/explorer":
        return "Data Explorer";
      case "/datasets":
        return "Dataset Library";
      case "/saved-views":
        return "Saved Views";
      case "/history":
        return "Search History";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      default:
        return "DataScope";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setGlobalSearch(searchInput));
  };

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20 gap-2">
      {/* Mobile Menu Button + Page Title & Status Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => dispatch(toggleMobileSidebar())}
          className="lg:hidden p-2 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-foreground tracking-tight truncate">
            {getPageTitle()}
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground truncate">
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <CheckCircle2 className="h-3 w-3" /> RTK Cache Online
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-500 font-medium">
              <Zap className="h-3 w-3" /> Indexed (100k+)
            </span>
          </div>
        </div>
      </div>

      {/* Topbar Center / Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Global search..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-background/80 text-muted-foreground px-1 py-0.5 rounded border border-border">
            ↵
          </kbd>
        </form>

        {/* AI Natural Language Search */}
        <button
          onClick={() => dispatch(setAIModalOpen(true))}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-xs shrink-0"
          title="AI Natural Language Query Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <span className="hidden sm:inline">AI Query</span>
        </button>

        {/* Table Density Switcher */}
        <div className="hidden xl:flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-input text-xs">
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

        {/* Export Data Button */}
        <button
          onClick={() => dispatch(setExportModalOpen(true))}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-all shrink-0"
        >
          <Download className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>
    </header>
  );
}
