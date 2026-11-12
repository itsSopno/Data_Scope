import { NextResponse } from "next/server";
import { generateMockRecords } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const records = generateMockRecords(50, 0);
  const found = records.find((r) => r.id === id) || records[0];

  return NextResponse.json({
    ...found,
    id,
    auditHistory: [
      { action: "Created", timestamp: found.createdAt, user: "System Ingestion Pipeline" },
      { action: "Risk Score Recalculated", timestamp: found.updatedAt, user: "AI Intelligence Worker" },
      { action: "Revenue Verified", timestamp: new Date().toISOString(), user: "Alex Vance" },
    ],
    relatedRecords: records.slice(1, 4).map((rel) => ({
      id: rel.id,
      company: rel.company,
      relationship: "Parent Entity / Subsidiary",
      revenue: rel.revenue,
      status: rel.status,
    })),
  });
}

