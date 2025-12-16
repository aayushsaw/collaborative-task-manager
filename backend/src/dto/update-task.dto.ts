import { z } from "zod";

export const UpdateTaskDto = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedToId: z.string().uuid().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
