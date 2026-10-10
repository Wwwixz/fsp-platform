import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Role, User } from '../types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string, opts?: LoginOptions) => User;
  register: (data: RegisterData) => void;
  logout: () => void;
}

interface LoginOptions {
  role?: Role;
  name?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'fsp-user';

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/* Аутентификация демонстрационная: без бэкенда, любой аккаунт «входит». */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    (email: string, _password: string, opts?: LoginOptions): User => {
      const stored = readStoredUser();
      const next: User =
        stored && stored.email === email
          ? stored
          : {
              name: opts?.name ?? 'Иван Петров',
              email,
              role: opts?.role ?? 'athlete',
            };
      persist(next);
      return next;
    },
    [persist],
  );

  const register = useCallback(
    ({ name, email, role }: RegisterData) => {
      persist({ name, email, role });
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
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
