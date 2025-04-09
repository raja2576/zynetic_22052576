import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Form fields change hone par data update karo
  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Form submit hone par login function call karo
  const handleLogin = (e) => {
    e.preventDefault();

    // AuthContext ka login function call ho raha hai
    // yeh function token ko localStorage mein save karega
    login(formData.email, formData.password);
  };

  return (
    <div className="full-screen-center bg-light d-flex justify-content-center align-items-center vh-100">
      <main style={{ maxWidth: '360px', width: '100%' }} className="p-4 shadow rounded bg-white">
        <header className="text-center mb-4">
          <h4 className="fw-bold text-primary">Welcome Back</h4>
          <p className="text-muted small">Login to your account</p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label small text-muted">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control form-control-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInput}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label small text-muted">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control form-control-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInput}
              required
            />
          </div>

          <button type="submit" className="btn btn-sm btn-primary w-100">
            Sign In
          </button>
        </form>

        <footer className="text-center mt-3">
          <small className="text-muted">
            New here?{' '}
            <Link to="/signup" className="text-decoration-none text-primary">
              Create an account
            </Link>
          </small>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
