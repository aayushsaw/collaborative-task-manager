import { Request, Response } from "express";
import {
  createTaskService,
  getFilteredTasksService,
  updateTaskService,
  getMyTasksService,
  getCreatedTasksService,
  getOverdueTasksService,
  deleteTaskService,
  getAllRelatedTasksService,
} from "../services/task.service";

// -----------------------------
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";

// -----------------------------
// CREATE TASK
// -----------------------------
export const createTask = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateTaskDto.parse(req.body);
    const creatorId = (req as any).user.id;

    // Convert date string to Date object if needed, checking service signature.
    // DTO says dueDate is string in `date-time` format.
    // Service expects `CreateTaskInput` which likely matches DTO structure.
    // Wait, the service call in `task.controller.ts` currently does:
    // `dueDate: new Date(form.dueDate).toISOString()` -> Frontend sends string.
    // DTO `dueDate: z.string().datetime()` -> Validates string.
    // Service `createTaskService` expects `CreateTaskInput` which is `z.infer<typeof CreateTaskDto>`.
    // So `validatedData` is exactly what service needs.
    // BUT the ORIGINAL controller was passing specific fields manually.
    // I will pass `validatedData`.

    const task = await createTaskService(validatedData, creatorId);

    res.status(201).json(task);
  } catch (error: any) {
    console.error("Create Task Error:", error);
    res.status(error.errors ? 400 : 500).json({
      message: error.errors ? error.errors[0].message : (error.message || "Failed to create task")
    });
  }
};

// -----------------------------
// GET TASKS (FILTER + SORT)
// -----------------------------
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    // req.query contains status, priority, sortByDueDate
    // Service expects `query` object

    // We use the new getAllRelatedTasksService which handles "all" type or whatever logic we defined
    // to map the generic "GET /tasks" list view.
    const tasks = await getAllRelatedTasksService(userId, req.query);

    res.json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// -----------------------------
// UPDATE TASK
// -----------------------------
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateTaskDto.parse(req.body);

    const updatedTask = await updateTaskService(id, validatedData);

    res.json(updatedTask);
  } catch (error: any) {
    console.error("Update Task Error:", error);
    res.status(error.errors ? 400 : 500).json({
      message: error.errors ? error.errors[0].message : (error.message || "Failed to update task")
    });
  }
};

// -----------------------------
// DELETE TASK
// -----------------------------
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // We need a delete service
    await deleteTaskService(id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// -----------------------------
// GET MY TASKS (ASSIGNED TO ME)
// -----------------------------
export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await getMyTasksService(userId);
    res.json(tasks);
  } catch (error) {
    console.error("Get My Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch assigned tasks" });
  }
};

// -----------------------------
// GET CREATED TASKS
// -----------------------------
export const getCreatedTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await getCreatedTasksService(userId);
    res.json(tasks);
  } catch (error) {
    console.error("Get Created Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch created tasks" });
  }
};

// -----------------------------
// GET OVERDUE TASKS
// -----------------------------
export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tasks = await getOverdueTasksService(userId);
    res.json(tasks);
  } catch (error) {
    console.error("Get Overdue Tasks Error:", error);
    res.status(500).json({ message: "Failed to fetch overdue tasks" });
  }
};
