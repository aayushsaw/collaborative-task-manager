"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = void 0;
const zod_1 = require("zod");
exports.UpdateTaskDto = zod_1.z.object({
    status: zod_1.z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
});
