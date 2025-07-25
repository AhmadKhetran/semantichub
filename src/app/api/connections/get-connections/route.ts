// app/api/users/route.ts

import { NextResponse } from "next/server";

import prisma from "@/app/utils/prisma";

export async function GET() {
  try {
    const connections = await prisma.catalogue.findMany({
      select: {
        id: true,
        type: true,
        catalogueName: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        status: true,
        host: true,
        port: true,
        datasource: true,
      },
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
