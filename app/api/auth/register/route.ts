
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signUpFormSchema } from "@/schema/signUpShema";
import { database } from "@/lib/database";


export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signUpFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("Missing fields, Wrong Data", { status: 203 });
  }

  const { email, password, username } = result.data;

  try {
    const existedUsername = await database.user.findUnique({
      where: {
        username,
      },
    });

    if (existedUsername)
      return NextResponse.json("Username is already taken", { status: 202 });

    const existedUser = await database.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser)
      return NextResponse.json("Email is already taken", { status: 201 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await database.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });



    return NextResponse.json(newUser, { status: 200 });
  } catch (err) {
    return NextResponse.json("Something went wrong", { status: 204 });
  }
}