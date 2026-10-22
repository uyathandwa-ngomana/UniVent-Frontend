import client from "./client";

export async function getCurrentUser() {
  const response = await client.get("/api/users/me");
  return response.data;
}

export async function updateCurrentUser(profile) {
  const response = await client.patch("/api/users/me", profile);
  return response.data;
}

export async function updateNotificationPreferences(preferences) {
  const response = await client.patch("/api/users/me/preferences", preferences);
  return response.data;
}
