import prisma from "@/app/utils/prisma";
import { sendInvitationEmail } from "@/app/utils/sendmail";

export async function POST(req: Request) {
  try {
    const { id, role, name, status } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return new Response("User Does Not Exist", { status: 409 });
    }

    const data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
        name,
        status,
      },
    });

    return Response.json({ success: true, data: data });
  } catch (error: any) {
    console.error("Error in POST /invite-user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
