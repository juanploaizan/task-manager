import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Repeat } from "@prisma/client";
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

    console.log("taskId", params.taskId);
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
    console.log("task", task);

    const values = await req.json();

    console.log("values", values);
    console.log("task.reminderId", task.reminderId);

    // Funcion para actualizar el record de reminder
    const updatedReminder = await db.reminder.update({
      where: {
        id: task.reminderId!, // el id del recordatorio asociado a la tarea
      },
      data: {
        repeat: values.repeat as Repeat, // el valor que quieres modificar
        daysBefore: Number.parseInt(values.daysBefore), // los valores que quieres modificar
      }, // los valores que quieres modificar
    });

    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error("TASKID-REMINDER-PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
