import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dataset } from "@/types";

interface DatasetState {
  selectedDatasetId: string;
  datasets: Dataset[];
  isLoading: boolean;
}

export const defaultDatasets: Dataset[] = [
  {
    id: "ds_enterprise_revenue",
    name: "Global Enterprise Accounts & Revenue",
    description: "Multi-regional B2B accounts, contract valuations, risk scoring, and churn analytics.",
    category: "Finance",
    source: "PostgreSQL Production Core (Replicated)",
    totalRecords: 100000,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-11-12T14:30:00Z",
    accessPermissions: ["admin", "analyst", "viewer"],
  },
  {
    id: "ds_ecommerce_orders",
    name: "Omnichannel Logistics & High-Volume Orders",
    description: "Transaction logs, inventory movements, carrier tracking, and order fulfillment states.",
    category: "Logistics",
    source: "PostgreSQL Partitioned Archive",
    totalRecords: 250000,
    createdAt: "2026-02-14T10:15:00Z",
    updatedAt: "2026-11-11T19:20:00Z",
    accessPermissions: ["admin", "analyst"],
  },
  {
    id: "ds_healthcare_telemetry",
    name: "Clinical Telemetry & Patient Cohort Registry",
    description: "HIPAA-compliant telemetry logs, device metrics, and diagnostic code mappings.",
    category: "Healthcare",
    source: "Encrypted PostgreSQL Cluster",
    totalRecords: 120000,
    createdAt: "2026-03-01T12:00:00Z",
    updatedAt: "2026-11-10T11:45:00Z",
    accessPermissions: ["admin"],
  },
];

const initialState: DatasetState = {
  selectedDatasetId: "ds_enterprise_revenue",
  datasets: defaultDatasets,
  isLoading: false,
};

export const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setSelectedDatasetId: (state, action: PayloadAction<string>) => {
      state.selectedDatasetId = action.payload;
    },
    setDatasets: (state, action: PayloadAction<Dataset[]>) => {
      state.datasets = action.payload;
    },
    addDataset: (state, action: PayloadAction<Dataset>) => {
      state.datasets.unshift(action.payload);
    },
  },
});

export const { setSelectedDatasetId, setDatasets, addDataset } = datasetSlice.actions;
export default datasetSlice.reducer;

