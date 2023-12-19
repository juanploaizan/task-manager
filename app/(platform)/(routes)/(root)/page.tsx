import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { getAnalytics } from "@/actions/get-analytics";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { data, pendingTasks, completedTasks, cancelledTasks, totalTasks } =
    await getAnalytics(userId);

  return (
    <div className="p-6 h-full flex-1 flex-col space-y-4 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">¡Hola de nuevo!</h2>
          <p className="text-muted-foreground">
            Aquí encontrarás un resumen de tus tareas.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Tareas pendientes" value={pendingTasks} />
        <DataCard label="Tareas completadas" value={completedTasks} />
        <DataCard label="Tareas canceladas" value={cancelledTasks} />
        <DataCard label="Tareas totales" value={totalTasks} />
      </div>
      <Chart data={data} />
    </div>
  );
}
