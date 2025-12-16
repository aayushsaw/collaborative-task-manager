import bcrypt from "bcrypt";
import { RegisterInput } from "../dto/register.dto";
import { findUserByEmail, createUser } from "../repositories/user.repository";


export const registerUser = async (data: RegisterInput) => {
  const { name, email, password } = data;

  // 1. Check if user exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user
  const user = await createUser(name, email, hashedPassword);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};


import jwt from "jsonwebtoken";
import { LoginInput } from "../dto/login.dto";
import { UpdateProfileInput } from "../dto/update-profile.dto";
import prisma from "../prisma/client";
import { updateUser } from "../repositories/user.repository";

const JWT_SECRET = process.env.JWT_SECRET!;

export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 3. Create JWT
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileInput
) => {
  // If email is changing, check uniqueness
  if (data.email) {
    const existing = await findUserByEmail(data.email);
    if (existing && existing.id !== userId) {
      throw new Error("Email already in use");
    }
  }

  return updateUser(userId, data);
};
