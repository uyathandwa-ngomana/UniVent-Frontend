import client from "./client";

export async function getNotifications() {
  const response = await client.get("/api/notifications");
  return response.data;
}

export async function getUnreadCount() {
  const response = await client.get("/api/notifications/unread-count");
  return response.data;
}

export async function markAllNotificationsRead() {
  await client.patch("/api/notifications/read-all");
}

export async function markNotificationRead(notificationId) {
  const response = await client.patch(`/api/notifications/${notificationId}/read`);
  return response.data;
}

export async function dismissNotification(notificationId) {
  await client.delete(`/api/notifications/${notificationId}`);
}
