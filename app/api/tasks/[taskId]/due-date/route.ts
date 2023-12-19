import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const values = await req.json();
    console.log(values);

    const task = await db.task.findUnique({
      where: {
        id: params.taskId,
        userId,
      },
      include: {
        reminder: true,
      },
    });

    if (!task) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (task.reminder) {
      await db.reminder.delete({
        where: {
          id: task.reminder.id,
        },
      });
    }

    const publishedTask = await db.task.update({
      where: {
        id: params.taskId,
        userId,
      },
      data: {
        dueDate: values.dueDate,
        reminder: {
          create: {
            dueDate: values.dueDate,
          },
        },
      },
    });

    return NextResponse.json(publishedTask);
  } catch (error) {
    console.log("[TASK_ID_DUEDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
        userId,
      },
      include: {
        reminder: true,
      },
    });

    if (!task) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (task.reminder) {
      await db.reminder.delete({
        where: {
          id: task.reminder.id,
        },
      });
    }

    const publishedTask = await db.task.update({
      where: {
        id: params.taskId,
        userId,
      },
      data: {
        dueDate: null,
      },
    });

    return NextResponse.json(publishedTask);
  } catch (error) {
    console.log("[TASK_ID_DUEDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
