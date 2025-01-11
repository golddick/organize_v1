import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { deleteTaskSchema } from "@/schema/taskSchema";
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

  const result = deleteTaskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, taskId } = result.data;

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

    const task = await database.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        taskDate: true,
      },
    });

    if (!task)
      return NextResponse.json("ERRORS.NO_TASK_FOUND", { status: 404 });

    await database.task.delete({
      where: {
        id: task.id,
      },
    });

    await database.notification.deleteMany({
      where: {
        workspaceId,
        taskId: task.id,
        notifyType: NotifyType.NEW_TASK,
      },
    });

    return NextResponse.json("ok", { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
