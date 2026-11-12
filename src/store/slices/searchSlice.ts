import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterCondition, SortCondition, SearchQueryState } from "@/types";

interface SearchSliceState extends SearchQueryState {
  isDebouncing: boolean;
}

const initialState: SearchSliceState = {
  globalSearch: "",
  filters: [],
  sorting: [{ field: "revenue", direction: "desc" }],
  page: 1,
  pageSize: 25,
  isDebouncing: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setGlobalSearch: (state, action: PayloadAction<string>) => {
      state.globalSearch = action.payload;
      state.page = 1; // Reset to page 1 on new search
    },
    setDebouncing: (state, action: PayloadAction<boolean>) => {
      state.isDebouncing = action.payload;
    },
    addFilter: (state, action: PayloadAction<FilterCondition>) => {
      state.filters.push(action.payload);
      state.page = 1;
    },
    updateFilter: (state, action: PayloadAction<{ id: string; condition: Partial<FilterCondition> }>) => {
      const index = state.filters.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.filters[index] = { ...state.filters[index], ...action.payload.condition };
      }
      state.page = 1;
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.filter((f) => f.id !== action.payload);
      state.page = 1;
    },
    clearAllFilters: (state) => {
      state.filters = [];
      state.globalSearch = "";
      state.page = 1;
    },
    setSorting: (state, action: PayloadAction<SortCondition[]>) => {
      state.sorting = action.payload;
    },
    toggleColumnSort: (state, action: PayloadAction<string>) => {
      const field = action.payload;
      const existing = state.sorting.find((s) => s.field === field);
      if (!existing) {
        state.sorting = [{ field, direction: "desc" }];
      } else if (existing.direction === "desc") {
        state.sorting = [{ field, direction: "asc" }];
      } else {
        state.sorting = [];
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    loadSearchState: (state, action: PayloadAction<Partial<SearchQueryState>>) => {
      if (action.payload.globalSearch !== undefined) state.globalSearch = action.payload.globalSearch;
      if (action.payload.filters !== undefined) state.filters = action.payload.filters;
      if (action.payload.sorting !== undefined) state.sorting = action.payload.sorting;
      if (action.payload.page !== undefined) state.page = action.payload.page;
      if (action.payload.pageSize !== undefined) state.pageSize = action.payload.pageSize;
    },
  },
});

export const {
  setGlobalSearch,
  setDebouncing,
  addFilter,
  updateFilter,
  removeFilter,
  clearAllFilters,
  setSorting,
  toggleColumnSort,
  setPage,
  setPageSize,
  loadSearchState,
} = searchSlice.actions;

export default searchSlice.reducer;

