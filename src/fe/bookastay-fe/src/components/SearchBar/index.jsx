import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRange } from "react-date-range";
import { memo, useEffect, useState } from "react";
import { vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import "./SearchBar.scss";
import searchIcon from "./search-icon.svg";
import calendarIcon from "./calender-icon.svg";
import people from "./people-icon.svg";
import caret from "./caret-icon.svg";
import useWindowSize from "~/hooks/useWindowSize";
import { addDays } from "date-fns";

const SearchBar = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // const { width } = useWindowSize();

    const [destination, setDestination] = useState(props?.searchData?.destination || "");

    const [state, setState] = useState([
        {
            startDate: new Date() || new Date(props?.searchData?.startDate),
            endDate: null || new Date(props?.searchData?.endDate),
            key: "selection",
        },
    ]);

    const [startDate, setStartDate] = useState(props?.searchData?.startDate || "");
    const [endDate, setEndDate] = useState(props?.searchData?.endDate || "");

    const handleDateChange = (item) => {
        setState([item.selection]);

        const startDate = item.selection.startDate;
        const endDate = item.selection.endDate;

        setStartDate(formatDate(startDate));
        setEndDate(formatDate(endDate));
    };
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const [show, setShow] = useState("hide");
    const [isShowPopup, setIsShowPopup] = useState("hide");

    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest(".search-bar__date-wrap")) {
                setShow((prev) => (prev = "hide"));
            }

            if (!e.target.closest(".search-bar__input-group-people")) {
                setIsShowPopup((prev) => (prev = "hide"));
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const handleTurnCalender = () => {
        const isShow = show === "hide" ? "show" : "hide";
        setShow(isShow);
    };

    const handleTurnPopup = () => {
        const isShow = isShowPopup === "hide" ? "show" : "hide";
        setIsShowPopup(isShow);
    };

    const [numOfPeople, setNumOfPeople] = useState(() => {
        return (
            props?.searchData?.numOfPeople || {
                roomType2: 0,
                children: 0,
                roomType4: 0,
            }
        );
    });

    const handleClickSearchBtn = () => {
        if (window.location.pathname === "/") {
            navigate("/after-search", {
                state: {
                    destination,
                    startDate: startDate || formatDate(new Date()),
                    endDate: endDate || formatDate(addDays(new Date(), 2)),
                    numOfPeople,
                },
            });
        } else {
            props.handleSearch({
                destination,
                startDate: startDate || formatDate(new Date()),
                endDate: endDate || formatDate(addDays(new Date(), 2)),
                numOfPeople,
            });
        }
    };

    // const months = width > 800 ? 2 : 1;

    return (
        <div className="test">
            <div
                className="search-bar"
                style={{
                    borderRadius: props["border-radius"] || 0,
                }}
            >
                <div className="search-bar__input-group search-bar__input-group-search">
                    <img className="search-bar__input-icon " src={searchIcon} alt="" />
                    <input
                        className="search-bar__input"
                        type="text"
                        placeholder="Ho Chi Minh"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
                <div className="search-bar__date-wrap">
                    <div
                        onClick={() => handleTurnCalender()}
                        className="search-bar__input-group search-bar__input-group-date"
                    >
                        <img className="search-bar__input-icon" src={calendarIcon} alt="" />
                        <input
                            className="search-bar__input"
                            type="text"
                            placeholder="Check-in"
                            value={startDate}
                            readOnly
                        />
                    </div>
                    <div
                        onClick={() => handleTurnCalender()}
                        className="search-bar__input-group search-bar__input-group-date"
                    >
                        <img className="search-bar__input-icon" src={calendarIcon} alt="" />
                        <input
                            className="search-bar__input"
                            type="text"
                            placeholder="Check-out"
                            value={endDate}
                            readOnly
                        />
                    </div>

                    <DateRange
                        className={`search-bar__calendar ${show}`}
                        editableDateInputs={true}
                        minDate={new Date()}
                        onChange={(item) => handleDateChange(item)}
                        months={1}
                        moveRangeOnFirstSelection={false}
                        direction="horizontal"
                        locale={vi}
                        dateDisplayFormat="dd/MM/yyyy"
                        ranges={state}
                    />
                </div>
                <div
                    className="search-bar__input-group search-bar__input-group-people" style={{ cursor: "pointer"}}
                    onClick={() => handleTurnPopup()}
                >
                    <div className="search-bar__input">
                        <span>
                            {numOfPeople.roomType2} {t("searchBar.adults")}
                        </span>
                        {/* <div className="search-bar__input-separate"></div>
                        <span>
                            {numOfPeople.children} {t("searchBar.children")}
                        </span> */}
                        <div className="search-bar__input-separate"></div>
                        <span>
                            {numOfPeople.roomType4} {t("searchBar.rooms")}
                        </span>
                    </div>
                    <img
                        className="search-bar__input-icon search-bar__input-icon-caret"
                        src={caret}
                        alt=""
                    />

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`search-bar__people-popup ${isShowPopup}`}
                    >
                        <div className="search-bar__people-popup-item">
                            <label htmlFor="adult">{t("searchBar.double")}</label>
                            <div className="number-select">
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            roomType2: prev.roomType2 > 1 ? prev.roomType2 - 1 : 1,
                                        }))
                                    }
                                >
                                    <svg
                                        style={{
                                            fill: numOfPeople.roomType2 === 1 ? "#ccc" : "",
                                        }}
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                    </svg>
                                </button>
                                <span>{numOfPeople.roomType2}</span>
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            roomType2: Number(prev.roomType2) + 1,
                                        }))
                                    }
                                >
                                    <svg
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="search-bar__people-popup-item">
                            <label htmlFor="room">{t("searchBar.quadruple")}</label>
                            <div className="number-select">
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            roomType4: prev.roomType4 > 1 ? prev.roomType4 - 1 : 1,
                                        }))
                                    }
                                >
                                    <svg
                                        style={{
                                            fill: numOfPeople.roomType4 === 1 ? "#ccc" : "",
                                        }}
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                    </svg>
                                </button>
                                <span>{numOfPeople.roomType4}</span>
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            roomType4: Number(prev.roomType4) + 1,
                                        }))
                                    }
                                >
                                    <svg
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={() => handleClickSearchBtn()} className="search-bar__btn ms-auto">
                    {t("searchBar.search")}
                </button>
            </div>
        </div>
    );
};

export default memo(SearchBar);
