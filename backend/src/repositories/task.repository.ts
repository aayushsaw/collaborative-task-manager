import prisma from "../prisma/client";
import { CreateTaskInput } from "../dto/create-task.dto";

export const createTask = async (
  data: CreateTaskInput,
  creatorId: string
) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      priority: data.priority,
      creatorId,
      assignedToId: data.assignedToId,
    },
  });
};




export const getTasksCreatedByUser = async (userId: string) => {
  return prisma.task.findMany({
    where: { creatorId: userId },
    orderBy: { dueDate: "asc" },
  });
};

export const getTasksAssignedToUser = async (userId: string) => {
  return prisma.task.findMany({
    where: { assignedToId: userId },
    orderBy: { dueDate: "asc" },
  });
};

export const getOverdueTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      assignedToId: userId,
      dueDate: { lt: new Date() },
      status: { not: "COMPLETED" },
    },
    orderBy: { dueDate: "asc" },
  });
};


export const getFilteredTasks = async (
  userId: string,
  filters: {
    status?: any;
    priority?: any;
    sort?: "asc" | "desc";
    type: "assigned" | "created" | "all";
  }
) => {
  const whereClause: any = {};

  if (filters.type === "assigned") {
    whereClause.assignedToId = userId;
  } else if (filters.type === "created") {
    whereClause.creatorId = userId;
  } else if (filters.type === "all") {
    whereClause.OR = [
      { assignedToId: userId },
      { creatorId: userId },
    ];
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.priority) {
    whereClause.priority = filters.priority;
  }

  return prisma.task.findMany({
    where: whereClause,
    orderBy: {
      dueDate: filters.sort || "asc",
    },
  });
};


export const updateTask = async (taskId: string, data: any) => {
  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};
