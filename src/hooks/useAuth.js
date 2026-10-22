import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider. Check that AuthProvider wraps your app in main.jsx.");
  }

  return context;
}
