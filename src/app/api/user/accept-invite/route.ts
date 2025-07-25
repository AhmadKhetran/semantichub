import bcrypt from "bcryptjs";

import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response("Missing token or password", { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { inviteToken: token },
    });

    if (!user || user.status === "ACTIVE") {
      return new Response("Invalid or expired token", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        inviteToken: null,
        status: "ACTIVE",
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Invite user error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
