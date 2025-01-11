import { NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
  }

  try {
    const user = await database.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
