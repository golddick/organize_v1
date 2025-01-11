import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { MAX_USER_PROJECTS } from "@/lib/options";
import { apiProjectSchema } from "@/schema/projectSchema";
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

  const result = apiProjectSchema.safeParse(body);

  if (!result) {
    console.log('no result from body')
  }

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { projectName, workspaceID } = result.data;

  try {
    const user = await database.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        createdProject: {
          select: {
            id: true,
            title: true,
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

    if (user.createdProject.length === MAX_USER_PROJECTS) {
      return new NextResponse("ERRORS.TOO_MANY_PROJECTS", { status: 402 });
    }

    const theSameProjectName = user.createdProject.find(
      (project) =>
        project.title.toLowerCase() === projectName
    );

    if (theSameProjectName) {
      return new NextResponse("ERRORS.SAME_NAME_PROJECT", { status: 403 });
    }


    const project = await database.project.create({
      data: {
        creatorId: user.id,
        title: projectName,
        workspaceId: workspaceID
        
      },
    });



    return NextResponse.json(project, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}

