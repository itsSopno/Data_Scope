"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedDatasetId, addDataset } from "@/store/slices/datasetSlice";
import { Dataset } from "@/types";
import { formatNumber } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";

const CATEGORIES: Dataset["category"][] = ["Finance", "E-Commerce", "Healthcare", "Logistics", "SaaS"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Desktop-e column, mobile-e stack
const ROW_GRID =
  "lg:grid lg:grid-cols-[minmax(0,2fr)_110px_120px_minmax(0,1.2fr)_150px] lg:items-center lg:gap-6";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function DatasetsPage() {
  const dispatch = useAppDispatch();
  const { datasets, selectedDatasetId } = useAppSelector((state) => state.dataset);
  const { role } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDsName, setNewDsName] = useState("");
  const [newDsDesc, setNewDsDesc] = useState("");
  const [newDsCategory, setNewDsCategory] = useState<Dataset["category"]>("Finance");
  const [newDsRecords, setNewDsRecords] = useState("100000");

  const isAdmin = role === "admin";

  const resetForm = () => {
    setNewDsName("");
    setNewDsDesc("");
    setNewDsCategory("Finance");
    setNewDsRecords("100000");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Escape chaple modal bondho hoy
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDsName.trim()) return;

    const now = new Date().toISOString();
    const newDataset: Dataset = {
      id: `ds_${Date.now()}`,
      name: newDsName.trim(),
      description: newDsDesc.trim(),
      category: newDsCategory,
      source: "PostgreSQL Production Core",
      totalRecords: parseInt(newDsRecords, 10) || 100000,
      createdAt: now,
      updatedAt: now,
      accessPermissions: ["admin", "analyst"],
    };

    dispatch(addDataset(newDataset));
    dispatch(setSelectedDatasetId(newDataset.id));
    closeModal();
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Datasets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose which dataset the explorer and analytics pages use.
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add dataset
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">Only admins can add datasets.</p>
          )}
        </div>

        {datasets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <p className="font-medium text-foreground">No datasets yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin ? "Add your first dataset to get started." : "Ask an admin to add one."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {/* Column heading (shudhu desktop-e) */}
            <div className={`hidden border-b border-border bg-muted/40 px-5 py-2.5 text-xs text-muted-foreground ${ROW_GRID}`}>
              <span>Dataset</span>
              <span>Category</span>
              <span>Records</span>
              <span>Who can open it</span>
              <span />
            </div>

            <ul className="divide-y divide-border">
              {datasets.map((dataset) => {
                const isSelected = selectedDatasetId === dataset.id;
                const isAuthorized = dataset.accessPermissions.includes(role);

                return (
                  <li
                    key={dataset.id}
                    className={`space-y-2 border-l-2 px-5 py-4 lg:space-y-0 ${ROW_GRID} ${isSelected ? "border-primary bg-primary/5" : "border-transparent"
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{dataset.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {dataset.description || dataset.source}
                      </p>
                    </div>

                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground lg:hidden">Category: </span>
                      {dataset.category}
                    </p>

                    <p className="text-sm tabular-nums text-foreground">
                      {formatNumber(dataset.totalRecords)}
                      <span className="text-muted-foreground lg:hidden"> records</span>
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {dataset.accessPermissions.map(cap).join(", ")}
                    </p>

                    <div className="lg:text-right">
                      {!isAuthorized ? (
                        <span className="text-sm text-muted-foreground">No access</span>
                      ) : isSelected ? (
                        <span className="text-sm font-medium text-primary">In use</span>
                      ) : (
                        <button
                          onClick={() => dispatch(setSelectedDatasetId(dataset.id))}
                          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          Use this dataset
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
          >
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-dataset-title"
              onSubmit={handleCreateDataset}
              className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-lg"
            >
              <h2 id="new-dataset-title" className="text-base font-semibold text-foreground">
                Add a dataset
              </h2>

              <div className="space-y-1.5">
                <label htmlFor="ds-name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="ds-name"
                  type="text"
                  required
                  autoFocus
                  value={newDsName}
                  onChange={(e) => setNewDsName(e.target.value)}
                  placeholder="e.g. Clinic visits 2026"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ds-desc" className="text-sm font-medium text-foreground">
                  Description <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="ds-desc"
                  rows={2}
                  value={newDsDesc}
                  onChange={(e) => setNewDsDesc(e.target.value)}
                  placeholder="A short note on what this data contains"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="ds-category" className="text-sm font-medium text-foreground">
                    Category
                  </label>
                  <select
                    id="ds-category"
                    value={newDsCategory}
                    onChange={(e) => setNewDsCategory(e.target.value as Dataset["category"])}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ds-records" className="text-sm font-medium text-foreground">
                    Number of records
                  </label>
                  <input
                    id="ds-records"
                    type="number"
                    min={100000}
                    step={10000}
                    value={newDsRecords}
                    onChange={(e) => setNewDsRecords(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Add dataset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}