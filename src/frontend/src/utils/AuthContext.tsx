import { createContext, useState, useEffect } from "react";
import type { User, UserAuth } from "@/types/Types";

const AuthContext = createContext<UserAuth | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8787/users/profile", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent with the request
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch user profile:", data.error);
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8787/users/logout", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent with the request
      });
      const data = await res.json();
      if (data.error) {
        throw new Error("json error" + data.error);
      }
      setUser(null);
    } catch (error) {
      throw new Error("Error: " + error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
