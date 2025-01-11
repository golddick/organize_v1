


import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { UpdateTaskStatusSchema, updateTaskStatusSchema } from "@/schema/updateTaskSchema";
import { TaskStatus } from "@prisma/client";
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

   // Log the body to debug the structure
   console.log('Received body:', body);

  const result = updateTaskStatusSchema.safeParse(body);

  console.log("status result", result)

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { taskStatus, taskId, workspaceId } = result.data;

  // Validate the required fields
  if (!taskStatus || !taskId || !workspaceId) {
    console.log('Missing fields:', { taskStatus, taskId, workspaceId });
    return NextResponse.json("ERRORS.MISSING_FIELDS", { status: 400 });
  }

  console.log('Validating fields:', { taskStatus, taskId, workspaceId });


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

    const userRole = user.subscriptions[0]?.userRole;

    // Restrict actions for READ_ONLY users
    if (userRole === "READ_ONLY") {
      return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
    }
    
    // Restrict updating to 'DONE' to only OWNER
    if (taskStatus === "DONE" && userRole !== "OWNER") {
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

    if (!task) {
      return NextResponse.json("ERRORS.NO_TASK_FOUND", { status: 404 });
    }

    const updatedTask = await database.task.update({
      where: {
        id: task.id,
      },
      data: {
        updatedUserId: session.user.id,
        taskStatus: taskStatus,
      },
    });

    console.log('Task status updated:', updatedTask);

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}

