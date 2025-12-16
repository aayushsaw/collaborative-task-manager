import { useEffect, useState } from "react";
import api from "../api/client";
import { AuthContext, type User } from "./auth-context";
import socket from "../socket";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // join socket room when user changes (logged in)
  useEffect(() => {
    if (user && user.id) {
      socket.emit("join", user.id);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
