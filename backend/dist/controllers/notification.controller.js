"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMyNotifications = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getMyNotifications = async (req, res) => {
    const userId = req.user.id;
    const notifications = await client_1.default.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
};
exports.getMyNotifications = getMyNotifications;
const markAsRead = async (req, res) => {
    const { id } = req.params;
    await client_1.default.notification.update({
        where: { id },
        data: { isRead: true },
    });
    res.status(204).send();
};
exports.markAsRead = markAsRead;
