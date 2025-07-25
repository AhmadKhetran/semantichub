import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  try {
    const { catalogueName, datasource, host, password, port, type, username, createdById } = await req.json();

    console.log("", type, datasource);
    const data = await prisma.catalogue.create({
      data: {
        userName: username,
        datasource: datasource,
        host: host,
        password: password,
        catalogueName: catalogueName,
        port: port,
        status: "IN_PROGRESS",
        type: type,
        createdById: createdById,
      },
    });

    return Response.json({ success: true, data: data });
  } catch (error: any) {
    console.error("Error in POST /invite-user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
