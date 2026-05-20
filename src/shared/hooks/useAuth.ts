import { useState, useEffect } from 'react';
import type { RegistrationFormData } from '@/api/types';

export const useAuth = () => {
  // Инициализируем состояние сразу при создании компонента
  const [user, setUser] = useState<RegistrationFormData | null>(() => {
    try {
      const savedUserString = localStorage.getItem('userData');
      if (!savedUserString) {
        return null;
      }
      return JSON.parse(savedUserString) as RegistrationFormData;
    } catch (error) {
      console.error(
        'Ошибка при загрузке данных пользователя из localStorage:',
        error,
      );
      localStorage.removeItem('userData'); // Очищаем повреждённые данные
      return null;
    }
  });

  // Эффект только для синхронизации с localStorage при изменении user
  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user]); // Синхронизируем localStorage с состоянием

  const login = (userData: RegistrationFormData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
};
