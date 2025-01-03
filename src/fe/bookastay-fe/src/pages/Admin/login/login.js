import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Chuyển hướng tới Dashboard
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="card shadow-lg py-5 px-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
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
              className="form-control"
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
    //   <div className='p-5 d-flex justify-content-center align-items-center body'>
    //     <div className='login-container my-5 pb-2 shadow-lg'>
    //       <h1 className='text-center mb-4 fs-1'>Login</h1>
    //       <form onSubmit={handleSubmit} className='d-flex flex-column py-3'>
    //         <div className="mb-3">
    //           <label htmlFor="email" className="form-label">
    //             Email address
    //           </label>
    //           <input
    //             type="email"
    //             className="form-control"
    //             id="email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             placeholder="Enter your email"
    //             required
    //           />
    //         </div>
    //         <div className="mb-3">
    //           <label htmlFor="password" className="form-label">
    //             Password
    //           </label>
    //           <input
    //             type="password"
    //             className="form-control"
    //             id="password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             placeholder="Enter your password"
    //             required
    //           />
    //         </div>
    //         <div className='d-flex justify-content-between align-items-center mb-3'>
    //           <div className='d-flex align-items-center'>
    //             <input type="checkbox" id="rememberMe" name="rememberMe" className='me-2 mt-1' />
    //             <label for="rememberMe">Lưu mật khẩu</label>
    //           </div>
    //           <a id="forgetPassword" href="#">Quên mật khẩu?</a>
    //         </div>
    //         <input type="submit" className="my-4 py-2" value="OK" />

    //       </form>
    //       <p className='text-center'>
    //         Chưa có tài khoản? <a href="/register">Đăng ký</a>
    //       </p>
    //     </div>
    //   </div>
  );
}



export default Login;
