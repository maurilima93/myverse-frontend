import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as ApiUser, authService, LoginData as ApiLoginData, RegisterData } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  username: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: ApiLoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Verificar se utilizador está logado ao carregar a aplicação
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('myverse_token');
      const savedUser = localStorage.getItem('myverse_user');

      if (token && savedUser) {
        try {
          // Verificar se o token ainda é válido
          const { user: currentUser } = await authService.getCurrentUser();
          setUser(currentUser);
          
          // Atualizar dados salvos localmente
          localStorage.setItem('myverse_user', JSON.stringify(currentUser));
        } catch (error) {
          // Token inválido, limpar dados
          localStorage.removeItem('myverse_token');
          localStorage.removeItem('myverse_user');
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: ApiLoginData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://web-production-a6602.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Armazene o token e dados do usuário
      localStorage.setItem('myverse_token', data.access_token);
      localStorage.setItem('myverse_user', JSON.stringify(data.user));

      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      // Salvar token e dados do utilizador
      localStorage.setItem('myverse_token', response.access_token);
      localStorage.setItem('myverse_user', JSON.stringify(response.user));
      
      setUser(response.user);
      toast.success('Conta criada com sucesso!');
      
      navigate("/onboarding");
      
    } catch (error: any) {
      console.error('Erro no registo:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar dados locais
    localStorage.removeItem('myverse_token');
    localStorage.removeItem('myverse_user');
    localStorage.removeItem('myverse_preferences');
    
    setUser(null);
    toast.success('Logout realizado com sucesso!');
    
    // Redirecionar para página inicial
    navigate("/");
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await authService.updateProfile(data);
      
      // Atualizar estado e localStorage
      setUser(response.user);
      localStorage.setItem('myverse_user', JSON.stringify(response.user));
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const { user: currentUser } = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('myverse_user', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Erro ao atualizar dados do utilizador:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Hook para proteger rotas
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Salvar página atual para redirecionar após login
      localStorage.setItem("myverse_redirect", window.location.pathname);
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return { isAuthenticated, isLoading };
};

export default AuthContext;