import React, { useState } from "react";
import './account.css';
import getFontSizes from "antd/es/theme/themes/shared/genFontSizes";

const AccountSetting = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [personalDetails, setPersonalDetails] = useState({
        name: "Tran Thao Ngan",
        email: "ndjncscjdj@gmail.com",
        phone: "0192837465",
        dob: "01/01/2000",
        identify: "123456789412",
        password: "**********",
    });

    // Hàm mở modal
    const openModal = (field, value) => {
        setCurrentField(field);
        setCurrentValue(value);
        setModalOpen(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setModalOpen(false);
        setCurrentField("");
        setCurrentValue("");
    };

    // Hàm lưu thay đổi
    const handleSave = () => {
        if (currentField) {
            setPersonalDetails((prevDetails) => ({
                ...prevDetails,
                [currentField]: currentValue,
            }));
        }
        closeModal();
    };

    return (
        <div className="m-5 py-5">
            <h1 className="mb-5 mx-5">Account Setting</h1>

            {/* Personal Details */}
            <section className="p-5 mx-5 shadow" style={{ marginTop: "40px" }}>
                <h2>Personal details</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{personalDetails.name}</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("name", personalDetails.name)}>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Email address</td>
                            <td>{personalDetails.email}</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("email", personalDetails.email)}>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Phone number</td>
                            <td>{personalDetails.phone}</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("phone", personalDetails.phone)}>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Identify number</td>
                            <td>{personalDetails.identify}</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("dob", personalDetails.identify)}>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Date of birth</td>
                            <td>{personalDetails.dob}</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("dob", personalDetails.dob)}>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Security Settings */}
            <section className="p-5 mx-5 shadow" style={{ marginTop: "60px", marginBottom: "50px" }}>
                <h2>Security settings</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        <tr>
                            <td>Sign-in email</td>
                            <td>{personalDetails.email}</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("phone", personalDetails.email)}>Change</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td>********</td>
                            <td style={{ textAlign: "right" }}>
                                <button onClick={() => openModal("password", personalDetails.password)}>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Delete account</td>
                            <td>Permanently delete your account</td>
                            <td style={{ textAlign: "right" }}>
                                <button style={{ color: "red" }}>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <h2 className="mb-4">Edit {currentField}</h2>
                        <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
                        />
                        <button className="btn btn-primary fs-4 py-2 px-4" onClick={handleSave} style={modalStyles.buttonSave}>Save</button>
                        <button className="btn btn-danger fs-4 py-2 px-4" onClick={closeModal} style={modalStyles.buttonCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        padding: "30px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    buttonSave: {
        cursor: "pointer",
        marginRight: "15px",
        borderRadius: "4px",
    },
    buttonCancel: {
        cursor: "pointer",
        borderRadius: "4px",
    },
};

export default AccountSetting;
