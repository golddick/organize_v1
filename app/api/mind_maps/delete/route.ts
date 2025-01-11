import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { deleteMindMapSchema, mindMapSchema } from "@/schema/mindMapSchema";
import { apiTagSchema } from "@/schema/tagSchema";
import { NotifyType } from "@prisma/client";

import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body: unknown = await request.json();
  const result = deleteMindMapSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, mindMapId } = result.data;

  try {
    const user = await database.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscriptions: {
          where: {
            workspaceId: workspaceId,
          },
          select: {
            userRole: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    if (user.subscriptions[0].userRole === "READ_ONLY") {
      return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
    }

    const mindMap = await database.mindMap.findUnique({
      where: {
        id: mindMapId,
      },
    });

    if (!mindMap)
      return NextResponse.json("ERRORS.NO_MIND_MAP_FOUND", { status: 404 });

    await database.mindMap.delete({
      where: {
        id: mindMap.id,
      },
    });

    await database.notification.deleteMany({
      where: {
        workspaceId,
        mindMapId: mindMap.id,
        notifyType: NotifyType.NEW_MIND_MAP,
      },
    });

    return NextResponse.json("ok", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
