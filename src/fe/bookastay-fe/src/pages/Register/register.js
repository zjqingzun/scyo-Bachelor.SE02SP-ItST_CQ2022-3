import React, { useState } from 'react';
import './register.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        identifiedNumber: '',
        contact: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        agree: false,
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.agree) {
            setAlertMessage('Please agree to the privacy policy to sign up.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordMessage('Passwords do not match!');
            return;
        }

        // Clear alerts
        setPasswordMessage('');
        setAlertMessage('');

        // Submit form data
        console.log('Form submitted:', formData);
    };

    return (
        <div className="p-4 d-flex justify-content-center align-items-center body">
            <div className="login-container my-4 pt-5 pb-2 shadow-lg">
                <h1 className='text-center mt-3 mb-3 fs-1'>Create account!</h1>
                <form onSubmit={handleSubmit} id="registerForm" className='d-flex flex-column py-3'>
                    {/* Full Name */}
                    <input
                        type="text"
                        className='form-control my-2 py-3 fs-4'
                        name="name"
                        placeholder="Full name"
                        pattern="^[A-Za-zÀ-ÖØ-ÿ' -]{2,}( [A-Za-zÀ-ÖØ-ÿ' -]{2,}){1,2}$"
                        title="Name should contain only letters and be at least 2 characters."
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />

                    {/* Date of Birth and ID */}
                    <div className="row g-2">
                        <div className="col-5">
                            <input
                                className='form-control my-2 py-3 fs-4'
                                type="date"
                                name="dob"
                                placeholder="Date of Birth"
                                required
                                min="1900-01-01"
                                max="2024-10-30"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-7">
                            <input
                                type="text"
                                className='form-control my-2 py-3 fs-4'
                                name="identifiedNumber"
                                placeholder="Identified Number"
                                pattern="^\d{9}|\d{12}$"
                                title="Please enter a valid 9 or 12-digit ID number."
                                required
                                value={formData.identifiedNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Contact and Phone */}
                    <input
                        type="text"
                        className='form-control my-2 py-3 fs-4'
                        name="contact"
                        placeholder="Email"
                        pattern="^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,9}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        required
                        value={formData.contact}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className='form-control my-2 py-3 fs-4'
                        name="phoneNumber"
                        placeholder="Phone number"
                        pattern="^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,9}$"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />

                    {/* Password and Confirm Password */}
                    <input
                        type="password"
                        className='form-control my-2 py-3 fs-4'
                        name="password"
                        placeholder="Password"
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$"
                        title="Password must be 8-20 characters long and contain at least one letter and one number."
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        className='form-control my-2 py-3 fs-4'
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {passwordMessage && <span className="error-message">{passwordMessage}</span>}

                    {/* Agreement Checkbox */}
                    <div className="form-agreement d-flex justify-content-start align-items-center mb-4">
                        <input
                            type="checkbox"
                            className='me-2 mt-1 py-3 fs-4'
                            name="agree"d
                            id="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                        />
                        <label htmlFor="agree">
                            I agree with your <a href="#">privacy</a>.
                        </label>
                    </div>
                    {alertMessage && <span className="error-message">{alertMessage}</span>}

                    {/* Submit Button */}
                    <input type="submit" className="my-4 py-3" value="Sign up" id="submitBtn" />
                </form>
                <p className='text-center'>
                    Đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterForm;
