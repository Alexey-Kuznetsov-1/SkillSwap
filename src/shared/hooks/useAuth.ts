import { useState, useEffect } from 'react';
import type { RegistrationFormData } from '@/api/types';

export const useAuth = () => {
  const [user, setUser] = useState<RegistrationFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUserString = localStorage.getItem('userData');
        if (savedUserString) {
          setUser(JSON.parse(savedUserString));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = (userData: RegistrationFormData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout, isLoading };
};
