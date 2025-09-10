import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'customer' | 'hotel_owner';
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: 'customer' | 'hotel_owner';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const isMounted = useRef(true);
  const isVerifyingToken = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    let isCancelled = false;
    
    // Prevent multiple initialization calls
    if (initialized) return;

    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken && !isCancelled && !isVerifyingToken.current) {
          setToken(storedToken);
          // Verify token and get user data
          try {
            await getCurrentUserInternal(storedToken);
          } catch (error) {
            // Token invalid, clear auth state
            console.log('Token verification failed, clearing auth state');
            if (!isCancelled) {
              localStorage.removeItem('authToken');
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Always set loading to false regardless of success/failure
        if (!isCancelled) {
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      isCancelled = true;
    };
  }, [initialized]);

  const getCurrentUserInternal = async (authToken: string) => {
    // Prevent multiple concurrent calls
    if (isVerifyingToken.current) {
      console.log('Token verification already in progress, skipping...');
      return;
    }

    isVerifyingToken.current = true;
    
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get current user');
      }

      const data = await response.json();
      if (data.success && isMounted.current) {
        setUser(data.user);
      } else if (!isMounted.current) {
        return; // Component unmounted, don't update state
      } else {
        throw new Error(data.message || 'Failed to get user data');
      }
    } finally {
      isVerifyingToken.current = false;
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
  // Do NOT auto-login after signup; require explicit login
  // Keep any returned token unused on purpose
  return { success: true, message: data.message || 'Account created. Please sign in.' };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  const getCurrentUser = async () => {
    if (token && !fetchingUser) {
      setFetchingUser(true);
      try {
        await getCurrentUserInternal(token);
      } catch (error) {
        console.error('Get current user error:', error);
        logout();
      } finally {
        setFetchingUser(false);
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    signup,
    logout,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
