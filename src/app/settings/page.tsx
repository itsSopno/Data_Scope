"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { switchRole } from "@/store/slices/authSlice";
import { UserRole } from "@/types";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  Settings,
  Shield,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" /> Platform Settings &amp; RBAC Control
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage system configurations, user roles, API access, and dataset permissions
          </p>
        </div>

        {/* User Profile Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> User Profile Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-muted-foreground block text-[11px] font-medium mb-1">Full Name</label>
              <input
                type="text"
                readOnly
                value={user?.name || "Alex Vance"}
                className="w-full p-2.5 bg-muted/50 border border-input rounded-lg text-foreground font-semibold"
              />
            </div>
            <div>
              <label className="text-muted-foreground block text-[11px] font-medium mb-1">Email Address</label>
              <input
                type="email"
                readOnly
                value={user?.email || "alex@datascope.enterprise"}
                className="w-full p-2.5 bg-muted/50 border border-input rounded-lg text-foreground font-mono"
              />
            </div>
          </div>
        </div>

        {/* RBAC Role Selector & Matrix */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" /> Active Role Simulation (RBAC)
            </h3>
            <span className="text-xs font-semibold text-primary uppercase">{role} Privilege</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Switch role to test access boundaries and permission gates across the platform:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["admin", "analyst", "viewer"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => dispatch(switchRole(r))}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  role === r
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <span className="font-bold text-xs uppercase block text-foreground">{r}</span>
                <span className="text-[11px] text-muted-foreground">
                  {r === "admin"
                    ? "Full read/write, user & dataset management"
                    : r === "analyst"
                    ? "Explore, advanced search, export, saved views"
                    : "Read-only dataset exploration & views"}
                </span>
              </button>
            ))}
          </div>

          {/* Role Matrix Table */}
          <div className="pt-3 border-t border-border overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2">Capability</th>
                  <th className="py-2 text-center">Administrator</th>
                  <th className="py-2 text-center">Data Analyst</th>
                  <th className="py-2 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-2.5 font-medium">Data Exploration &amp; Global Search</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Create &amp; Save Custom Views</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-muted-foreground">Read-Only</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Export CSV Data Streams</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-rose-500">✕</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Create &amp; Seed Datasets</td>
                  <td className="py-2.5 text-center text-emerald-400">✓</td>
                  <td className="py-2.5 text-center text-rose-500">✕</td>
                  <td className="py-2.5 text-center text-rose-500">✕</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

