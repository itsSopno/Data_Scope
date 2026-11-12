import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SavedView, SearchHistoryItem } from "@/types";

interface SavedViewsState {
  savedViews: SavedView[];
  activeViewId: string | null;
  searchHistory: SearchHistoryItem[];
}

const defaultViews: SavedView[] = [
  {
    id: "view_high_value_enterprise",
    name: "High Value Enterprise Clients (Revenue > $50k)",
    description: "Active enterprise accounts generating high MRR",
    datasetId: "ds_enterprise_revenue",
    isShared: true,
    createdBy: "Alex Vance",
    createdAt: "2026-10-01T09:00:00Z",
    updatedAt: "2026-11-01T10:00:00Z",
    visibleColumns: ["customerName", "company", "country", "status", "tier", "revenue", "dealSize"],
    searchConditions: {
      globalSearch: "",
      filters: [
        { id: "f1", field: "tier", operator: "equals", value: "Enterprise" },
        { id: "f2", field: "revenue", operator: "gt", value: 50000 },
      ],
      sorting: [{ field: "revenue", direction: "desc" }],
      page: 1,
      pageSize: 25,
    },
  },
  {
    id: "view_churn_risk_monitoring",
    name: "High Churn Risk & Pending Review",
    description: "Accounts flagged with High churn risk",
    datasetId: "ds_enterprise_revenue",
    isShared: true,
    createdBy: "Data Analyst",
    createdAt: "2026-10-15T14:20:00Z",
    updatedAt: "2026-11-10T08:15:00Z",
    visibleColumns: ["customerName", "company", "country", "status", "churnRisk", "score", "revenue"],
    searchConditions: {
      globalSearch: "",
      filters: [
        { id: "f3", field: "churnRisk", operator: "equals", value: "High" },
      ],
      sorting: [{ field: "score", direction: "asc" }],
      page: 1,
      pageSize: 25,
    },
  },
  {
    id: "view_eu_growth_accounts",
    name: "European Growth Accounts",
    description: "German and UK growth-tier clients",
    datasetId: "ds_enterprise_revenue",
    isShared: false,
    createdBy: "Alex Vance",
    createdAt: "2026-11-05T11:00:00Z",
    updatedAt: "2026-11-05T11:00:00Z",
    visibleColumns: ["customerName", "company", "city", "country", "status", "revenue"],
    searchConditions: {
      globalSearch: "",
      filters: [
        { id: "f4", field: "country", operator: "in", value: ["Germany", "United Kingdom", "France"] },
      ],
      sorting: [{ field: "createdAt", direction: "desc" }],
      page: 1,
      pageSize: 25,
    },
  },
];

const defaultHistory: SearchHistoryItem[] = [
  {
    id: "hist_1",
    querySummary: 'Country: "Germany", Revenue > $10,000, Status: Active',
    datasetId: "ds_enterprise_revenue",
    filtersCount: 3,
    recordsCount: 4120,
    executionTimeMs: 14,
    executedAt: "2026-11-12T14:40:00Z",
    searchState: {
      globalSearch: "",
      filters: [
        { id: "h1", field: "country", operator: "equals", value: "Germany" },
        { id: "h2", field: "revenue", operator: "gt", value: 10000 },
        { id: "h3", field: "status", operator: "equals", value: "Active" },
      ],
      sorting: [{ field: "revenue", direction: "desc" }],
      page: 1,
      pageSize: 25,
    },
  },
  {
    id: "hist_2",
    querySummary: 'Global: "Nexus" + Churn Risk: Low',
    datasetId: "ds_enterprise_revenue",
    filtersCount: 2,
    recordsCount: 348,
    executionTimeMs: 9,
    executedAt: "2026-11-12T14:15:00Z",
    searchState: {
      globalSearch: "Nexus",
      filters: [
        { id: "h4", field: "churnRisk", operator: "equals", value: "Low" },
      ],
      sorting: [{ field: "score", direction: "desc" }],
      page: 1,
      pageSize: 25,
    },
  },
];

const initialState: SavedViewsState = {
  savedViews: defaultViews,
  activeViewId: null,
  searchHistory: defaultHistory,
};

export const savedViewsSlice = createSlice({
  name: "savedViews",
  initialState,
  reducers: {
    setActiveViewId: (state, action: PayloadAction<string | null>) => {
      state.activeViewId = action.payload;
    },
    saveNewView: (state, action: PayloadAction<SavedView>) => {
      state.savedViews.unshift(action.payload);
      state.activeViewId = action.payload.id;
    },
    deleteSavedView: (state, action: PayloadAction<string>) => {
      state.savedViews = state.savedViews.filter((v) => v.id !== action.payload);
      if (state.activeViewId === action.payload) {
        state.activeViewId = null;
      }
    },
    addSearchHistory: (state, action: PayloadAction<SearchHistoryItem>) => {
      state.searchHistory.unshift(action.payload);
      if (state.searchHistory.length > 20) {
        state.searchHistory.pop();
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
  },
});

export const {
  setActiveViewId,
  saveNewView,
  deleteSavedView,
  addSearchHistory,
  clearSearchHistory,
} = savedViewsSlice.actions;

export default savedViewsSlice.reducer;

