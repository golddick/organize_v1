import { getAuthSession } from "@/lib/auth";

import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { database } from "@/lib/database";
import { generateInviteCode } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body: unknown = await request.json();
  const result = z
    .object({
      id: z.string(),
    })
    .safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { id } = result.data;

  try {
    const user = await database.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscriptions: {
          where: {
            workspaceId: id,
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

    if (
      user.subscriptions[0].userRole === "CAN_EDIT" ||
      user.subscriptions[0].userRole === "READ_ONLY"
    ) {
      return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
    }

    const workspace = await database.workspace.update({
      where: {
        id,
      },
      data: {
        inviteCode: generateInviteCode(5),
        adminCode: generateInviteCode(5),
        canEditCode:generateInviteCode(5),
        readOnlyCode: generateInviteCode(5),
      },
    });

    return NextResponse.json(workspace, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
