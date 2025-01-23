import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown as BDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import { LoginOutlined, SettingOutlined } from "@ant-design/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

import icons from "~/assets/icon";
import { setCurrency } from "~/redux/action/currencyAction";

import "./Header.scss";
import { doLogout } from "~/redux/action/accountAction";

const CustomToggleForCurrency = React.forwardRef(({ children, onClick }, ref) => (
    <span
        className="header__currency"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </span>
));

// const CustomToggleForLanguage = React.forwardRef(({ children, onClick }, ref) => (
//     <span
//         ref={ref}
//         onClick={(e) => {
//             e.preventDefault();
//             onClick(e);
//         }}
//     >
//         {children}
//     </span>
// ));

const Header = ({ toggle = () => {} }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currency = useSelector((state) => state.currency.currency);
    const userInfo = useSelector((state) => state.account.userInfo);

    const dispatch = useDispatch();

    const [language, setLanguage] = useState("English");

    useEffect(() => {
        if (localStorage.getItem("i18nextLng")) {
            if (localStorage.getItem("i18nextLng") === "vi") {
                setLanguage("Vietnam");
            } else {
                setLanguage("English");
            }
        }
    }, []);

    const handleChangeLanguage = (lng) => {
        setLanguage(lng === "vi" ? "Vietnam" : "English");

        i18n.changeLanguage(lng);
    };

    const handleChangeCurrency = (currencyValue) => {
        dispatch(setCurrency(currency, currencyValue));
    };

    const items = [
        {
            key: "1",
            label: (userInfo && userInfo.email) || "My Account",
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            key: "2",
            label: (
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/account-setting");
                    }}
                >
                    Profile
                </a>
            ),
            extra: "⌘P",
        },
        // {
        //     key: "3",
        //     label: "Delete Hotel",
        //     extra: "⌘D",
        // },
        {
            type: "divider",
        },
        {
            key: "4",
            icon: <LoginOutlined />,
            label: (
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(doLogout());
                    }}
                    style={{ color: "#f5222d" }}
                >
                    Logout
                </a>
            ),
            extra: "⌘L",
        },
    ];

    return (
        <div className="header">
            <div className="d-block d-xl-none" onClick={toggle} style={{ cursor: "pointer" }}>
                <GiHamburgerMenu size={30} />
            </div>

            <div className="header__actions">
                <div className="header__currency-group" style={{ width: "40px" }}>
                    <BDropdown>
                        <BDropdown.Toggle as={CustomToggleForCurrency}>{currency}</BDropdown.Toggle>

                        <BDropdown.Menu>
                            <BDropdown.Item
                                eventKey="VND"
                                onClick={() => handleChangeCurrency("VND")}
                            >
                                <span className="fs-3">VND ₫</span>
                            </BDropdown.Item>
                            <BDropdown.Item
                                eventKey="USD"
                                onClick={() => handleChangeCurrency("USD")}
                            >
                                <span className="fs-3">USD $</span>
                            </BDropdown.Item>
                        </BDropdown.Menu>
                    </BDropdown>
                    {/* <span className="header__currency-icon"></span> */}
                </div>

                <div className="header__language-group">
                    <BDropdown onSelect={(e) => setLanguage(e)}>
                        <BDropdown.Toggle as={CustomToggleForCurrency}>
                            <img
                                src={language === "Vietnam" ? icons.vietnamIcon : icons.englishIcon}
                                alt=""
                                className="header__language-icon"
                            ></img>
                        </BDropdown.Toggle>

                        <BDropdown.Menu>
                            <BDropdown.Item
                                eventKey="Vietnam"
                                onClick={() => handleChangeLanguage("vi")}
                            >
                                <span className="fs-3">Vietnam</span>
                            </BDropdown.Item>
                            <BDropdown.Item
                                eventKey="English"
                                onClick={() => handleChangeLanguage("en")}
                            >
                                <span className="fs-3">English</span>
                            </BDropdown.Item>
                        </BDropdown.Menu>
                    </BDropdown>
                </div>

                {userInfo && userInfo.email ? (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Avatar
                            style={{ cursor: "pointer" }}
                            src={
                                userInfo.avatar ||
                                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            }
                        >
                            Nam
                        </Avatar>
                    </Dropdown>
                ) : (
                    <a
                        href="#!"
                        className="header__sign-in-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/hotel-owner/login");
                        }}
                    >
                        {t("header.signIn")}
                    </a>
                )}
            </div>
        </div>
    );
};

export default Header;
