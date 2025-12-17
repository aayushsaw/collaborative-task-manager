"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.findUserByEmail = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const findUserByEmail = async (email) => {
    return client_1.default.user.findUnique({
        where: { email },
    });
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (name, email, password) => {
    return client_1.default.user.create({
        data: {
            name,
            email,
            password,
        },
    });
};
exports.createUser = createUser;
const updateUser = async (userId, data) => {
    return client_1.default.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
};
exports.updateUser = updateUser;
