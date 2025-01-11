// import { database } from "@/lib/database";
// import { NextResponse } from "next/server";

// interface Params {
//   params: {
//     workspaceId: string; // Ensure this is correctly defined
//   };
// }

// export const GET = async (
//   request: Request,
//   { params: { workspaceId } }: Params // Use workspaceId here
// ) => {
//   const url = new URL(request.url);
//   const userId = url.searchParams.get("userId");

//   if (!userId) {
//     return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });
//   }

//   if (!workspaceId) {
//     return NextResponse.json("ERRORS.INVALID_WORKSPACE_ID", { status: 400 }); // Handle invalid workspace ID
//   }

//   try {
//     // Fetch all tasks associated with the specified workspace
//     const tasks = await database.task.findMany({
//       where: {
//         workspaceId: workspaceId, // Filter tasks by workspace ID
//       },
//       include: {
//         tags: true,
//         taskDate: true,
//         savedTask: true,
//         creator: {
//           select: {
//             id: true,
//             username: true,
//             image: true,
//             name: true,
//             surname: true,
//           },
//         },
//         updatedBy: {
//           select: {
//             id: true,
//             username: true,
//             image: true,
//             name: true,
//             surname: true,
//           },
//         },
//       },
//     });

//     if (tasks.length === 0) {
//       return NextResponse.json("No tasks found from server", { status: 200 });
//     }

//     return NextResponse.json(tasks, { status: 200 });
//   } catch (err) {
//     console.error("Database query error:", err); // Log the error for debugging
//     return NextResponse.json("ERRORS.DB_ERROR", { status: 500 }); // Use status 500 for server errors
//   }
// };



import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const workspaceId = url.searchParams.get("workspaceId"); // Get workspaceId from query params

  console.log("Received userId:", userId); // Log for debugging
  console.log("Received workspaceId:", workspaceId); // Log for debugging

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID is required." }, { status: 401 });
  }

  try {
    // Fetch all tasks associated with the specified workspace
    const tasks = await database.task.findMany({
      where: {
        workspaceId: workspaceId, // Filter tasks by workspace ID
      },
      include: {
        tags: true,
        taskDate: true,
        savedTask: true,
        creator: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
            surname: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
            surname: true,
          },
        },
        project:{
          select:{
            id:true,
            title:true
          }
        }
      },
    });

    if (tasks.length === 0) {
      return NextResponse.json("No tasks found from server", { status: 200 });
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("Database query error:", err);
    return NextResponse.json({ error: "ERRORS.DB_ERROR" }, { status: 500 });
  }
};
