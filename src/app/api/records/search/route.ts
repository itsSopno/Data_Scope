import { NextResponse } from "next/server";
import { generateMockRecords } from "@/lib/mock-data";
import { RecordItem, FilterCondition, SortCondition } from "@/types";

// Cached memory pool of 2000 base records, simulating a 100,000 partition index
const baseRecords = generateMockRecords(2000, 0);

export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const body = await request.json();
    const {
      datasetId = "ds_enterprise_revenue",
      globalSearch = "",
      filters = [],
      sorting = [],
      page = 1,
      pageSize = 25,
    } = body;

    let filtered: RecordItem[] = [...baseRecords];

    // 1. Global Search (Simulating PostgreSQL Full-Text Search tsvector @@ tsquery)
    if (globalSearch && typeof globalSearch === "string" && globalSearch.trim() !== "") {
      const q = globalSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.recordNumber.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }

    // 2. Multi-Condition Filtering (Field-based, Ranges, Operators)
    if (Array.isArray(filters) && filters.length > 0) {
      filtered = filtered.filter((record) => {
        return filters.every((cond: FilterCondition) => {
          const val = (record as any)[cond.field];
          if (val === undefined || val === null) return true;

          switch (cond.operator) {
            case "equals":
              return String(val).toLowerCase() === String(cond.value).toLowerCase();
            case "contains":
              return String(val).toLowerCase().includes(String(cond.value).toLowerCase());
            case "startsWith":
              return String(val).toLowerCase().startsWith(String(cond.value).toLowerCase());
            case "gt":
              return Number(val) > Number(cond.value);
            case "gte":
              return Number(val) >= Number(cond.value);
            case "lt":
              return Number(val) < Number(cond.value);
            case "lte":
              return Number(val) <= Number(cond.value);
            case "between":
              return (
                Number(val) >= Number(cond.value) &&
                Number(val) <= Number(cond.valueTo ?? Infinity)
              );
            case "in":
              if (Array.isArray(cond.value)) {
                return cond.value.includes(val);
              }
              return true;
            default:
              return true;
          }
        });
      });
    }

    // 3. Multi-Column Sorting
    if (Array.isArray(sorting) && sorting.length > 0) {
      filtered.sort((a, b) => {
        for (const sort of sorting as SortCondition[]) {
          const valA = (a as any)[sort.field];
          const valB = (b as any)[sort.field];

          if (valA === valB) continue;

          let comparison = 0;
          if (typeof valA === "number" && typeof valB === "number") {
            comparison = valA - valB;
          } else {
            comparison = String(valA).localeCompare(String(valB));
          }

          return sort.direction === "desc" ? -comparison : comparison;
        }
        return 0;
      });
    }

    // Total records calculation (Simulating 100,000 scale multiplier when unfiltered)
    const simulatedScaleRatio = 50; // 2,000 base * 50 = 100,000 total simulated scale
    const rawTotal = filtered.length;
    const isUnfiltered = !globalSearch && filters.length === 0;
    const calculatedTotal = isUnfiltered ? 100000 : rawTotal * 20;

    // 4. Server-Side Pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedRecords = filtered.slice(
      startIndex % baseRecords.length,
      (startIndex % baseRecords.length) + pageSize
    );

    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime + Math.random() * 8) * 10) / 10;

    return NextResponse.json({
      records: paginatedRecords,
      total: calculatedTotal,
      page,
      pageSize,
      totalPages: Math.ceil(calculatedTotal / pageSize),
      executionTimeMs,
      cacheHit: executionTimeMs < 5,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Search query failed", details: err?.message },
      { status: 500 }
    );
  }
}

