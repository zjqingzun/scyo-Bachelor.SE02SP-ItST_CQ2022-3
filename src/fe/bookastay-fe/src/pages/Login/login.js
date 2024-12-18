import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/'); // Chuyển hướng tới Dashboard
  };

  return (
    <div className='d-flex justify-content-center align-items-center body'>
      <div className='login-container shadow-lg'>
        <h1 className='text-center my-3 fs-1'>Login</h1>
        <form onSubmit={handleSubmit} className='d-flex flex-column py-3'>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control py-3 fs-4 mb-3"
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
              className="form-control py-3 fs-4"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex align-items-center'>
                    <input type="checkbox" id="rememberMe" name="rememberMe" className='me-2 mt-1'/>
                    <label for="rememberMe">Lưu mật khẩu</label>
                </div>
                <a id="forgetPassword" href="#">Quên mật khẩu?</a>
            </div>
          <input type="submit" className="login mb-0 py-2 mt-5" value="OK" />

        </form>
        <p className='text-center mt-5 mb-0'>Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
      </div>
    </div>
  );
}



export default Login;
