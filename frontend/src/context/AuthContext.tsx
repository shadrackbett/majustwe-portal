import React, { createContext, useState, useEffect, ReactNode } from 'react';


interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userId: number, role: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || '';
    if (token && role && userId) {
      setUser({ id: Number(userId), username: username, role: role });
    }
    setLoading(false);
  }, []);

  const login = (token: string, userId: number, role: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('username', username);
    setUser({ id: userId, username: username, role: role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
