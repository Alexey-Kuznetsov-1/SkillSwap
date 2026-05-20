import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { UserData } from './AuthContext';

const getInitialAuthState = (): {
  isAuthenticated: boolean;
  user: UserData | null;
} => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedUser = localStorage.getItem('userData');

  if (storedAuth === 'true' && storedUser) {
    try {
      return {
        isAuthenticated: true,
        user: JSON.parse(storedUser),
      };
    } catch (error) {
      console.error('Ошибка парсинга данных пользователя:', error);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userData');
    }
  }

  return {
    isAuthenticated: false,
    user: null,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => getInitialAuthState().isAuthenticated,
  );
  const [user, setUser] = useState<UserData | null>(
    () => getInitialAuthState().user,
  );

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
  };

  const login = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const currentAuth = localStorage.getItem('isAuthenticated');
      const currentUser = localStorage.getItem('userData');
      const isCurrentlyAuthenticated = currentAuth === 'true';

      if (isCurrentlyAuthenticated !== isAuthenticated) {
        if (isCurrentlyAuthenticated && currentUser) {
          try {
            setUser(JSON.parse(currentUser));
            setIsAuthenticated(true);
          } catch {
            logout();
          }
        } else {
          logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
