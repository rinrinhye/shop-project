import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AuthCtx = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token")
  );

  // 토큰을 단일 소스로 관리(상태 → localStorage 동기화)
  useEffect(() => {
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken); // 리렌더 트리거 → useCurrentUser 실행
  };

  const logout = async () => {
    setToken(null); // 리렌더 트리거
    qc.setQueryData(["currentUser"], null);
    qc.removeQueries({ queryKey: ["currentUser"] });
  };

  const value = useMemo(() => ({ token, login, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
