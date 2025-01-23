import React, { useState } from "react";
import { toast } from "react-toastify";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { userRegister } from "~/services/apiService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        identifiedNumber: "",
        contact: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // 'success' or 'danger'

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            setAlertType("danger");
            setAlertMessage("Please agree to the privacy policy to sign up.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setAlertType("danger");
            setAlertMessage("Passwords do not match!");
            return;
        }

        // Clear alert messages
        setAlertMessage("");
        setAlertType("");

        // Simulate successful registration
        setAlertType("success");
        setAlertMessage("Registration successful!");
        console.log("Form submitted:", formData);

        // yyyy-mm-dd to dd-mm-yyyy
        const date = formData.dob.split("-");
        formData.dob = `${date[2]}-${date[1]}-${date[0]}`;

        const data = {
            name: formData.name,
            dob: formData.dob,
            cccd: formData.identifiedNumber,
            email: formData.contact,
            password: formData.password,
            phone: formData.phoneNumber,
        };

        try {
            const response = await userRegister(data, "hotelier");

            if (response && response.email === data.email) {
                toast.success("Registration successful!");
                navigate("/hotel-owner/login");
            }
        } catch (error) {
            toast.error("Registration failed!");
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center body">
            <div className="register-container shadow-lg">
                <h1 className="text-center mt-3 mb-3 fs-1">Create account!</h1>

                {/* Alert Section */}
                {alertMessage && (
                    <div className={`alert alert-${alertType} my-3`} role="alert">
                        {alertMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} id="registerForm" className="d-flex flex-column py-3">
                    <input
                        type="text"
                        className="form-control my-2 py-3 fs-4"
                        name="name"
                        placeholder="Full name"
                        pattern="^[A-Za-zÀ-ÖØ-ÿ' -]{2,}( [A-Za-zÀ-ÖØ-ÿ' -]{2,}){1,2}$"
                        title="Name should contain only letters and be at least 2 characters."
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <div className="row g-2">
                        <div className="col-5">
                            <input
                                className="form-control my-2 py-3 fs-4"
                                type="date"
                                name="dob"
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
                                className="form-control my-2 py-3 fs-4"
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
                    <input
                        type="text"
                        className="form-control my-2 py-3 fs-4"
                        name="contact"
                        placeholder="Email"
                        pattern="^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,9}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        required
                        value={formData.contact}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="form-control my-2 py-3 fs-4"
                        name="phoneNumber"
                        placeholder="Phone number"
                        pattern="^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,9}$"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        className="form-control my-2 py-3 fs-4"
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
                        className="form-control my-2 py-3 fs-4"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <div className="form-agreement d-flex justify-content-start align-items-center">
                        <input
                            type="checkbox"
                            className="me-2 mt-1 py-3 fs-4"
                            name="agree"
                            id="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                        />
                        <label htmlFor="agree">
                            I agree with your <a href="#">privacy</a>.
                        </label>
                    </div>
                    <input
                        type="submit"
                        className="mb-4 mt-5 py-3"
                        value="Sign up"
                        id="submitBtn"
                    />
                </form>
                <p className="text-center">
                    Have an account? <Link to="/hotel-owner/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
