
import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  const workspaceId = url.searchParams.get("workspaceId");
  const taskId = url.searchParams.get("taskId");

  if (!workspaceId || !taskId)
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 404 });

  try {
    const users = await database.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        subscribers: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                assignedToTask: {
                  select: {
                    userId: true,
                  },
                  where: {
                    taskId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!users) return NextResponse.json([], { status: 200 });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};


// import { database } from "@/lib/database";
// import { NextResponse } from "next/server";

// export const GET = async (request: Request) => {
//   const url = new URL(request.url);

//   const workspaceId = url.searchParams.get("workspaceId");
//   const taskId = url.searchParams.get("taskId");

//   if (!workspaceId || !taskId) {
//     return NextResponse.json("ERRORS.WRONG_DATA", { status: 404 });
//   }

//   try {
//     // Fetch the workspace and check if the user is assigned to the task
//     const workspace = await database.workspace.findUnique({
//       where: { id: workspaceId },
//       include: {
//         subscribers: {
//           select: {
//             user: {
//               select: {
//                 id: true,
//                 username: true,
//                 image: true,
//                 assignedToTask: {
//                   select: {
//                     taskId: true,
//                   },
//                   where: {
//                     taskId,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!workspace || !workspace.subscribers) {
//       return NextResponse.json([], { status: 200 });
//     }

//     // Filter users to only include those assigned to the specific task
//     const assignedUsers = workspace.subscribers.filter((subscriber) =>
//       subscriber.user.assignedToTask.some(
//         (assignment) => assignment.taskId === taskId
//       )
//     );

//     // If no users are assigned to the task, return an empty array
//     if (assignedUsers.length === 0) {
//       return NextResponse.json([], { status: 200 });
//     }

//     // Return the users assigned to the task
//     return NextResponse.json(assignedUsers, { status: 200 });

//   } catch (err) {
//     return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
//   }
// };

