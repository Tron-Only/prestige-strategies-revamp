import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '@/services/api';

interface StudentUser {
  id: number;
  email: string;
  name: string;
  profile_picture?: string;
  google_id: string;
}

interface StudentAuthContextType {
  user: StudentUser | null;
  loading: boolean;
  login: (googleCredential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const token = localStorage.getItem('student_token');
    console.log('StudentAuthContext: Checking for token on mount...', token ? 'Token found' : 'No token');
    
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      // Decode JWT to get user info (basic decode, not verification - backend verifies)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('student_token');
        setLoading(false);
        return;
      }
      
      // Restore user from token payload
      // Note: The backend returns user data in the login response, 
      // but we need to restore it from somewhere on page refresh
      // For now, we'll make a fetch call to verify endpoint
      const response = await fetch('/api/auth/verify.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token verification response:', data);
        
        if (data.success && data.user) {
          // Map the user data properly
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || data.user.email,
            profile_picture: data.user.profile_picture || data.user.picture,
            google_id: data.user.google_id || ''
          };
          console.log('Setting user from token:', userData);
          setUser(userData);
        }
      } else {
        console.warn('Token verification failed with status:', response.status);
        // Token invalid, clear it
        localStorage.removeItem('student_token');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('student_token');
      setLoading(false);
    }
  };

  const login = async (googleCredential: string) => {
    try {
      console.log('Attempting login with Google credential...');
      
      // Send Google credential to backend (backend expects 'id_token')
      const response = await api.post('/api/auth/google_login.php', {
        id_token: googleCredential
      });

      console.log('Login response:', response);

      if (response.success && response.token) {
        // Save token to localStorage
        localStorage.setItem('student_token', response.token);
        
        // Set user data
        setUser(response.user);
        console.log('Login successful! User:', response.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('student_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <StudentAuthContext.Provider value={value}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
}
