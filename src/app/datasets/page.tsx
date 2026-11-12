"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedDatasetId, addDataset } from "@/store/slices/datasetSlice";
import { Dataset } from "@/types";
import { formatNumber } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  Database,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function DatasetsPage() {
  const dispatch = useAppDispatch();
  const { datasets, selectedDatasetId } = useAppSelector((state) => state.dataset);
  const { role } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDsName, setNewDsName] = useState("");
  const [newDsDesc, setNewDsDesc] = useState("");
  const [newDsCategory, setNewDsCategory] = useState<Dataset["category"]>("Finance");
  const [newDsRecords, setNewDsRecords] = useState("100000");

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsName.trim()) return;

    const newDataset: Dataset = {
      id: `ds_${Date.now()}`,
      name: newDsName.trim(),
      description: newDsDesc.trim() || "Enterprise indexed dataset with automated ingestion pipeline.",
      category: newDsCategory,
      source: "PostgreSQL Production Core",
      totalRecords: parseInt(newDsRecords, 10) || 100000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessPermissions: ["admin", "analyst"],
    };

    dispatch(addDataset(newDataset));
    dispatch(setSelectedDatasetId(newDataset.id));
    setIsModalOpen(false);
    setNewDsName("");
    setNewDsDesc("");
  };

  const isAdmin = role === "admin";

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> Dataset Management Library
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage high-scale data collections, storage engines, and RBAC permissions
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <Plus className="h-4 w-4" /> Register New Dataset
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
              <Lock className="h-3.5 w-3.5 text-amber-500" /> Only Admins can register new datasets
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {datasets.map((dataset) => {
            const isSelected = selectedDatasetId === dataset.id;
            const isAuthorized = dataset.accessPermissions.includes(role);

            return (
              <div
                key={dataset.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-card hover:border-primary/40 shadow-xs"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-foreground border border-input">
                      {dataset.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active Explorer Dataset
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">{dataset.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {dataset.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Indexed Records:</span>
                      <span className="font-mono font-bold text-foreground">
                        {formatNumber(dataset.totalRecords)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Source:</span>
                      <span className="text-foreground text-[11px] font-medium truncate max-w-[170px]">
                        {dataset.source}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Authorized Roles:</span>
                      <div className="flex gap-1">
                        {dataset.accessPermissions.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] uppercase font-mono px-1 rounded bg-muted text-muted-foreground"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-border">
                  {isAuthorized ? (
                    <button
                      onClick={() => dispatch(setSelectedDatasetId(dataset.id))}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {isSelected ? "Currently Active in Explorer" : "Select & Explore"}
                      {!isSelected && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 text-center flex items-center justify-center gap-1">
                      <Lock className="h-3.5 w-3.5" /> Unauthorized for your role
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <form
              onSubmit={handleCreateDataset}
              className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 text-xs"
            >
              <h3 className="text-sm font-bold text-foreground">Register New Enterprise Dataset</h3>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Dataset Name</label>
                <input
                  type="text"
                  required
                  value={newDsName}
                  onChange={(e) => setNewDsName(e.target.value)}
                  placeholder="e.g. Healthcare Clinical Telemetry"
                  className="w-full p-2 bg-muted/60 border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Description</label>
                <textarea
                  rows={2}
                  value={newDsDesc}
                  onChange={(e) => setNewDsDesc(e.target.value)}
                  placeholder="Dataset summary..."
                  className="w-full p-2 bg-muted/60 border border-input rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Category</label>
                  <select
                    value={newDsCategory}
                    onChange={(e) => setNewDsCategory(e.target.value as any)}
                    className="w-full p-2 bg-muted/60 border border-input rounded-lg text-foreground font-medium"
                  >
                    <option value="Finance">Finance</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Logistics">Logistics</option>
                    <option value="SaaS">SaaS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Initial Records Count</label>
                  <input
                    type="number"
                    min={100000}
                    step={10000}
                    value={newDsRecords}
                    onChange={(e) => setNewDsRecords(e.target.value)}
                    className="w-full p-2 bg-muted/60 border border-input rounded-lg text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                >
                  Register &amp; Seed
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

