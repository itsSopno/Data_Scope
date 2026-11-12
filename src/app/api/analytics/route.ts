import { NextResponse } from "next/server";
import { staticAnalyticsData } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(staticAnalyticsData);
}

