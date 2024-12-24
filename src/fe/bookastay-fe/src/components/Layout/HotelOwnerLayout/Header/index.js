import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

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

const Header = ({ toggle = () => {} }) => {
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

    return (
        <div className="header">
            <div className="d-block d-xl-none" onClick={toggle} style={{ cursor: "pointer" }}>
                <GiHamburgerMenu size={30} />
            </div>

            <div className="header__actions">
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

                <a href="#!" className="header__sign-in-btn">
                    {t("header.signIn")}
                </a>
            </div>
        </div>
    );
};

export default Header;
