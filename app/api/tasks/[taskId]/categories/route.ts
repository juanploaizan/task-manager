import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    const category = await db.category.create({
      data: {
        name,
        userId: userId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[TASKID-CATEGORIES-POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
