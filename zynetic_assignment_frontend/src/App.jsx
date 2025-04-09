import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import Dashboard from './pages/Dashboard';
import NavigationBar from './component/NavigationBar';

const RestrictedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/dashboard" />;
  return children;
};


const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {

  useEffect(() => {
    const pingBackend = () => {
      fetch('https://backend-server-1dgg.onrender.com/api/auth/login') 
        .then(res => console.log(' Server pinged to keep alive'))
        .catch(err => console.error('Ping failed:', err));
    };

    const interval = setInterval(pingBackend, 270000); // 4.5 min
    pingBackend(); 

    return () => clearInterval(interval); 
  }, []);
  
  return (

    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar />

          <main className="flex-grow-1 py-4">
            <div className="container">
              <Routes>
                {/* ✅ Prevent access to login/signup if already logged in */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <SignupPage />
                    </PublicRoute>
                  }
                />

                {/* ✅ Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RestrictedRoute>
                      <Dashboard />
                    </RestrictedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <RestrictedRoute>
                      <ProductList />
                    </RestrictedRoute>
                  }
                />
                <Route
                  path="/products/new"
                  element={
                    <RestrictedRoute allowedRole="ADMIN">
                      <ProductForm />
                    </RestrictedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <RestrictedRoute allowedRole="ADMIN">
                      <ProductForm />
                    </RestrictedRoute>
                  }
                />

                {/* Default redirect to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
