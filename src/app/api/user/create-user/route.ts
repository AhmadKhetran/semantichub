import { nanoid } from "nanoid";

import prisma from "@/app/utils/prisma";
import { sendInvitationEmail } from "@/app/utils/sendmail";

export async function POST(req: Request) {
  try {
    const { email, role, name } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response("User already exists", { status: 409 });
    }

    const token = nanoid(32); // secure unique token

    const data = await prisma.user.create({
      data: {
        email,
        role,
        name,
        inviteToken: token,
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

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;
    await sendInvitationEmail({ toEmail: email, invitationUrl: inviteUrl, role });

    return Response.json({ success: true, data: data });
  } catch (error: any) {
    console.error("Error in POST /invite-user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
