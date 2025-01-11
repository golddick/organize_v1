// import { getAuthSession } from "@/lib/auth";
// import { database } from "@/lib/database";
// import { NotifyType } from "@prisma/client";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// export async function POST(request: Request) {
//   const session = await getAuthSession();

//   if (!session?.user) {
//     return new Response("Unauthorized", {
//       status: 400,
//       statusText: "Unauthorized User",
//     });
//   }

//   const newTaskSchema = z.object({
//     workspaceId: z.string(),
//     projectId: z.string(),
//   });

//   const body: unknown = await request.json();

//   const result = newTaskSchema.safeParse(body);

//   if (!result.success) {
//     return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
//   }

//   const { workspaceId, projectId } = result.data;

//   try {
//     const user = await database.user.findUnique({
//       where: {
//         id: session.user.id,
//       },
//       include: {
//         subscriptions: {
//           where: {
//             workspaceId: workspaceId,
//           },
//           select: {
//             userRole: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return new NextResponse("User not found", {
//         status: 404,
//         statusText: "User not Found",
//       });
//     }

//     if (user.subscriptions[0].userRole === "READ_ONLY") {
//       return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
//     }

//     const date = await database.taskDate.create({
//       data: {
//         from: undefined,
//         to: undefined,
//       },
//     });

//     const task = await database.task.create({
//       data: {
//         title: "",
//         creatorId: user.id,
//         workspaceId,
//         dateId: date.id,
//         projectId,
//       },
//     });

//     await database.task.update({
//       where: {
//         id: task.id,
//       },
//       data: {
//         updatedUserId: session.user.id,
//       },
//     });

//     const workspaceUsers = await database.subscription.findMany({
//       where: {
//         workspaceId,
//       },
//       select: {
//         userId: true,
//       },
//     });

//     const notificationsData = workspaceUsers.map((user) => ({
//       notifyCreatorId: session.user.id,
//       userId: user.userId,
//       workspaceId,
//       notifyType: NotifyType.NEW_TASK,
//       taskId: task.id,
//     }));

//     const filterNotificationsData = notificationsData.filter(
//       (data) => data.userId !== session.user.id
//     );

//     await database.notification.createMany({
//       data: filterNotificationsData,
//     });

//     return NextResponse.json(task, { status: 200 });
//   } catch (_) {
//     return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
//   }
// }






import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { NotifyType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

// Function to assign a position to a new task
async function assignTaskPosition(workspaceId: string): Promise<string> {
  const existingTasks = await database.task.findMany({
    where: { workspaceId },
    select: { position: true }, // Only select the position field
  });

  if (existingTasks.length === 0) {
    return "1000"; // Default starting position as a string
  }

  const positions = existingTasks.map(task => parseInt(task.position || "0", 10)); // Convert existing positions to numbers
  const highestPosition = Math.max(...positions);
  
  let newPosition = highestPosition + 300; // Increment by 300

  // Ensure that the new position does not conflict with existing positions
  while (positions.includes(newPosition)) {
    newPosition += 300; // Increment again if there's a conflict
  }

  return newPosition.toString(); // Return as string
}

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
    projectId: z.string(),
  });

  const body: unknown = await request.json();

  const result = newTaskSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, projectId } = result.data;

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

    if (user.subscriptions[0].userRole === "READ_ONLY") {
      return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
    }

    const date = await database.taskDate.create({
      data: {
        from: undefined,
        to: undefined,
      },
    });

    // Assigning position as a string
    const position = await assignTaskPosition(workspaceId);

    const task = await database.task.create({
      data: {
        title: "", // Set your task title here
        creatorId: user.id,
        workspaceId,
        dateId: date.id,
        projectId,
        position, // Assigning calculated position here as string
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
  } catch (error) {
    console.error("Error creating task:", error); // Log error for debugging
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
