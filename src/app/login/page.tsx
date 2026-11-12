"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { switchRole, setUser } from "@/store/slices/authSlice";
import { UserRole } from "@/types";
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("alex.vance@datascope.enterprise");
  const [password, setPassword] = useState("••••••••••••");

  const handleLogin = (selectedRole: UserRole = "admin") => {
    dispatch(
      setUser({
        id: `usr_${selectedRole}_${Date.now()}`,
        name: selectedRole === "admin" ? "Alex Vance" : selectedRole === "analyst" ? "Sarah Connor" : "David Bowman",
        email: `${selectedRole}@datascope.enterprise`,
        role: selectedRole,
      })
    );
    dispatch(switchRole(selectedRole));
    router.push("/explorer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Sign In to DataScope</h2>
          <p className="text-xs text-muted-foreground">
            Enterprise Data Discovery &amp; Intelligence Platform
          </p>
        </div>

        {/* Credentials Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin("admin");
          }}
          className="space-y-4 text-xs"
        >
          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            Authenticate <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Evaluator Quick Demo Roles */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[11px] font-semibold text-muted-foreground block text-center uppercase tracking-wider">
            Quick 1-Click Demo Evaluation Roles
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLogin("admin")}
              className="py-2 px-1 text-center rounded-lg border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition-colors text-[11px] font-bold text-foreground"
            >
              Administrator
            </button>
            <button
              onClick={() => handleLogin("analyst")}
              className="py-2 px-1 text-center rounded-lg border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition-colors text-[11px] font-bold text-foreground"
            >
              Data Analyst
            </button>
            <button
              onClick={() => handleLogin("viewer")}
              className="py-2 px-1 text-center rounded-lg border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition-colors text-[11px] font-bold text-foreground"
            >
              Viewer Role
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

