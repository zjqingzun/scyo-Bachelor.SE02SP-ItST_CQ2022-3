import "./Header.scss";

import icons from "~/assets/icon";

const Header = () => {
    return (
        <header className="header">
            <span className="header__name">BookaStay</span>

            <div className="header__actions">
                <a href="#!" className="header__list-property-btn">
                    List your property
                </a>

                <div className="header__currency-group">
                    <span className="header__currency">VND</span>
                    {/* <span className="header__currency-icon"></span> */}
                </div>

                <div className="header__language-group">
                    {/* <span className="header__language">EN</span> */}
                    <img src={icons.vietnamIcon} className="header__language-icon"></img>
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
                    Sign in
                </a>
            </div>
        </header>
    );
};

export default Header;
