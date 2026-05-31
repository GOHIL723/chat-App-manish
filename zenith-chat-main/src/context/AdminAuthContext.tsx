import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '@/lib/api';

interface AdminUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  isAdminAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);

  // Verify session on mount
  const verifyAdminSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setAdminUser(null);
        setAdminLoading(false);
        return;
      }
      const res = await axios.get('/admin-auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminUser(res.data);
    } catch {
      setAdminUser(null);
      localStorage.removeItem('admin_token');
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAdminSession();
  }, [verifyAdminSession]);

  const adminLogin = async (email: string, password: string) => {
    const res = await axios.post('/admin-auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('admin_token', token);
    setAdminUser(user);
  };

  const adminLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('/admin-auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem('admin_token');
      setAdminUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      adminLoading,
      adminLogin,
      adminLogout,
      isAdminAuthenticated: !!adminUser && adminUser.role === 'admin',
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
