import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/database";
import { deleteAccountSchema } from "@/schema/deleteAccountSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const { email: userEmail } = session.user;

  const body: unknown = await request.json();
  const result = deleteAccountSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { email: requestEmail } = result.data;

   // Ensure the email from the request matches the logged-in user's email
   if (requestEmail !== userEmail) {
    return new NextResponse("Email Doesn't match users account", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  try {
    const user = await database.user.findFirst({
      where: {
        id: session.user.id,
        email: userEmail
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    await database.user.delete({
      where: {
        id: user.id,
      },
    });

    return NextResponse.json("OK", { status: 200 });
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
