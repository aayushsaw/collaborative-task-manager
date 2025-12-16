import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getMyTasks,
  getCreatedTasks,
  getOverdueTasks,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// 🔹 Specific routes FIRST
router.get("/assigned", authMiddleware, getMyTasks);
router.get("/created", authMiddleware, getCreatedTasks);
router.get("/overdue", authMiddleware, getOverdueTasks);

// 🔹 Main CRUD routes
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;


