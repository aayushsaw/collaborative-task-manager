"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = require("./task.service");
const client_1 = __importDefault(require("../prisma/client"));
const socket_1 = require("../socket");
// Mock Prisma and Socket
jest.mock("../prisma/client", () => ({
    user: {
        findUnique: jest.fn(),
    },
    task: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
    },
    notification: {
        create: jest.fn(),
    },
}));
jest.mock("../socket", () => ({
    getIO: jest.fn(),
}));
describe("Task Service", () => {
    const mockEmit = jest.fn();
    const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    beforeEach(() => {
        jest.clearAllMocks();
        socket_1.getIO.mockReturnValue({
            emit: mockEmit,
            to: mockTo,
        });
    });
    describe("createTaskService", () => {
        it("should create a task and emit socket event", async () => {
            // Setup
            client_1.default.user.findUnique.mockResolvedValue({ id: "user2" });
            client_1.default.task.create.mockResolvedValue({
                id: "task1",
                title: "Test Task",
                assignedToId: "user2",
                creatorId: "user1",
            });
            client_1.default.notification.create.mockResolvedValue({});
            const input = {
                title: "Test Task",
                description: "Desc",
                priority: "HIGH",
                dueDate: "2025-01-01",
                assignedToId: "user2",
            };
            // Execute
            const result = await (0, task_service_1.createTaskService)(input, "user1");
            // Verify
            expect(client_1.default.task.create).toHaveBeenCalled();
            expect(mockEmit).toHaveBeenCalledWith("task_updated", expect.anything());
            expect(mockTo).toHaveBeenCalledWith("user2"); // Targeted notification
            expect(result).toHaveProperty("id", "task1");
        });
        it("should throw error if assignee does not exist", async () => {
            // Setup
            client_1.default.user.findUnique.mockResolvedValue(null);
            const input = { assignedToId: "nonexistent" };
            // Execute & Verify
            await expect((0, task_service_1.createTaskService)(input, "user1")).rejects.toThrow("Assigned user does not exist");
        });
    });
    describe("updateTaskService", () => {
        it("should update task status and emit event", async () => {
            // Setup
            client_1.default.task.update.mockResolvedValue({
                id: "task1",
                status: "IN_PROGRESS",
                title: "Test Task",
            });
            // Execute
            const result = await (0, task_service_1.updateTaskService)("task1", { status: "IN_PROGRESS" });
            // Verify
            expect(client_1.default.task.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "task1" } }), expect.anything());
            expect(mockEmit).toHaveBeenCalledWith("task_updated", expect.anything());
            expect(result.status).toBe("IN_PROGRESS");
        });
    });
});
