import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { saveToken, getToken, logout as removeToken } from "@/lib/auth";
import { loginApi, registerApi, logoutApi } from "@/lib/api/auth";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      setState({ isAuthenticated: token !== null, isLoading: false });
    }
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await loginApi(email, password);
    await saveToken(token);
    setState({ isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    await registerApi(email, password);
    const { token } = await loginApi(email, password);
    await saveToken(token);
    setState({ isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await logoutApi().catch(() => {});
    await removeToken();
    setState({ isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
