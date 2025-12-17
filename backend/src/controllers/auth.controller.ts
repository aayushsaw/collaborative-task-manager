import { Request, Response } from "express";
import prisma from "../prisma/client";
import { RegisterDto } from "../dto/register.dto";
import { registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const validatedData = RegisterDto.parse(req.body);

    // 2. Call service
    const user = await registerUser(validatedData);

    // 3. Send response
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

import { LoginDto } from "../dto/login.dto";
import { loginUser } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const validatedData = LoginDto.parse(req.body);

    // 2. Login user
    const { token, user } = await loginUser(validatedData);

    // 3. Set HttpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // true in production
      sameSite: isProduction ? "none" : "lax", // 'none' required for cross-site
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};


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

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.json({ message: "Logged out successfully" });
};

import { UpdateProfileDto } from "../dto/update-profile.dto";
import { updateProfileService } from "../services/auth.service";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = UpdateProfileDto.parse(req.body);

    const updatedUser = await updateProfileService(userId, validatedData);

    return res.json(updatedUser);
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return res.status(400).json({
      message: error.message || "Failed to update profile",
    });
  }
};
