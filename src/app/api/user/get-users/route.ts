// app/api/users/route.ts

import { NextResponse } from "next/server";

import prisma from "@/app/utils/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          role: "SUPER_ADMIN",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        status: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
