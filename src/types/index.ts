export type UserRole = "admin" | "analyst" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: "Finance" | "E-Commerce" | "Healthcare" | "Logistics" | "SaaS";
  source: string;
  totalRecords: number;
  createdAt: string;
  updatedAt: string;
  accessPermissions: UserRole[];
}

export interface RecordItem {
  id: string;
  datasetId: string;
  recordNumber: string;
  customerName: string;
  company: string;
  email: string;
  country: string;
  city: string;
  status: "Active" | "Pending" | "Suspended" | "Archived";
  tier: "Enterprise" | "Growth" | "Starter";
  revenue: number;
  dealSize: number;
  churnRisk: "Low" | "Medium" | "High";
  score: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  tags: string[];
}

export type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "between"
  | "in";

export interface FilterCondition {
  id: string;
  field: keyof RecordItem | string;
  operator: FilterOperator;
  value: any;
  valueTo?: any; // For between operator
}

export interface SortCondition {
  field: string;
  direction: "asc" | "desc";
}

export interface SearchQueryState {
  globalSearch: string;
  filters: FilterCondition[];
  sorting: SortCondition[];
  page: number;
  pageSize: number;
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  datasetId: string;
  searchConditions: SearchQueryState;
  visibleColumns: string[];
  isShared: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  querySummary: string;
  datasetId: string;
  filtersCount: number;
  recordsCount: number;
  executionTimeMs: number;
  executedAt: string;
  searchState: SearchQueryState;
}

export interface AnalyticsSummary {
  totalRecords: number;
  totalRevenue: number;
  activeCount: number;
  pendingCount: number;
  avgDealSize: number;
  recordsByCategory: { category: string; count: number; revenue: number }[];
  recordsByStatus: { status: string; count: number }[];
  growthTrends: { month: string; records: number; revenue: number }[];
  frequentFilters: { field: string; usageCount: number }[];
}

