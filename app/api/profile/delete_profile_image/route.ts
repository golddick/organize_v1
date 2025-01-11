import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  try {
    const user = await database.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    const updatedUser = await database.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: null,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
