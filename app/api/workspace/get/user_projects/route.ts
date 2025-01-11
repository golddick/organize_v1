// import { database } from "@/lib/database";
// import { NextResponse } from "next/server";

// export const GET = async (request: Request) => {
//   const url = new URL(request.url);

//   const workspaceId = url.searchParams.get("workspace_id");

//   if (!workspaceId) {
//     return NextResponse.json("ERRORS.NO_WORKSPACE_API", { status: 404 });
//   }

//   try {
//     // Query projects that match the given userId and workspaceId
//     const projects = await database.project.findMany({
//       where: {
//         workspaceId: workspaceId,
//       },
//     });

//     // If no projects are found, return an empty array
//     if (!projects || projects.length === 0) {
//       return NextResponse.json([], { status: 200 });
//     }

//     return NextResponse.json(projects, { status: 200 });
//   } catch (error) {
//     console.error("Database Error:", error);
//     return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
//   }
// };


import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    // Parse the URL and extract workspaceId
    const url = new URL(request.url);

    console.log(url)

    const workspaceId = url.searchParams.get("workspaceId");

    console.log('url workspace id',workspaceId)
    // Validate workspaceId
    if (!workspaceId) {
      return NextResponse.json("ERRORS.NO_WORKSPACE_API", { status: 404 });
    }

    // Fetch projects by workspaceId
    const projects = await database.project.findMany({
      where: {
        workspaceId,
      },
      include: {
        workspace: true,
      },
    });

    console.log('projects',  projects)

    // Return an empty array if no projects are found
    if (!projects || projects.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Return the list of projects
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json("ERRORS.DB_ERROR", { status: 500 });
  }
};
