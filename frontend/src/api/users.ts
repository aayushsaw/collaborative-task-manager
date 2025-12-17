import api from "./client";
import type { User } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  return res.data;
};
