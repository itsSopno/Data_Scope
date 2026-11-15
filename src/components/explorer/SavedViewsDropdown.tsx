"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setActiveViewId,
  saveNewView,
  deleteSavedView,
} from "@/store/slices/savedViewsSlice";
import { loadSearchState } from "@/store/slices/searchSlice";
import { setVisibleColumns } from "@/store/slices/uiSlice";
import { SavedView } from "@/types";
import {
  Bookmark,
  ChevronDown,
  Plus,
  Trash2,
  Share2,
  Check,
  FolderHeart,
} from "lucide-react";

export function SavedViewsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newViewName, setNewViewName] = useState("");

  const dispatch = useAppDispatch();
  const { savedViews, activeViewId } = useAppSelector((state) => state.savedViews);
  const { globalSearch, filters, sorting, page, pageSize } = useAppSelector((state) => state.search);
  const { visibleColumns } = useAppSelector((state) => state.ui);
  const { selectedDatasetId } = useAppSelector((state) => state.dataset);
  const { user } = useAppSelector((state) => state.auth);

  const activeView = savedViews.find((v) => v.id === activeViewId);

  const handleSelectView = (view: SavedView) => {
    dispatch(setActiveViewId(view.id));
    dispatch(loadSearchState(view.searchConditions));
    if (view.visibleColumns && view.visibleColumns.length > 0) {
      dispatch(setVisibleColumns(view.visibleColumns));
    }
    setIsOpen(false);
  };

  const handleCreateView = () => {
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: `view_${Date.now()}`,
      name: newViewName.trim(),
      datasetId: selectedDatasetId,
      searchConditions: {
        globalSearch,
        filters,
        sorting,
        page,
        pageSize,
      },
      visibleColumns,
      isShared: true,
      createdBy: user?.name || "Alex Vance",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(saveNewView(newView));
    setNewViewName("");
    setIsSavingNew(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted/60 transition-colors shadow-xs"
      >
        <Bookmark className="h-3.5 w-3.5 text-primary" />
        <span className="max-w-[140px] truncate">
          {activeView ? activeView.name : "Saved Views"}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-9 z-50 w-72 max-w-[85vw] rounded-xl border border-border bg-card p-3 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FolderHeart className="h-3.5 w-3.5 text-primary" /> View Presets
              </span>
              <button
                onClick={() => setIsSavingNew(!isSavingNew)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Save Current
              </button>
            </div>

            {isSavingNew && (
              <div className="p-2.5 bg-muted/40 rounded-lg border border-border space-y-2">
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="View name (e.g. Q4 Target Accounts)..."
                  className="w-full text-xs p-1.5 bg-card border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setIsSavingNew(false)}
                    className="text-[11px] px-2 py-0.5 rounded text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateView}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Save View
                  </button>
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto space-y-1">
              {savedViews.map((view) => {
                const isSelected = activeViewId === view.id;
                return (
                  <div
                    key={view.id}
                    onClick={() => handleSelectView(view)}
                    className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="truncate text-xs">{view.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {view.searchConditions.filters.length} filters • By {view.createdBy}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteSavedView(view.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-muted-foreground p-1 transition-opacity"
                        title="Delete view"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

