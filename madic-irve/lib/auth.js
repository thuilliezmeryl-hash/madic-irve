"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Comptes démo pré-chargés (simulés en localStorage)
const DEMO_ACCOUNTS = [
  { email: "commercial@madic.com", password: "madic2024", role: "commercial", name: "Équipe Commerciale MADIC", company: "MADIC Group" },
  { email: "demo.client@carrefour.fr", password: "client2024", role: "client", name: "Responsable Site", company: "Carrefour" },
];

const STORAGE_KEY = "madic_auth_users";
const SESSION_KEY = "madic_auth_session";

function getStoredUsers() {
  if (typeof window === "undefined") return DEMO_ACCOUNTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const custom = stored ? JSON.parse(stored) : [];
    return [...DEMO_ACCOUNTS, ...custom];
  } catch {
    return DEMO_ACCOUNTS;
  }
}

function saveUser(user) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const custom = stored ? JSON.parse(stored) : [];
    custom.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch {}
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      return { ok: true };
    }
    return { ok: false, error: "Email ou mot de passe incorrect." };
  };

  const register = (data) => {
    const users = getStoredUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: "Cette adresse email est déjà utilisée." };
    }
    const newUser = { ...data, role: data.role || "client" };
    saveUser(newUser);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
