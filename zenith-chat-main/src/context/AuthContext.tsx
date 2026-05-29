import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  role?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Configure axios globally at module load time — must be before any API call
const backendUrl = typeof window !== 'undefined'
  ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')
  : 'http://localhost:5000';
axios.defaults.baseURL = `${backendUrl}/api`;
axios.defaults.withCredentials = true;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post('/auth/login', { username, password });
      setUser(res.data);
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      const res = await axios.post('/auth/signup', userData);
      setUser(res.data);
      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Signup failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
