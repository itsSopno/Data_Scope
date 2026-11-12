"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { switchRole } from "@/store/slices/authSlice";
import { setSelectedDatasetId } from "@/store/slices/datasetSlice";
import { UserRole } from "@/types";
import {
  LayoutDashboard,
  Database,
  TableProperties,
  BookmarkCheck,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);
  const { role, user } = useAppSelector((state) => state.auth);
  const { datasets, selectedDatasetId } = useAppSelector((state) => state.dataset);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Data Explorer", href: "/explorer", icon: TableProperties, badge: "Core" },
    { label: "Dataset Library", href: "/datasets", icon: Database },
    { label: "Saved Views", href: "/saved-views", icon: BookmarkCheck },
    { label: "Search History", href: "/history", icon: History },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "User Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-300 z-30 select-none ${
        sidebarCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                DataScope
              </span>
              <span className="ml-1.5 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Enterprise
              </span>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="mx-auto h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Layers className="h-5 w-5" />
          </div>
        )}

        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Dataset Quick Switcher */}
      {!sidebarCollapsed && (
        <div className="p-3 border-b border-border/60">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5 px-1">
            Active Dataset
          </label>
          <select
            value={selectedDatasetId}
            onChange={(e) => dispatch(setSelectedDatasetId(e.target.value))}
            className="w-full text-xs bg-muted/50 border border-input rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium truncate"
          >
            {datasets.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.name} ({(ds.totalRecords / 1000).toFixed(0)}k recs)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher (Crucial for Evaluation & RBAC Testing) */}
      <div className="p-3 border-t border-border/80 bg-muted/20">
        {!sidebarCollapsed && (
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-indigo-500" /> Current Role
              </span>
              <span className="text-[10px] text-primary capitalize font-bold">{role}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-muted/60 p-1 rounded-md border border-input">
              {(["admin", "analyst", "viewer"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => dispatch(switchRole(r))}
                  className={`text-[11px] py-1 rounded font-medium capitalize transition-all ${
                    role === r
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User profile capsule */}
        <div className={`flex items-center gap-3 p-1.5 rounded-lg ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {user?.name?.slice(0, 2).toUpperCase() || "AV"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-foreground">{user?.name || "Alex Vance"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email || "alex@datascope.io"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

