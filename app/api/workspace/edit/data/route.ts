import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { deleteAccountSchema } from "@/schema/deleteAccountSchema";
import {
  apiWorkspaceDeletePicture,
  apiWorkspaceEditData,
  apiWorkspacePicture,
} from "@/schema/workspaceSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body: unknown = await request.json();
  const result = apiWorkspaceEditData.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { id, color, workspaceName } = result.data;

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

    await database.workspace.update({
      where: {
        id,
      },
      data: {
        name: workspaceName,
        color,
      },
    });

    return NextResponse.json(result.data, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
