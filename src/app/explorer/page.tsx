"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useSearchRecordsQuery } from "@/store/api/dataScopeApi";
import { addSearchHistory } from "@/store/slices/savedViewsSlice";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FilterBuilder } from "@/components/explorer/FilterBuilder";
import { DataTable } from "@/components/explorer/DataTable";
import { DataTablePagination } from "@/components/explorer/DataTablePagination";
import { ColumnVisibilityDropdown } from "@/components/explorer/ColumnVisibilityModal";
import { SavedViewsDropdown } from "@/components/explorer/SavedViewsDropdown";
import {
  Layers,
  RefreshCw,
} from "lucide-react";

export default function ExplorerPage() {
  const dispatch = useAppDispatch();
  const { selectedDatasetId, datasets } = useAppSelector((state) => state.dataset);
  const searchState = useAppSelector((state) => state.search);

  const currentDataset =
    datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  // RTK Query: Handles caching, deduplication, stale-while-revalidate & pagination
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useSearchRecordsQuery(
    {
      datasetId: selectedDatasetId,
      searchState: {
        globalSearch: searchState.globalSearch,
        filters: searchState.filters,
        sorting: searchState.sorting,
        page: searchState.page,
        pageSize: searchState.pageSize,
      },
    }
  );

  useEffect(() => {
    if (data && (searchState.filters.length > 0 || searchState.globalSearch)) {
      dispatch(
        addSearchHistory({
          id: `hist_${Date.now()}`,
          querySummary: `${searchState.globalSearch ? `"${searchState.globalSearch}" ` : ""}${searchState.filters.length} filters applied`,
          datasetId: selectedDatasetId,
          filtersCount: searchState.filters.length,
          recordsCount: data.total,
          executionTimeMs: data.executionTimeMs,
          executedAt: new Date().toISOString(),
          searchState: {
            globalSearch: searchState.globalSearch,
            filters: searchState.filters,
            sorting: searchState.sorting,
            page: searchState.page,
            pageSize: searchState.pageSize,
          },
        })
      );
    }
  }, [data?.total, searchState.filters, searchState.globalSearch, selectedDatasetId, dispatch]);

  return (
    <DashboardShell>
      <div className="flex flex-col h-full space-y-4">
        {/* Top Toolbar: Active Dataset Meta, Presets & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">{currentDataset?.name}</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-input">
                  {currentDataset?.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {currentDataset?.description}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <SavedViewsDropdown />
            <ColumnVisibilityDropdown />
            <button
              onClick={() => refetch()}
              className={`p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all ${
                isFetching ? "animate-spin text-primary" : ""
              }`}
              title="Refetch dataset from PostgreSQL"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Filter Builder */}
        <FilterBuilder />

        {/* Main Data Table */}
        <div className="flex-1 min-h-0 flex flex-col">
          <DataTable
            records={data?.records || []}
            isLoading={isLoading || isFetching}
            globalSearch={searchState.globalSearch}
          />

          {/* Pagination Bar */}
          <DataTablePagination
            total={data?.total || 100000}
            page={searchState.page}
            pageSize={searchState.pageSize}
            totalPages={data?.totalPages || 4000}
            executionTimeMs={data?.executionTimeMs || 12}
            cacheHit={data?.cacheHit}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

