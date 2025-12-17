"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverdueTasks = exports.getCreatedTasks = exports.getMyTasks = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
// -----------------------------
const create_task_dto_1 = require("../dto/create-task.dto");
const update_task_dto_1 = require("../dto/update-task.dto");
// -----------------------------
// CREATE TASK
// -----------------------------
const createTask = async (req, res) => {
    try {
        const validatedData = create_task_dto_1.CreateTaskDto.parse(req.body);
        const creatorId = req.user.id;
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
        const task = await (0, task_service_1.createTaskService)(validatedData, creatorId);
        res.status(201).json(task);
    }
    catch (error) {
        console.error("Create Task Error:", error);
        res.status(error.errors ? 400 : 500).json({
            message: error.errors ? error.errors[0].message : (error.message || "Failed to create task")
        });
    }
};
exports.createTask = createTask;
// -----------------------------
// GET TASKS (FILTER + SORT)
// -----------------------------
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        // req.query contains status, priority, sortByDueDate
        // Service expects `query` object
        // We use the new getAllRelatedTasksService which handles "all" type or whatever logic we defined
        // to map the generic "GET /tasks" list view.
        const tasks = await (0, task_service_1.getAllRelatedTasksService)(userId, req.query);
        res.json(tasks);
    }
    catch (error) {
        console.error("Get Tasks Error:", error);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};
exports.getTasks = getTasks;
// -----------------------------
// UPDATE TASK
// -----------------------------
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = update_task_dto_1.UpdateTaskDto.parse(req.body);
        const updatedTask = await (0, task_service_1.updateTaskService)(id, validatedData);
        res.json(updatedTask);
    }
    catch (error) {
        console.error("Update Task Error:", error);
        res.status(error.errors ? 400 : 500).json({
            message: error.errors ? error.errors[0].message : (error.message || "Failed to update task")
        });
    }
};
exports.updateTask = updateTask;
// -----------------------------
// DELETE TASK
// -----------------------------
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        // We need a delete service
        await (0, task_service_1.deleteTaskService)(id);
        res.status(204).send();
    }
    catch (error) {
        console.error("Delete Task Error:", error);
        res.status(500).json({ message: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
// -----------------------------
// GET MY TASKS (ASSIGNED TO ME)
// -----------------------------
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await (0, task_service_1.getMyTasksService)(userId);
        res.json(tasks);
    }
    catch (error) {
        console.error("Get My Tasks Error:", error);
        res.status(500).json({ message: "Failed to fetch assigned tasks" });
    }
};
exports.getMyTasks = getMyTasks;
// -----------------------------
// GET CREATED TASKS
// -----------------------------
const getCreatedTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await (0, task_service_1.getCreatedTasksService)(userId);
        res.json(tasks);
    }
    catch (error) {
        console.error("Get Created Tasks Error:", error);
        res.status(500).json({ message: "Failed to fetch created tasks" });
    }
};
exports.getCreatedTasks = getCreatedTasks;
// -----------------------------
// GET OVERDUE TASKS
// -----------------------------
const getOverdueTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await (0, task_service_1.getOverdueTasksService)(userId);
        res.json(tasks);
    }
    catch (error) {
        console.error("Get Overdue Tasks Error:", error);
        res.status(500).json({ message: "Failed to fetch overdue tasks" });
    }
};
exports.getOverdueTasks = getOverdueTasks;
