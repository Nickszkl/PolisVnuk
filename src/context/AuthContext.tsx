import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'pedrinho_auth_user';
const STORAGE_VERSION_KEY = 'pedrinho_auth_version';
const STORAGE_VERSION = '2026-09-02';

function syncAuthStorageVersion() {
  try {
    const current = localStorage.getItem(STORAGE_VERSION_KEY);
    if (current === STORAGE_VERSION) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  } catch {
    // ignore storage access issues in restricted browser contexts
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  syncAuthStorageVersion();

  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): boolean => {
    try {
      const stored = localStorage.getItem('pedrinho_admin_users');
      const users: AdminUser[] = stored ? JSON.parse(stored) : [];
      const found = users.find(u => u.email === email && u.password === password && u.active);
      if (found) {
        setUser(found);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
