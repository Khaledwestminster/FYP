import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated } from '../utils/api';

interface User {
  id: number;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { user: User; tokens: { access: string; refresh: string } }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      if (isAuth) {
        // Get user data from localStorage if available
        const userData = localStorage.getItem('userData');
        const storedToken = localStorage.getItem('accessToken');
        if (userData && storedToken) {
          setUser(JSON.parse(userData));
          setToken(storedToken);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (data: { user: User; tokens: { access: string; refresh: string } }) => {
    setUser(data.user);
    setToken(data.tokens.access);
    // Store user data and tokens in localStorage
    localStorage.setItem('userData', JSON.stringify(data.user));
    localStorage.setItem('accessToken', data.tokens.access);
    localStorage.setItem('refreshToken', data.tokens.refresh);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 