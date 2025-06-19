import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginCredentials } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar se há token e email salvos no localStorage
    const token = localStorage.getItem('authToken');
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    
    if (token && savedEmail) {
      setIsAuthenticated(true);
      setUser({ 
        email: savedEmail, 
        role: savedRole || 'admin' 
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('authToken', response.token);
      
      // Salvar email e role no localStorage
      const userEmail = response.user?.email || credentials.email;
      const userRole = response.user?.role || 'admin';
      
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userRole', userRole);
      
      setUser({ 
        email: userEmail, 
        role: userRole 
      });
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 