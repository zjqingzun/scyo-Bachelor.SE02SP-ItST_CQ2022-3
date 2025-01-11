import React, { useEffect, useRef, useState } from "react";
import "./account.css";
import getFontSizes from "antd/es/theme/themes/shared/genFontSizes";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Flex, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import locale from "antd/es/date-picker/locale/vi_VN";

import { formatDate } from "~/utils/datetime";
import { updateAvatar, updateProfile } from "~/services/apiService";
import dayjs from "dayjs";
import { doGetAccount } from "~/redux/action/accountAction";
import { useTranslation } from "react-i18next";

const AccountSetting = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.account.userInfo);

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [personalDetails, setPersonalDetails] = useState({
        avatar:
            userInfo?.avatar || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        name: userInfo?.name || "Tran Thao Ngan",
        email: userInfo?.email || "ndjncscjdj@gmail.com",
        phone: userInfo?.phone || "0192837465",
        dob: userInfo?.dob || "01/01/2000",
        identify: userInfo?.cccd || "123456789412",
        password: "**********",
    });

    const fileRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Hàm mở modal
    const openModal = (field, value) => {
        setCurrentField(field);
        setCurrentValue(value);

        if (field !== "dob") {
            setModalOpen(true);
        }
    };

    // Hàm đóng modal
    const closeModal = () => {
        setModalOpen(false);
        setCurrentField("");
        setCurrentValue("");
    };

    // Hàm lưu thay đổi
    const handleSave = async () => {
        if (currentField) {
            const oldDetails = { ...personalDetails };

            setPersonalDetails((prevDetails) => ({
                ...prevDetails,
                [currentField]: currentValue,
            }));
            // Gọi API cập nhật thông tin
            let data = {
                ...personalDetails,
                [currentField]: currentValue,
            };
            data.id = userInfo.id;
            data.cccd = data.identify;
            data.dob = formatDate(data.dob);

            delete data.password;
            delete data.identify;
            delete data.avatar;

            const res = await updateProfile(data);

            if (+res.status !== 201) {
                setPersonalDetails(oldDetails);
            } else {
                dispatch(doGetAccount());
            }
        }
        closeModal();
    };

    const handleChangeAvatar = (e) => {
        fileRef.current.click();

        fileRef.current.onchange = async (e) => {
            const file = e.target.files[0];

            setIsLoaded(true);
            const res = await updateAvatar(userInfo.email, file);

            dispatch(doGetAccount());
        };
    };

    const handleChangeDate = (date, dateString) => {
        setCurrentField("dob");
        setCurrentValue(date);
    };

    useEffect(() => {
        if (currentField === "dob") {
            handleSave();
        }
    }, [currentField, currentValue]);

    // render when userInfo is updated
    useEffect(() => {
        setPersonalDetails({
            avatar: userInfo?.avatar || "",
            name: userInfo?.name || "",
            email: userInfo?.email || "",
            phone: userInfo?.phone || "",
            dob: userInfo?.dob || "",
            identify: userInfo?.cccd || "",
            password: "**********",
        });

        setIsLoaded(false);
    }, [userInfo]);

    return (
        <>
            <div className="m-5 py-5">
                <div className="row">
                    <h1 className="mb-2 mt-3">{t("profile.accountSetting")}</h1>
                    <div className="col-9" style={{ marginTop: "40px", marginBottom: "40px" }}>
                        {/* Personal Details */}
                        <section className="p-5 shadow me-5">
                            <h2>{t("profile.personalDetails")}</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{t("profile.name")}</td>
                                        <td>{personalDetails.name}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() =>
                                                    openModal("name", personalDetails.name)
                                                }
                                            >
                                                {t("profile.edit")}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("profile.emailAddress")}</td>
                                        <td>{personalDetails.email}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        t("profile.emailAddress"),
                                                        personalDetails.email
                                                    )
                                                }
                                            >
                                                {t("profile.edit")}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("profile.phoneNumber")}</td>
                                        <td>{personalDetails.phone}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        t("profile.phoneNumber"),
                                                        personalDetails.phone
                                                    )
                                                }
                                            >
                                                {t("profile.edit")}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("profile.identityNumber")}</td>
                                        <td>{personalDetails.identify}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        t("profile.identityNumber"),
                                                        personalDetails.identify
                                                    )
                                                }
                                            >
                                                {t("profile.edit")}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("profile.dateOfBirth")}</td>
                                        <td>
                                            <Space
                                                direction="vertical"
                                                size={12}
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <DatePicker
                                                    value={dayjs(personalDetails.dob)}
                                                    locale={locale}
                                                    onChange={handleChangeDate}
                                                    size="large"
                                                    needConfirm
                                                    allowClear={false}
                                                />
                                            </Space>
                                        </td>
                                        {/* <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() => openModal("dob", personalDetails.dob)}
                                            >
                                                Edit
                                            </button>
                                        </td> */}
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                    <div className="col-3 d-flex flex-column justify-content-center align-items-center">
                        <div
                            className="avatar-frame"
                            style={{
                                width: "200px",
                                height: "200px",
                                borderRadius: "50%",
                            }}
                        >
                            <img
                                src={
                                    personalDetails.avatar ||
                                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                }
                                alt="Avatar"
                                className="img-fluid shadow"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>
                        <button className="mt-2" onClick={(e) => handleChangeAvatar(e)}>
                            {t("profile.change")}
                        </button>
                        <input ref={fileRef} type="file" className="d-none" />
                    </div>
                </div>

                {/* <button
                    className="btn btn-danger my-5 fs-2"
                    style={{ padding: "8px 20px", borderRadius: "10px" }}
                    onClick={() => handleDeleteAccount()}
                >
                    Delete account permanently
                </button> */}

                {/* Modal */}
                {isModalOpen && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            <h2 className="mb-4">
                                {t("profile.edit")} {currentField}
                            </h2>
                            {currentField !== "dob" ? (
                                <input
                                    type="text"
                                    value={currentValue}
                                    onChange={(e) => setCurrentValue(e.target.value)}
                                    style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
                                />
                            ) : (
                                <Space
                                    direction="vertical"
                                    size={12}
                                    style={{ marginBottom: "10px" }}
                                >
                                    <DatePicker
                                        locale={locale}
                                        onChange={handleChangeDate}
                                        needConfirm
                                    />
                                </Space>
                            )}
                            <button
                                className="btn btn-primary fs-4 py-2 px-4"
                                onClick={handleSave}
                                style={modalStyles.buttonSave}
                            >
                                {t("profile.save")}
                            </button>
                            <button
                                className="btn btn-danger fs-4 py-2 px-4"
                                onClick={closeModal}
                                style={modalStyles.buttonCancel}
                            >
                                {t("profile.cancel")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {isLoaded && (
                <Flex
                    gap="middle"
                    vertical
                    align="center"
                    justify="center"
                    style={{
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        zIndex: 9999,
                    }}
                >
                    <Flex gap="middle">
                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{
                                        fontSize: 50,
                                        fontWeight: "bold",
                                    }}
                                    spin
                                />
                            }
                            size="large"
                        ></Spin>
                    </Flex>
                </Flex>
            )}
        </>
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
