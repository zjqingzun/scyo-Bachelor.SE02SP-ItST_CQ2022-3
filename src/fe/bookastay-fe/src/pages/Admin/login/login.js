import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard'); // Chuyển hướng tới Dashboard
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center shadow-lg">
      <div className="py-5 px-2" style={{ width: '500px' }}>
        <div className="text-center login-text">LOGIN</div>
        <form onSubmit={handleSubmit}>
          <div className="my-5">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control p-3 fs-4"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control p-3 fs-4 mb-5"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login mb-4">
            OK
          </button>
        </form>
      </div>
    </div>
  );
}



export default Login;
