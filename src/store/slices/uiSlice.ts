import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  visibleColumns: string[];
  columnWidths: Record<string, number>;
  selectedRecordId: string | null;
  isFilterDrawerOpen: boolean;
  isQueryBuilderOpen: boolean;
  isAIModalOpen: boolean;
  isExportModalOpen: boolean;
  density: "compact" | "standard" | "comfortable";
  theme: "light" | "dark" | "system";
}

const defaultColumns = [
  "recordNumber",
  "customerName",
  "company",
  "email",
  "country",
  "status",
  "tier",
  "revenue",
  "dealSize",
  "churnRisk",
  "score",
  "createdAt",
];

const initialState: UIState = {
  sidebarCollapsed: false,
  isMobileSidebarOpen: false,
  visibleColumns: defaultColumns,
  columnWidths: {
    recordNumber: 130,
    customerName: 180,
    company: 180,
    email: 220,
    country: 130,
    status: 120,
    tier: 130,
    revenue: 140,
    dealSize: 130,
    churnRisk: 120,
    score: 100,
    createdAt: 130,
  },
  selectedRecordId: null,
  isFilterDrawerOpen: false,
  isQueryBuilderOpen: false,
  isAIModalOpen: false,
  isExportModalOpen: false,
  density: "standard",
  theme: "dark",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const col = action.payload;
      if (state.visibleColumns.includes(col)) {
        if (state.visibleColumns.length > 2) {
          state.visibleColumns = state.visibleColumns.filter((c) => c !== col);
        }
      } else {
        state.visibleColumns.push(col);
      }
    },
    setColumnWidth: (state, action: PayloadAction<{ column: string; width: number }>) => {
      state.columnWidths[action.payload.column] = action.payload.width;
    },
    setSelectedRecordId: (state, action: PayloadAction<string | null>) => {
      state.selectedRecordId = action.payload;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterDrawerOpen = action.payload;
    },
    setQueryBuilderOpen: (state, action: PayloadAction<boolean>) => {
      state.isQueryBuilderOpen = action.payload;
    },
    setAIModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAIModalOpen = action.payload;
    },
    setExportModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExportModalOpen = action.payload;
    },
    setDensity: (state, action: PayloadAction<"compact" | "standard" | "comfortable">) => {
      state.density = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setSidebarCollapsed,
  setVisibleColumns,
  toggleColumnVisibility,
  setColumnWidth,
  setSelectedRecordId,
  setFilterDrawerOpen,
  setQueryBuilderOpen,
  setAIModalOpen,
  setExportModalOpen,
  setDensity,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;

