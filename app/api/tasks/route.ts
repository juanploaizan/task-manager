import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const task = await db.task.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASKS-POST-ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
