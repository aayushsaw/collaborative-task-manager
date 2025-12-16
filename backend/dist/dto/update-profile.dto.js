"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = void 0;
const zod_1 = require("zod");
exports.UpdateProfileDto = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
});
