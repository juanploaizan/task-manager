import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function TasksPage() {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const tasks = await db.task.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tus tareas</h2>
          <p className="text-muted-foreground">
            Aquí encontrarás todas las tareas que has creado.
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
