import { createContext } from "react";

export const AuthContext = createContext(null);

export function getHomePathForRole(role) {
  switch (role) {
    case "STUDENT":
      return "/student";
    case "ORGANIZER":
      return "/organizer";
    case "ADMIN":
      return "/admin";
    default:
      return "/login";
  }
}
