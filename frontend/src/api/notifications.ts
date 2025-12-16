import api from "./client";
import type { Notification } from "../types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};
