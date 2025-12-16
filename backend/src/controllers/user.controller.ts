import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  res.json(users);
};
