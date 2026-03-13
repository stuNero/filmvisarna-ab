import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  created: number;
  lastVisited: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// creating custom hook to avoid checking null in every component
export const useAuth = () => {
  const context = useContext(AuthContext);
  //null check for the context
  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider. It means in this case inside html body'
    );
  }

  return context;
};
