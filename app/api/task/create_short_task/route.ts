import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { shortTaskSchema } from "@/schema/shortTaskSchema";
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

  const newTaskSchema = z.object({
    workspaceId: z.string(),
  });

  const body: unknown = await request.json();

  const result = shortTaskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, icon, title, date: calendarDate, projectId } = result.data;

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

    const date = await database.taskDate.create({
      data: {
        from: calendarDate?.from ? calendarDate?.from : undefined,
        to: calendarDate?.to ? calendarDate?.to : undefined,
      },
    });

    const task = await database.task.create({
      data: {
        title,
        creatorId: user.id,
        workspaceId,
        projectId: projectId,
        dateId: date.id,
        emoji: icon,
      },
    });

    await database.task.update({
      where: {
        id: task.id,
      },
      data: {
        updatedUserId: session.user.id,
      },
    });

    const workspaceUsers = await database.subscription.findMany({
      where: {
        workspaceId,
      },
      select: {
        userId: true,
      },
    });

    const notificationsData = workspaceUsers.map((user) => ({
      notifyCreatorId: session.user.id,
      userId: user.userId,
      workspaceId,
      notifyType: NotifyType.NEW_TASK,
      taskId: task.id,
    }));

    const filterNotificationsData = notificationsData.filter(
      (data) => data.userId !== session.user.id
    );

    await database.notification.createMany({
      data: filterNotificationsData,
    });

    return NextResponse.json(task, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
