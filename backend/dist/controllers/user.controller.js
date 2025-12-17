"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getAllUsers = async (req, res) => {
    const users = await client_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    res.json(users);
};
exports.getAllUsers = getAllUsers;
