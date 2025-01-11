import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
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

  const taskSchema = z.object({
    taskId: z.string(),
  });

  const body: unknown = await request.json();

  const result = taskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { taskId } = result.data;

  try {
    const user = await database.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        savedTask: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    const existSavedTask = user.savedTask.find(
      (task) => task.taskId === taskId
    );

    if (existSavedTask) {
      await database.savedTask.delete({
        where: {
          id: existSavedTask.id,
        },
      });
    } else {
      await database.savedTask.create({
        data: {
          user: { connect: { id: session.user.id } },
          task: { connect: { id: taskId } },
        },
      });
    }

    return NextResponse.json("ok", { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}