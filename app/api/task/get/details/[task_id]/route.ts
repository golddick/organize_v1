
import { database } from "@/lib/database";
import { NextResponse } from "next/server";

interface Params {
  params: {
    task_id: string;
  };
}

export const GET = async (
  request: Request,
  { params: { task_id } }: Params
) => {
  const url = new URL(request.url);

  const userId = url.searchParams.get("userId");

  if (!userId) return NextResponse.json("ERRORS.NO_USER_API", { status: 404 });

  try {
    const task = await database.task.findUnique({
      where: {
        id: task_id,
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
            title: true
          }
        }
      },
    });

    if (!task) return NextResponse.json("Task not found", { status: 200 });

    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
};
