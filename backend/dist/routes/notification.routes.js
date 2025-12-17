"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, notification_controller_1.getMyNotifications);
router.patch("/:id/read", auth_middleware_1.authMiddleware, notification_controller_1.markAsRead);
exports.default = router;
