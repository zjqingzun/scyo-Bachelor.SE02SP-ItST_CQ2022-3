import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { DateRange } from "react-date-range";
import { memo, useEffect, useRef, useState } from "react";
import { vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import "./SearchBar.scss";
import searchIcon from "./search-icon.svg";
import calendarIcon from "./calender-icon.svg";
import people from "./people-icon.svg";
import caret from "./caret-icon.svg";
import { useNavigate } from "react-router-dom";

const SearchBar = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

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
        return `${day}/${month}/${year}`;
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
                adult: 2,
                children: 0,
                rooms: 1,
            }
        );
    });

    const handleClickSearchBtn = () => {
        if (window.location.pathname === "/") {
            navigate("/after-search", {
                state: {
                    destination,
                    startDate,
                    endDate,
                    numOfPeople,
                },
            });
        } else {
            props.handleSearch({
                destination,
                startDate,
                endDate,
                numOfPeople,
            });
        }
    };

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
                        placeholder="Ho Chi Minh City, Vietnam"
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
                        months={2}
                        moveRangeOnFirstSelection={false}
                        direction="horizontal"
                        locale={vi}
                        dateDisplayFormat="dd/MM/yyyy"
                        ranges={state}
                    />
                </div>
                <div
                    className="search-bar__input-group search-bar__input-group-people"
                    onClick={() => handleTurnPopup()}
                >
                    <img className="search-bar__input-icon" src={people} alt="" />
                    <div className="search-bar__input">
                        <span>
                            {numOfPeople.adult} {t("searchBar.adults")}
                        </span>
                        <div className="search-bar__input-separate"></div>
                        <span>
                            {numOfPeople.children} {t("searchBar.children")}
                        </span>
                        <div className="search-bar__input-separate"></div>
                        <span>
                            {numOfPeople.rooms} {t("searchBar.rooms")}
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
                            <label htmlFor="adult">Adults</label>
                            <div className="number-select">
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            adult: prev.adult > 1 ? prev.adult - 1 : 1,
                                        }))
                                    }
                                >
                                    <svg
                                        style={{
                                            fill: numOfPeople.adult === 1 ? "#ccc" : "",
                                        }}
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                    </svg>
                                </button>
                                <span>{numOfPeople.adult}</span>
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            adult: Number(prev.adult) + 1,
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
                            <label htmlFor="children">Children</label>
                            <div className="number-select">
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            children: prev.children > 0 ? prev.children - 1 : 0,
                                        }))
                                    }
                                >
                                    <svg
                                        style={{
                                            fill: numOfPeople.children === 0 ? "#ccc" : "",
                                        }}
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                    </svg>
                                </button>
                                <span>{numOfPeople.children}</span>
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            children: Number(prev.children) + 1,
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
                            <label htmlFor="room">Rooms</label>
                            <div className="number-select">
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            rooms: prev.rooms > 1 ? prev.rooms - 1 : 1,
                                        }))
                                    }
                                >
                                    <svg
                                        style={{
                                            fill: numOfPeople.rooms === 1 ? "#ccc" : "",
                                        }}
                                        className="number-select__btn-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                    </svg>
                                </button>
                                <span>{numOfPeople.rooms}</span>
                                <button
                                    className="number-select__btn"
                                    onClick={() =>
                                        setNumOfPeople((prev) => ({
                                            ...prev,
                                            rooms: Number(prev.rooms) + 1,
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
