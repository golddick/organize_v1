import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { deleteUserFromWorkspaceSchema } from "@/schema/deleteUserFromWorkspaceSchema";
import { editUserRoleSchema } from "@/schema/editUserRoleSchema";
import { NotifyType } from "@prisma/client";
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
  const result = editUserRoleSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { userId, workspaceId, newRole } = result.data;

  try {
    const user = await database.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscriptions: {
          where: {
            workspaceId,
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

    const updatedUser = await database.subscription.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        userRole: newRole,
      },
    });

    await database.notification.create({
      data: {
        notifyCreatorId: session.user.id,
        userId: userId,
        workspaceId,
        notifyType: NotifyType.NEW_ROLE,
      },
    });

    return NextResponse.json(updatedUser.userRole, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
