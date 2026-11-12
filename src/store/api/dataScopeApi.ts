import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Dataset, RecordItem, SearchQueryState, AnalyticsSummary } from "@/types";

export interface SearchRecordsResponse {
  records: RecordItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  executionTimeMs: number;
  cacheHit: boolean;
}

export const dataScopeApi = createApi({
  reducerPath: "dataScopeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Records", "Datasets", "SavedViews", "Analytics"],
  endpoints: (builder) => ({
    getDatasets: builder.query<Dataset[], void>({
      query: () => "/datasets",
      providesTags: ["Datasets"],
    }),

    searchRecords: builder.query<
      SearchRecordsResponse,
      { datasetId: string; searchState: SearchQueryState }
    >({
      query: ({ datasetId, searchState }) => ({
        url: `/records/search`,
        method: "POST",
        body: { datasetId, ...searchState },
      }),
      providesTags: (result, error, { datasetId }) => [
        { type: "Records", id: datasetId },
      ],
      // Keep unused data in cache for 120 seconds to prevent unnecessary API calls
      keepUnusedDataFor: 120,
    }),

    getRecordById: builder.query<RecordItem, string>({
      query: (id) => `/records/${id}`,
      providesTags: (result, error, id) => [{ type: "Records", id }],
    }),

    getAnalytics: builder.query<AnalyticsSummary, string>({
      query: (datasetId) => `/analytics?datasetId=${datasetId}`,
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetDatasetsQuery,
  useSearchRecordsQuery,
  useGetRecordByIdQuery,
  useGetAnalyticsQuery,
} = dataScopeApi;

