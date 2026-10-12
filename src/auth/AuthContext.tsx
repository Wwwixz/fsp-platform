import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, getToken, setToken } from '../api/client';
import type { AuthResponse, PublicUser } from '../api/types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'athlete' | 'organizer';
  region?: string;
}

interface AuthContextValue {
  user: PublicUser | null;
  /** Пока идёт начальная загрузка сессии по токену (при первом рендере). */
  loading: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (data: RegisterData) => Promise<PublicUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Авторизация через бекенд: POST /api/auth/login|register, токен в localStorage,
 * текущий пользователь восстанавливается через GET /api/auth/me.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(getToken() != null);

  useEffect(() => {
    if (!getToken()) return;
    api
      .get<PublicUser>('/auth/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const applyAuth = useCallback((data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(
    (email: string, password: string) =>
      api
        .post<AuthResponse>('/auth/login', { email: email.trim(), password })
        .then(applyAuth),
    [applyAuth],
  );

  const register = useCallback(
    (data: RegisterData) =>
      api
        .post<AuthResponse>('/auth/register', { ...data, email: data.email.trim() })
        .then(applyAuth),
    [applyAuth],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return ctx;
}
