import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { toast } from '@/hooks/use-toast';
import apiService from '@/services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUser: User = {
  id: '1',
  firstName: 'أحمد',
  lastName: 'محمد',
  email: 'mhammadnoor13@gmail.com',
  speciality: 'Technical',
  role: 'consultant',
  verified: true
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      // TODO: Call API to verify token and get user data
      // For now, we'll decode basic info from token or fetch user profile
      try {
        // API call would go here
        // const userData = await apiService.getUserProfile();
        // setUser(userData);
        
        // Mock user data for development
        const mockUser: User = {
          id: '1',
          firstName: 'أحمد',
          lastName: 'محمد',
          email: 'ahmed@example.com',
          speciality: 'Technical',
          role: 'consultant',
          verified: true
        };
        setUser(mockUser);
      } catch (error) {
        localStorage.removeItem('jwt');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: Call login API
      const response = await apiService.login(credentials);
      localStorage.setItem('jwt', response['accessToken']);

      console.log(response)
      // setUser(response.user);
      
      // Mock login for development
      //localStorage.setItem('jwt', 'mock-jwt-token');
      const mockUser: User = {
        id: '1',
        firstName: 'أحمد',
        lastName: 'محمد',
        email: credentials.email,
        speciality: 'Technical',
        role: 'consultant',
        verified: true
      };
      setUser(mockUser);
      
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في منصة الاستشارات',
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: 'يرجى التحقق من البيانات والمحاولة مرة أخرى',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: Call register API
      const response = await apiService.register(userData);
      localStorage.setItem('jwt', response.token);
      setUser(mockUser);
      
      toast({
        title: 'تم التسجيل بنجاح',
        description: 'يرجى انتظار مراجعة طلبك من قبل الإدارة',
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: 'خطأ في التسجيل',
        description: 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    toast({
      title: 'تم تسجيل الخروج',
      description: 'نراك قريباً',
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};