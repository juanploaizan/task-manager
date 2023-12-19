import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const task = await db.task.findUnique({
      where: {
        id: params.taskId,
        userId,
      },
    });

    if (!task) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedTask = await db.task.update({
      where: {
        id: params.taskId,
        userId,
      },
      data: {
        isPublic: false,
      },
    });

    return NextResponse.json(unpublishedTask);
  } catch (error) {
    console.log("[TASK_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
