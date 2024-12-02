import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import icons from "~/assets/icon";
import { setCurrency } from "~/redux/action/currencyAction";

import "./Header.scss";

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

    // console.log("currency", currency);
    // console.log("baseCurrency", baseCurrency);

    return (
        <header className="header">
            <Link to="/">
                <span className="header__name">BookaStay</span>
            </Link>

            <div className="header__actions">
                <a href="#!" className="header__list-property-btn">
                    {t("header.listYourProperty")}
                </a>

                <div className="header__currency-group" style={{ width: "40px" }}>
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggleForCurrency}>{currency}</Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                eventKey="VND"
                                onClick={() => handleChangeCurrency("VND")}
                            >
                                <span className="fs-3">VND ₫</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                eventKey="USD"
                                onClick={() => handleChangeCurrency("USD")}
                            >
                                <span className="fs-3">USD $</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* <span className="header__currency-icon"></span> */}
                </div>

                <div className="header__language-group">
                    <Dropdown onSelect={(e) => setLanguage(e)}>
                        <Dropdown.Toggle as={CustomToggleForCurrency}>
                            <img
                                src={language === "Vietnam" ? icons.vietnamIcon : icons.englishIcon}
                                alt=""
                                className="header__language-icon"
                            ></img>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                eventKey="Vietnam"
                                onClick={() => handleChangeLanguage("vi")}
                            >
                                <span className="fs-3">Vietnam</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                eventKey="English"
                                onClick={() => handleChangeLanguage("en")}
                            >
                                <span className="fs-3">English</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <a href="#!" className="header__about">
                    <img
                        src={icons.questionIcon}
                        alt=""
                        className="header__about-icon header__icon"
                    />
                </a>

                <a href="#!" className="header__notify">
                    <img src={icons.bellIcon} alt="" className="header__notify-icon header__icon" />
                </a>

                <a href="#!" className="header__setting">
                    <img
                        src={icons.settingIcon}
                        alt=""
                        className="header__setting-icon header__icon"
                    />
                </a>

                <a href="#!" className="header__sign-in-btn">
                    {t("header.signIn")}
                </a>
            </div>
        </header>
    );
};

export default Header;
