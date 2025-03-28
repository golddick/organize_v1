import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import {
  mindMapSchema,
  updateMindMapActiveTagsSchema,
} from "@/schema/mindMapSchema";
import { apiTagSchema } from "@/schema/tagSchema";

import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await getAuthSession();
  console.log(session);

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const body: unknown = await request.json();
  const result = updateMindMapActiveTagsSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, tagsIds, mindMapId } = result.data;

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

    const mindMap = await database.mindMap.findUnique({
      where: {
        id: mindMapId,
      },
      include: {
        tags: true,
      },
    });

    if (!mindMap)
      return NextResponse.json("ERRORS.NO_MIND_MAP_FOUND", { status: 404 });

    const updatedMindMap = await database.mindMap.update({
      where: {
        id: mindMap.id,
      },
      data: {
        updatedUserId: session.user.id,
        tags: {
          connect: tagsIds.map((tagId) => ({ id: tagId })),
          disconnect: mindMap.tags.filter(
            (existingTag) => !tagsIds.includes(existingTag.id)
          ),
        },
      },
    });

    return NextResponse.json(updatedMindMap, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
