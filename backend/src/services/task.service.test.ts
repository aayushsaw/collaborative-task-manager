import {
    createTaskService,
    updateTaskService,
    // getFilteredTasksService,
} from "./task.service";
import prisma from "../prisma/client";
import { getIO } from "../socket";

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
        (getIO as jest.Mock).mockReturnValue({
            emit: mockEmit,
            to: mockTo,
        });
    });

    describe("createTaskService", () => {
        it("should create a task and emit socket event", async () => {
            // Setup
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "user2" });
            (prisma.task.create as jest.Mock).mockResolvedValue({
                id: "task1",
                title: "Test Task",
                assignedToId: "user2",
                creatorId: "user1",
            });
            (prisma.notification.create as jest.Mock).mockResolvedValue({});

            const input = {
                title: "Test Task",
                description: "Desc",
                priority: "HIGH",
                dueDate: "2025-01-01",
                assignedToId: "user2",
            } as any;

            // Execute
            const result = await createTaskService(input, "user1");

            // Verify
            expect(prisma.task.create).toHaveBeenCalled();
            expect(mockEmit).toHaveBeenCalledWith("task_updated", expect.anything());
            expect(mockTo).toHaveBeenCalledWith("user2"); // Targeted notification
            expect(result).toHaveProperty("id", "task1");
        });

        it("should throw error if assignee does not exist", async () => {
            // Setup
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const input = { assignedToId: "nonexistent" } as any;

            // Execute & Verify
            await expect(createTaskService(input, "user1")).rejects.toThrow(
                "Assigned user does not exist"
            );
        });
    });

    describe("updateTaskService", () => {
        it("should update task status and emit event", async () => {
            // Setup
            (prisma.task.update as jest.Mock).mockResolvedValue({
                id: "task1",
                status: "IN_PROGRESS",
                title: "Test Task",
            });

            // Execute
            const result = await updateTaskService("task1", { status: "IN_PROGRESS" });

            // Verify
            expect(prisma.task.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: "task1" } }),
                expect.anything()
            );
            expect(mockEmit).toHaveBeenCalledWith("task_updated", expect.anything());
            expect(result.status).toBe("IN_PROGRESS");
        });
    });
});
