import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type UserDetails from '../interfaces/UserDetails';

interface AuthContextType {
  user: UserDetails | null;
  setUser: (user: UserDetails | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDetails | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// creating custom hook to avoid checking null in every component
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  //null check for the context
  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider. It means in this case inside html body'
    );
  }

  return context;
};
