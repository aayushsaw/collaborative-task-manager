"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskService = exports.getAllRelatedTasksService = exports.updateTaskService = exports.getFilteredTasksService = exports.getOverdueTasksService = exports.getCreatedTasksService = exports.getMyTasksService = exports.createTaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const client_1 = __importDefault(require("../prisma/client"));
const socket_1 = require("../socket");
const createTaskService = async (data, creatorId) => {
    const assignee = await client_1.default.user.findUnique({
        where: { id: data.assignedToId },
    });
    if (!assignee) {
        throw new Error("Assigned user does not exist");
    }
    const task = await (0, task_repository_1.createTask)(data, creatorId);
    const io = (0, socket_1.getIO)();
    // persist notification so it remains after refresh
    const notification = await client_1.default.notification.create({
        data: {
            userId: data.assignedToId,
            message: `A new task "${task.title}" has been assigned to you`,
        },
    });
    // emit notification event to the specific user room
    io.to(data.assignedToId).emit("notification:new", notification);
    // 🔄 Notify all users
    io.emit("task_updated", task);
    return task;
};
exports.createTaskService = createTaskService;
const task_repository_2 = require("../repositories/task.repository");
const getMyTasksService = async (userId) => {
    return (0, task_repository_2.getTasksAssignedToUser)(userId);
};
exports.getMyTasksService = getMyTasksService;
const getCreatedTasksService = async (userId) => {
    return (0, task_repository_2.getTasksCreatedByUser)(userId);
};
exports.getCreatedTasksService = getCreatedTasksService;
const getOverdueTasksService = async (userId) => {
    return (0, task_repository_2.getOverdueTasks)(userId);
};
exports.getOverdueTasksService = getOverdueTasksService;
const task_repository_3 = require("../repositories/task.repository");
const getFilteredTasksService = async (userId, query, type) => {
    const { status, priority, sort } = query;
    return (0, task_repository_3.getFilteredTasks)(userId, {
        status,
        priority,
        sort,
        type,
    });
};
exports.getFilteredTasksService = getFilteredTasksService;
const task_repository_4 = require("../repositories/task.repository");
const updateTaskService = async (taskId, data) => {
    const task = await (0, task_repository_4.updateTask)(taskId, data);
    const io = (0, socket_1.getIO)();
    io.emit("task_updated", task);
    if (data.assignedToId) {
        const notification = await client_1.default.notification.create({
            data: {
                userId: data.assignedToId,
                message: `You have been assigned the task "${task.title}"`,
            },
        });
        io.to(data.assignedToId).emit("notification:new", notification);
    }
    return task;
};
exports.updateTaskService = updateTaskService;
const getAllRelatedTasksService = async (userId, query) => {
    const { status, priority, sortByDueDate } = query;
    return (0, task_repository_3.getFilteredTasks)(userId, {
        status,
        priority,
        sort: sortByDueDate === "asc" ? "asc" : "desc",
        type: "all", // We need to update the repo to handle "all" or handle it here
    });
};
exports.getAllRelatedTasksService = getAllRelatedTasksService;
const deleteTaskService = async (taskId) => {
    const io = (0, socket_1.getIO)();
    await client_1.default.task.delete({ where: { id: taskId } });
    io.emit("task:deleted", { id: taskId });
};
exports.deleteTaskService = deleteTaskService;
