import { createContext } from 'react';

export interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
