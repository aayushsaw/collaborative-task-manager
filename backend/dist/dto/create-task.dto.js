"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskDto = void 0;
const zod_1 = require("zod");
exports.CreateTaskDto = zod_1.z.object({
    title: zod_1.z.string().max(100),
    description: zod_1.z.string(),
    dueDate: zod_1.z.string().datetime(),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    assignedToId: zod_1.z.string().uuid(),
});
