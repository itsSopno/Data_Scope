"use client";

import React, { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useSearchRecordsQuery } from "@/store/api/dataScopeApi";
import { addSearchHistory } from "@/store/slices/savedViewsSlice";
import { formatNumber } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { FilterBuilder } from "@/components/explorer/FilterBuilder";
import { DataTable } from "@/components/explorer/DataTable";
import { DataTablePagination } from "@/components/explorer/DataTablePagination";
import { ColumnVisibilityDropdown } from "@/components/explorer/ColumnVisibilityModal";
import { SavedViewsDropdown } from "@/components/explorer/SavedViewsDropdown";

export default function ExplorerPage() {
  const dispatch = useAppDispatch();
  const { selectedDatasetId, datasets } = useAppSelector((state) => state.dataset);
  const searchState = useAppSelector((state) => state.search);

  const currentDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  const { data, isLoading, isFetching, isError, refetch } = useSearchRecordsQuery({
    datasetId: selectedDatasetId,
    searchState: {
      globalSearch: searchState.globalSearch,
      filters: searchState.filters,
      sorting: searchState.sorting,
      page: searchState.page,
      pageSize: searchState.pageSize,
    },
  });

  // Search history: shudhu notun result ashle, ar ekta query-r jonno ekbar.
  // (Age filter bodlalei purono data diye log hoye jeto, ar page bodlaleo abar log hoto na.)
  const lastLogged = useRef("");
  useEffect(() => {
    if (!data || isFetching) return;
    if (searchState.filters.length === 0 && !searchState.globalSearch) return;

    const key = JSON.stringify([selectedDatasetId, searchState.globalSearch, searchState.filters]);
    if (key === lastLogged.current) return;
    lastLogged.current = key;

    const n = searchState.filters.length;
    dispatch(
      addSearchHistory({
        id: `hist_${Date.now()}`,
        querySummary: `${searchState.globalSearch ? `"${searchState.globalSearch}" ` : ""}${n} ${n === 1 ? "filter" : "filters"} applied`,
        datasetId: selectedDatasetId,
        filtersCount: n,
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
  }, [data, isFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DashboardShell>
      <div className="flex h-full flex-col gap-5">
        {/* Header: dataset-er porichoy + action */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {currentDataset?.name ?? "Explorer"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentDataset
                ? [
                  currentDataset.category,
                  `${formatNumber(currentDataset.totalRecords)} records`,
                  currentDataset.description,
                ]
                  .filter(Boolean)
                  .join(" · ")
                : "Pick a dataset on the Datasets page to begin."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <SavedViewsDropdown />
            <ColumnVisibilityDropdown />
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterBuilder />

        {isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm"
          >
            <span className="text-foreground">We couldn&apos;t load the records.</span>
            <button
              onClick={() => refetch()}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Table + pagination */}
        <div className="flex min-h-0 flex-1 flex-col">
          <DataTable
            records={data?.records ?? []}
            isLoading={isLoading || isFetching}
            globalSearch={searchState.globalSearch}
          />

          {/* Ager moto 100000 / 4000 / 12 er banano fallback number nei */}
          <DataTablePagination
            total={data?.total ?? 0}
            page={searchState.page}
            pageSize={searchState.pageSize}
            totalPages={data?.totalPages ?? 0}
            executionTimeMs={data?.executionTimeMs ?? 0}
            cacheHit={data?.cacheHit}
          />
        </div>
      </div>
    </DashboardShell>
  );
}