import { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../api/Auth';
import { api } from '../api/api';





const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getUserProfile()
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setAuthLoading(false));
    
    
    } else {
      setAuthLoading(false);
    }
  }, []);
    

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
