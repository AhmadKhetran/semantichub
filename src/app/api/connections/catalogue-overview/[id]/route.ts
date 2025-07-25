// app/api/users/route.ts

import { NextResponse } from "next/server";

import prisma from "@/app/utils/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const data = profilingData.find((e) => e.id === id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

const profilingData = [
  {
    id: "cmdhhtemf0005uvlwhr4l96s9",
    name: "My Connection",
    source: "Local",
    rows: 124589,
    columns: 42,
    lastProfiled: "July 22, 2024",
    summary: {
      totalRows: 124589,
      totalColumns: 42,
      missingValues: 8321,
      missingPercentage: 6.68,
      duplicatedRows: 1252,
      duplicatedPercentage: 1.0,
      columnsWithMissing: 11,
      constantColumns: 2,
      numericColumns: 18,
      categoricalColumns: 15,
      datetimeColumns: 4,
      textColumns: 5,
    },
    quality: {
      passedExpectations: 89,
      warnings: 7,
      criticalIssues: 2,
    },
  },
  {
    id: "cmdhhsq3t0003uvlwoozmybcz",
    name: "Ahmad Naeem",
    source: "S3",
    rows: 89234,
    columns: 28,
    lastProfiled: "July 20, 2024",
    summary: {
      totalRows: 89234,
      totalColumns: 28,
      missingValues: 2145,
      missingPercentage: 2.4,
      duplicatedRows: 234,
      duplicatedPercentage: 0.26,
      columnsWithMissing: 6,
      constantColumns: 1,
      numericColumns: 15,
      categoricalColumns: 8,
      datetimeColumns: 3,
      textColumns: 2,
    },
    quality: {
      passedExpectations: 94,
      warnings: 3,
      criticalIssues: 0,
    },
  },
];
