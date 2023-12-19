import { db } from "@/lib/db";

export async function getAnalytics(userId: string) {
  try {
    const totalTasks = await db.task.count({
      where: {
        userId,
      },
    });
    const completedTasks = await db.task.count({
      where: {
        userId,
        status: "DONE",
      },
    });
    const pendingTasks = await db.task.count({
      where: {
        userId,
        status: {
          in: ["TO_DO", "IN_PROGRESS"],
        },
      },
    });
    const cancelledTasks = await db.task.count({
      where: {
        userId,
        status: "CANCELLED",
      },
    });

    const categoriesWithTasks = await db.category.findMany({
      include: {
        tasks: {
          select: {
            id: true,
          },
        },
      },
    });

    const data = categoriesWithTasks.map((category) => ({
      name: category.name,
      total: category.tasks.length,
    }));

    return {
      data,
      pendingTasks,
      completedTasks,
      cancelledTasks,
      totalTasks,
    };
  } catch (error) {
    console.log("[GET ANALYTICS ERROR]: ", error);
    return {
      data: [],
      pendingTasks: 0,
      completedTasks: 0,
      cancelledTasks: 0,
      totalTasks: 0,
    };
  }
}
