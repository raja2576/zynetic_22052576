import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Vite mein named import hi kaam karega
import { useNavigate } from 'react-router-dom';

// Context banaya for authentication
const AuthContext = createContext();

// Provider jo app ke children ko access dega auth info ka
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Token decode karke user ka data nikaalne wala helper
  const extractUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      // Expiry check bhi kar lo
      if (decoded.exp < now) {
        console.warn('Token expired');
        return null;
      }

      return {
        email: decoded.sub,
        role: decoded.role,
      };
    } catch (err) {
      console.error('Token decoding failed:', err);
      return null;
    }
  };

  // App load hone pe check karo kya token already hai (page refresh pe kaam aayega)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const userInfo = extractUserFromToken(savedToken);
      if (userInfo) {
        setCurrentUser(userInfo);
      } else {
        localStorage.removeItem('token'); // invalid ya expired token hata do
      }
    }
  }, []);

  // Login API call backend pe maaro
  const loginToBackend = async (email, password) => {
    try {
      const res = await fetch('https://backend-server-1dgg.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const { token } = await res.json();
      localStorage.setItem('token', token); // ✅ Token save karo

      const userData = extractUserFromToken(token);
      if (!userData) throw new Error('Token invalid ya expired hai');

      setCurrentUser(userData);

      // ✅ Role ke basis pe redirect karo
      if (userData.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  };

  // Logout - sab kuch saaf karo
  const logoutUser = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        login: loginToBackend,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
