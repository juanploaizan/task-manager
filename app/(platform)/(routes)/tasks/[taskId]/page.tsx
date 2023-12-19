import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { AlarmClock, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { CategoryForm } from "./_components/category-form";
import { AttachmentForm } from "./_components/attachment-form";
import { StatusForm } from "./_components/status-form";
import { DueDateForm } from "./_components/due-form";
import { ReminderForm } from "./_components/reminder-form";
import { Reminder } from "@prisma/client";

export default async function TaskIdPage({
  params,
}: {
  params: { taskId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const task = await db.task.findUnique({
    where: {
      id: params.taskId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      reminder: true,
    },
  });

  const categories = await db.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!task) {
    return redirect("/");
  }

  const requiredField = [task.dueDate];
  const completedField = requiredField.every(Boolean);

  return (
    <>
      {/* banner */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Información de la tarea</h1>
            <span className="text-sm text-slate-700">
              Visualiza y edita la información de tu tarea.
            </span>
          </div>
          <Actions taskId={params.taskId} isPublished={task.isPublic} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Detalla tu tarea</h2>
            </div>
            <TitleForm initialData={task} taskId={task.id} />
            <DescriptionForm initialData={task} taskId={task.id} />
            <StatusForm initialData={task} taskId={task.id} />
            <CategoryForm
              initialData={task}
              taskId={task.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={AlarmClock} />
                <h2 className="text-xl">Recordatorios</h2>
              </div>
              <DueDateForm initialData={task} taskId={task.id} />
              {completedField && (
                <ReminderForm
                  initialData={task.reminder as Reminder}
                  taskId={task.id}
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Archivos y recursos</h2>
              </div>
              <AttachmentForm initialData={task} taskId={task.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
