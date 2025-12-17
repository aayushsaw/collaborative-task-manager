"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.getFilteredTasks = exports.getOverdueTasks = exports.getTasksAssignedToUser = exports.getTasksCreatedByUser = exports.createTask = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const createTask = async (data, creatorId) => {
    return client_1.default.task.create({
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
exports.createTask = createTask;
const getTasksCreatedByUser = async (userId) => {
    return client_1.default.task.findMany({
        where: { creatorId: userId },
        orderBy: { dueDate: "asc" },
    });
};
exports.getTasksCreatedByUser = getTasksCreatedByUser;
const getTasksAssignedToUser = async (userId) => {
    return client_1.default.task.findMany({
        where: { assignedToId: userId },
        orderBy: { dueDate: "asc" },
    });
};
exports.getTasksAssignedToUser = getTasksAssignedToUser;
const getOverdueTasks = async (userId) => {
    return client_1.default.task.findMany({
        where: {
            assignedToId: userId,
            dueDate: { lt: new Date() },
            status: { not: "COMPLETED" },
        },
        orderBy: { dueDate: "asc" },
    });
};
exports.getOverdueTasks = getOverdueTasks;
const getFilteredTasks = async (userId, filters) => {
    const whereClause = {};
    if (filters.type === "assigned") {
        whereClause.assignedToId = userId;
    }
    else if (filters.type === "created") {
        whereClause.creatorId = userId;
    }
    else if (filters.type === "all") {
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
    return client_1.default.task.findMany({
        where: whereClause,
        orderBy: {
            dueDate: filters.sort || "asc",
        },
    });
};
exports.getFilteredTasks = getFilteredTasks;
const updateTask = async (taskId, data) => {
    return client_1.default.task.update({
        where: { id: taskId },
        data,
    });
};
exports.updateTask = updateTask;
