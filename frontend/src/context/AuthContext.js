// Import necessary tools from React
import { createContext, useState, useContext } from 'react';

// -----------------------------------------------
// CREATE CONTEXT
// This is our global notice board
// Any component can read from it
// -----------------------------------------------
const AuthContext = createContext();

// -----------------------------------------------
// AUTH PROVIDER
// This wraps our entire app
// and provides login info to all pages
// -----------------------------------------------
export const AuthProvider = ({ children }) => {

  // Store user info and token in state
  // Check localStorage first in case user
  // already logged in before
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  // -----------------------------------------------
  // LOGIN FUNCTION
  // Saves user info and token to state
  // and localStorage (so it persists on refresh)
  // -----------------------------------------------
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    // Save to localStorage so user stays
    // logged in even after refreshing the page
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  // -----------------------------------------------
  // LOGOUT FUNCTION
  // Clears user info and token from state
  // and localStorage
  // -----------------------------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Provide user, token, login and logout
  // to all components in our app
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------------------------
// CUSTOM HOOK
// Makes it easy to use AuthContext
// in any component like:
// const { user, token, login, logout } = useAuth();
// -----------------------------------------------
export const useAuth = () => useContext(AuthContext);