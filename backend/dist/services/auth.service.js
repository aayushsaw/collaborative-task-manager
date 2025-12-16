"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileService = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repositories/user.repository");
const registerUser = async (data) => {
    const { name, email, password } = data;
    // 1. Check if user exists
    const existingUser = await (0, user_repository_1.findUserByEmail)(email);
    if (existingUser) {
        throw new Error("Email already registered");
    }
    // 2. Hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // 3. Create user
    const user = await (0, user_repository_1.createUser)(name, email, hashedPassword);
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
};
exports.registerUser = registerUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const user_repository_2 = require("../repositories/user.repository");
const JWT_SECRET = process.env.JWT_SECRET;
const loginUser = async (data) => {
    const { email, password } = data;
    // 1. Find user
    const user = await client_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // 2. Compare password
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    // 3. Create JWT
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};
exports.loginUser = loginUser;
const updateProfileService = async (userId, data) => {
    // If email is changing, check uniqueness
    if (data.email) {
        const existing = await (0, user_repository_1.findUserByEmail)(data.email);
        if (existing && existing.id !== userId) {
            throw new Error("Email already in use");
        }
    }
    return (0, user_repository_2.updateUser)(userId, data);
};
exports.updateProfileService = updateProfileService;
