/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
"use client";

import Loading from "@/app/loading";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/localStorage";

import { getValidToken } from "@/lib/verifyToken";
import { deleteCookie } from "@/services/authService";
import { getMe } from "@/services/userService";
import { TUser } from "@/types/user.type";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AppContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const storedUser = getFromLocalStorage("user");
      if (storedUser) {
        setUser(storedUser as TUser);
      } else {
        const res = await getMe();
        if (res?.success) {
          setUser(res.data);
          saveToLocalStorage("user", res.data);
        }
      }
    } catch (error: any) {
      console.error("Error refreshing user:", error);
      setUser(null);
      removeFromLocalStorage("user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Listen for storage changes (when user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        refreshUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    setUser(null);
    removeFromLocalStorage("user");
    deleteCookie();
  };

  if (isLoading) return <Loading />;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within ContextProvider");
  return context;
};

export const useUser = () => {
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      // First check if token exists
      const token = await getValidToken();
      if (!token) {
        return null;
      }

      // If user already exists, return it
      if (user) {
        return user;
      }

      // Check localStorage first
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        return parsedUser;
      }

      // Fetch user from API
      const res = await getMe();
      if (res?.success) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      }

      return null;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    fetchUser,
    isLoading,
  };
};
