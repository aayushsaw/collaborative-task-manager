"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.logout = exports.me = exports.login = exports.register = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const register_dto_1 = require("../dto/register.dto");
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        // 1. Validate input
        const validatedData = register_dto_1.RegisterDto.parse(req.body);
        // 2. Call service
        const user = await (0, auth_service_1.registerUser)(validatedData);
        // 3. Send response
        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Registration failed",
        });
    }
};
exports.register = register;
const login_dto_1 = require("../dto/login.dto");
const auth_service_2 = require("../services/auth.service");
const login = async (req, res) => {
    try {
        // 1. Validate input
        const validatedData = login_dto_1.LoginDto.parse(req.body);
        // 2. Login user
        const { token, user } = await (0, auth_service_2.loginUser)(validatedData);
        // 3. Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: "Login successful",
            user,
        });
    }
    catch (error) {
        return res.status(401).json({
            message: error.message || "Login failed",
        });
    }
};
exports.login = login;
// Don't forget imports if not present, but they are likely there or I can add them.
// Actually Prisma import might be missing in auth.controller.ts?
// Step 219 view of auth.controller.ts shows only RegisterDto, registerUser, LoginDto, loginUser imports.
// Prisma is NOT imported.
// I will rewrite the whole `me` function and add import if needed.
// Since I can't add imports easily without replacing top of file, and replacing top of file is risky with line numbers...
// Wait, `auth.service.ts` likely has `findUserById`?
// Let's check `auth.service.ts` or just add prisma import at top?
// Easier: update `me` to use `prisma`. But I need to Import it.
// I will use `replace_file_content` to add import AND update function.
const me = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.me = me;
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // matches set cookie options
        sameSite: "lax",
    });
    return res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
const update_profile_dto_1 = require("../dto/update-profile.dto");
const auth_service_3 = require("../services/auth.service");
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const validatedData = update_profile_dto_1.UpdateProfileDto.parse(req.body);
        const updatedUser = await (0, auth_service_3.updateProfileService)(userId, validatedData);
        return res.json(updatedUser);
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(400).json({
            message: error.message || "Failed to update profile",
        });
    }
};
exports.updateProfile = updateProfile;
