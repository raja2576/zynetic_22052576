import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const performLogout = () => {
    // 🧹 Token clear karo
    localStorage.removeItem('token');
    logout(); // 🧠 Context ko bhi reset karo
    navigate('/login'); // 🔁 Redirect to login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand fw-bold fs-4" to="/dashboard">
        ProductMgmt
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {user && (
            <>
              <li className="nav-item">
                {/* <Link className="nav-link" to="/products">
                  All Products
                </Link> */}
              </li>
              {user.role === 'ADMIN' && (
                <li className="nav-item">
                  
                    {/* Admin You have Access To My Server  */}
                  
                </li>
              )}
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item d-flex align-items-center">
                <span className="navbar-text text-light me-3">
                  Welcome, <strong>{user.name || user.email}</strong>
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={performLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
