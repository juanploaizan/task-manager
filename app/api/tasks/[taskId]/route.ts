import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
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
        userId: userId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!task) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedTask = await db.task.delete({
      where: {
        id: params.taskId,
      },
    });
    return NextResponse.json(deletedTask);
  } catch (error) {
    console.log("[TASK_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();
    const { taskId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const task = await db.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASK_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
