import React, { useState } from 'react';

const SignupPage = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });

  const handleInput = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Reusable function: Sign up as user/admin based on role passed
  const processSignup = async (role) => {
    const endpoint =
      role === 'ADMIN'
        ? 'http://localhost:8080/api/auth/admin/signup'
        : 'http://localhost:8080/api/auth/signup';
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState), // Ensure formState has correct fields
      });
  
      if (res.ok) {
        alert(`${role} signup successful! Please login.`);
        window.location.href = '/login'; // Redirect to login page
      } else {
        const errorText = await res.text();
        console.error("Signup failed response:", errorText);
        alert(`${role} signup failed. Try a different email.`);
      }
    } catch (err) {
      console.error(`${role} Signup error:`, err);
      alert('Server error during signup.');
    }
  };
  
  

  const handleSubmit = (e, role) => {
    e.preventDefault();
    processSignup(role);
  };

  return (
    <div className="full-screen-center bg-light">
      <main style={{ maxWidth: '360px', width: '100%' }}>
        <header className="text-center mb-4">
          <h4 className="fw-bold text-success">Create Account</h4>
          <p className="text-muted small">Join the Product Management platform</p>
        </header>

        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label small text-muted">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control form-control-sm"
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleInput}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label small text-muted">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control form-control-sm"
              placeholder="Choose a strong password"
              value={formState.password}
              onChange={handleInput}
              required
            />
          </div>

          {/* Default user sign-up button */}
          <button
            type="submit"
            className="btn btn-sm btn-success w-100 mb-2"
            onClick={(e) => handleSubmit(e, 'USER')}
          >
            Sign Up as User
          </button>

          {/* Admin sign-up button */}
          <button
            type="submit"
            className="btn btn-sm btn-danger w-100"
            onClick={(e) => handleSubmit(e, 'ADMIN')}
          >
            Sign Up as Admin
          </button>
        </form>

        <footer className="text-center mt-3">
          <small className="text-muted">
            Already registered?{' '}
            <a href="/login" className="text-decoration-none text-success">
              Login here
            </a>
          </small>
        </footer>
      </main>
    </div>
  );
};

export default SignupPage;
