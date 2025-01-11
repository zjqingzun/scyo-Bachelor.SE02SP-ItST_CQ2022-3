import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown as BDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Avatar, Dropdown, Menu } from "antd";
import { DownOutlined, LoginOutlined, SettingOutlined } from "@ant-design/icons";

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

const Header = () => {
    const { t, i18n } = useTranslation();
    const currency = useSelector((state) => state.currency.currency);
    const userInfo = useSelector((state) => state.account.userInfo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [language, setLanguage] = useState("English");

    const [openDrawer, setOpenDrawer] = useState(false);

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

    const handleNavigateLoginHotelOwner = (e) => {
        e.preventDefault();
        navigate("/hotel-owner/login");
    };

    // console.log("currency", currency);
    // console.log("baseCurrency", baseCurrency);

    const handleMenuClick = ({ key }) => {
        switch (key) {
            case "2":
                navigate("/account-setting");
                break;
            case "3":
                console.log("Billing clicked");
                break;
            case "4":
                console.log("Settings clicked");
                break;
            case "5":
                dispatch(doLogout());
                break;
            default:
                break;
        }
    };

    // Menu items
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
                    {t("userMenu.profile")}
                </a>
            ),
            extra: "⌘P",
        },
        {
            key: "3",
            label: (
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/history");
                    }}
                >
                    {t("userMenu.history")}
                </a>
            ),
            extra: "⌘H",
        },
        {
            key: "4",
            label: (
                <a
                    href="#!"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/favorite");
                    }}
                >
                    {t("userMenu.favorites")}
                </a>
            ),
            extra: "⌘F",
        },
        {
            type: "divider",
        },
        {
            key: "5",
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
                    {t("userMenu.signOut")}
                </a>
            ),
            extra: "⌘L",
        },
    ];

    return (
        <>
            <header className="header">
                <Link to="/">
                    <span className="header__name">BookaStay</span>
                </Link>

                <div className="header__actions">
                    <a
                        href="#!"
                        className="header__list-property-btn d-none d-md-block"
                        onClick={(e) => {
                            handleNavigateLoginHotelOwner(e);
                        }}
                    >
                        {t("header.listYourProperty")}
                    </a>

                    <div
                        className="header__currency-group d-none d-md-block"
                        style={{ width: "40px" }}
                    >
                        <BDropdown>
                            <BDropdown.Toggle as={CustomToggleForCurrency}>
                                {currency}
                            </BDropdown.Toggle>

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

                    <div className="header__language-group d-none d-md-block">
                        <BDropdown onSelect={(e) => setLanguage(e)}>
                            <BDropdown.Toggle as={CustomToggleForCurrency}>
                                <img
                                    src={
                                        language === "Vietnam"
                                            ? icons.vietnamIcon
                                            : icons.englishIcon
                                    }
                                    alt=""
                                    className="header__language-icon"
                                ></img>
                            </BDropdown.Toggle>

                            <BDropdown.Menu>
                                <BDropdown.Item
                                    eventKey="Vietnam"
                                    onClick={() => handleChangeLanguage("vi")}
                                >
                                    <span className="fs-3">
                                        {language === "Vietnam" ? "Việt Nam" : "Vietnam"}
                                    </span>
                                </BDropdown.Item>
                                <BDropdown.Item
                                    eventKey="English"
                                    onClick={() => handleChangeLanguage("en")}
                                >
                                    <span className="fs-3">
                                        {language === "English" ? "English" : "Tiếng Anh"}
                                    </span>
                                </BDropdown.Item>
                            </BDropdown.Menu>
                        </BDropdown>
                    </div>

                    {/* <a href="#!" className="header__about d-none d-md-block">
                        <img
                            src={icons.questionIcon}
                            alt=""
                            className="header__about-icon header__icon"
                        />
                    </a> */}

                    {/* <a href="#!" className="header__notify">
                        <img
                            src={icons.bellIcon}
                            alt=""
                            className="header__notify-icon header__icon"
                        />
                    </a> */}

                    <a
                        href="#!"
                        className="header__setting d-bloc d-md-none"
                        onClick={() => setOpenDrawer(true)}
                    >
                        <img
                            src={icons.settingIcon}
                            alt=""
                            className="header__setting-icon header__icon"
                        />
                    </a>

                    {/* <a href="/login" className="header__sign-in-btn">
                        {t("header.signIn")}
                    </a> */}

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
                                navigate("/login");
                            }}
                        >
                            {t("header.signIn")}
                        </a>
                    )}

                    {/* <Dropdown menu={{ items }}>
                        <Avatar
                            style={{ cursor: "pointer" }}
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        >
                            Nam
                        </Avatar>
                    </Dropdown> */}
                </div>
            </header>

            <Drawer
                title="Menu"
                placement={"left"}
                closable={true}
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                key={"left"}
            >
                <Link to="/">
                    <span className="header__name">BookaStay</span>
                </Link>

                <div className="d-flex flex-column gap-3 mt-3">
                    <a
                        href="#!"
                        className="header__list-property-btn"
                        onClick={(e) => handleNavigateLoginHotelOwner(e)}
                    >
                        {t("header.listYourProperty")}
                    </a>

                    <div className="header__currency-group" style={{ width: "100%" }}>
                        <span className="fs-3">
                            {language === "Vietnam" ? "Loại tiền" : "Currency"}:
                        </span>
                        <BDropdown>
                            <BDropdown.Toggle as={CustomToggleForCurrency}>
                                {currency}
                            </BDropdown.Toggle>

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
                        <span className="fs-3">
                            {language === "Vietnam" ? "Ngôn ngữ" : "Language"}:
                        </span>
                        <BDropdown onSelect={(e) => setLanguage(e)}>
                            <BDropdown.Toggle as={CustomToggleForCurrency}>
                                <img
                                    src={
                                        language === "Vietnam"
                                            ? icons.vietnamIcon
                                            : icons.englishIcon
                                    }
                                    alt=""
                                    className="header__language-icon"
                                ></img>
                            </BDropdown.Toggle>

                            <BDropdown.Menu>
                                <BDropdown.Item
                                    eventKey="Vietnam"
                                    onClick={() => handleChangeLanguage("vi")}
                                >
                                    <span className="fs-3">
                                        {language === "Vietnam" ? "Việt Nam" : "Vietnam"}
                                    </span>
                                </BDropdown.Item>
                                <BDropdown.Item
                                    eventKey="English"
                                    onClick={() => handleChangeLanguage("en")}
                                >
                                    <span className="fs-3">
                                        {language === "English" ? "English" : "Tiếng Anh"}
                                    </span>
                                </BDropdown.Item>
                            </BDropdown.Menu>
                        </BDropdown>
                    </div>

                    {/* <a href="#!" className="header__about">
                        <img
                            src={icons.questionIcon}
                            alt=""
                            className="header__about-icon header__icon"
                        />
                    </a> */}

                    {/* <a href="#!" className="header__notify">
                        <img
                            src={icons.bellIcon}
                            alt=""
                            className="header__notify-icon header__icon"
                        />
                    </a> */}
                </div>
            </Drawer>
        </>
    );
};

export default Header;
