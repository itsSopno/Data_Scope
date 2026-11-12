import { NextResponse } from "next/server";
import { defaultDatasets } from "@/store/slices/datasetSlice";

export async function GET() {
  return NextResponse.json(defaultDatasets);
}

