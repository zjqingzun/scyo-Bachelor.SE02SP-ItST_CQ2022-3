import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./hotelDetails.css";
import icons from "~/assets/icon";
import SearchBarNoLocation from "~/components/SearchBarNoLocation";
import { getHotelDetail } from "~/services/apiService";
import { convertCurrency, formatCurrency } from "~/utils/currencyUtils";
import { useSelector } from "react-redux";

const HotelDetails = () => {
    const location = useLocation();
    const {
        name,
        address,
        images,
        price,
        rating,
        review,
        star,
        id,
        description,
        isFav,
        checkInDate,
        checkOutDate,
        numOfPeople,
    } = location.state || {};

    const [room1Count, setRoom1Count] = useState(numOfPeople?.roomType2 || 1);
    const [room2Count, setRoom2Count] = useState(numOfPeople?.roomType4 || 1);
    const [roomPrice1, setRoomPrice1] = useState(0);
    const [roomPrice2, setRoomPrice2] = useState(0);

    const handleIncrease = useCallback((setRoomCount) => {
        setRoomCount((prev) => prev + 1);
    }, []);

    const handleDecrease = useCallback((setRoomCount) => {
        setRoomCount((prev) => (prev > 1 ? prev - 1 : 0));
    }, []);

    const totalRooms = useMemo(() => room1Count + room2Count, [room1Count, room2Count]);
    const totalPrice = useMemo(
        () => room1Count * roomPrice1 + room2Count * roomPrice2,
        [room1Count, room2Count, roomPrice1, roomPrice2]
    );

    const [isActive, setIsActive] = useState(false);

    const handleHeartClick = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    const [showAll, setShowAll] = useState(false);

    const visibleImages = useMemo(() => (showAll ? images : images.slice(0, 4)), [showAll, images]);

    const [hotelDetail, setHotelDetail] = useState({});

    const fetchHotelDetail = useCallback(async () => {
        const response = await getHotelDetail(id, {
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            roomType2: room1Count,
            roomType4: room2Count,
        });

        console.log(">>> Hotel detail: ", response.data);

        setRoomPrice1(response.data.room_types[0].price);
        setRoomPrice1Now(response.data.room_types[0].price);

        setRoomPrice2(response.data.room_types[1].price);
        setRoomPrice2Now(response.data.room_types[1].price);

        setHotelDetail(response.data);
    }, [id, checkInDate, checkOutDate, room1Count, room2Count]);

    useEffect(() => {
        fetchHotelDetail();
    }, [fetchHotelDetail]);

    const currency = useSelector((state) => state.currency.currency);
    const exchangeRate = useSelector((state) => state.currency.exchangeRate);
    const [roomPrice1Now, setRoomPrice1Now] = useState(roomPrice1);
    const [roomPrice2Now, setRoomPrice2Now] = useState(roomPrice2);
    const newCurrency = useRef("VND");

    const handleChangeCurrency = useCallback(() => {
        if (currency !== newCurrency.current) {
            if (currency === "VND") {
                setRoomPrice1Now(roomPrice1);
                setRoomPrice2Now(roomPrice2);
            } else {
                setRoomPrice1Now(
                    convertCurrency(roomPrice1Now, newCurrency.current, currency, exchangeRate)
                );
                setRoomPrice2Now(
                    convertCurrency(roomPrice2Now, newCurrency.current, currency, exchangeRate)
                );
            }

            newCurrency.current = currency;
        }
    }, [currency, exchangeRate, roomPrice1, roomPrice1Now, roomPrice2, roomPrice2Now]);

    useEffect(() => {
        handleChangeCurrency();
    }, [currency, handleChangeCurrency]);

    return (
        <div className="mx-auto p-5">
            <div className="row px-5 py-2">
                <div className="col-md-8 pe-5">
                    <h1 className="mt-5">{name}</h1>
                </div>
                <div className="col-md-8 pb-3 d-flex">
                    <img src={icons.locationIcon} alt="Location" className="location-icon me-3" />
                    <p className="pt-3">{address}</p>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                    <i
                        id="heartIcon"
                        className={`heart-icon ${isActive ? "fa-solid" : "fa-regular"} fa-heart`}
                        onClick={handleHeartClick}
                        style={{
                            color: isActive ? "red" : "black",
                            fontSize: isActive ? "24px" : "20px",
                            cursor: "pointer",
                        }}
                    ></i>
                    <i className="fa-solid fa-share-nodes ps-3"></i>
                </div>
            </div>
            <div className="row px-5 py-3 mb-5">
                <div className="col-md-8 pe-5">
                    <div className="image-gallery">
                        <div className="image-grid">
                            {visibleImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Hotel image ${index + 1}`}
                                    className={index === 0 ? "large-image" : "small-image"}
                                />
                            ))}
                        </div>
                        {images.length > 5 && !showAll && (
                            <button onClick={() => setShowAll(true)} className="see-more-btn">
                                See more
                            </button>
                        )}
                        {showAll && (
                            <button onClick={() => setShowAll(false)} className="see-less-btn">
                                See less
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-md-4 ps-5">
                    <h2>Rating overall:</h2>
                    <div className="star-rating py-2">
                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                        <img
                            src={icons.starHalfYellowIcon}
                            alt="Star"
                            className="star-half-yellow-icon"
                        />
                    </div>
                    <p className="fs-3"> {description} </p>

                    <button className="btn btn-primary fs-3 py-2 px-5 mt-5">Reserve</button>
                </div>
            </div>

            <div className="px-5 py-4">
                <div className="mx-5 search">
                    <SearchBarNoLocation
                        border-radius={12}
                        searchData={{
                            startDate: checkInDate,
                            endDate: checkOutDate,
                            numOfPeople: numOfPeople,
                        }}
                    />
                </div>

                <div className="px-2 my-5 pb-5">
                    <div className="card shadow p-3">
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Room type</th>
                                        <th>Number of guest</th>
                                        <th>Today's price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hotelDetail?.room_types?.map((room, index) => (
                                        <tr key={index}>
                                            <td>
                                                <strong>
                                                    {+room.type === 2 ? "Double Room" : "Quad Room"}
                                                </strong>
                                            </td>
                                            <td>
                                                <span className="fs-4">
                                                    {+room.type === 2 ? "👤👤" : "👤👤👤👤"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <span>
                                                            {formatCurrency(
                                                                +room.type === 2
                                                                    ? roomPrice1Now
                                                                    : roomPrice2Now,
                                                                currency
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-center ms-3">
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() =>
                                                                handleDecrease(
                                                                    +room.type === 2
                                                                        ? setRoom1Count
                                                                        : setRoom2Count
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={
                                                                +room.type === 2
                                                                    ? room1Count
                                                                    : room2Count
                                                            }
                                                            readOnly
                                                            className="form-control mx-2 text-center"
                                                            style={{ width: "50px" }}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() =>
                                                                handleIncrease(
                                                                    +room.type === 2
                                                                        ? setRoom1Count
                                                                        : setRoom2Count
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-2">
                                                    ={" "}
                                                    {formatCurrency(
                                                        +room.type === 2
                                                            ? roomPrice1Now * room1Count
                                                            : roomPrice2Now * room2Count,
                                                        currency
                                                    )}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Summary Section */}
                            <div className="text-end">
                                <h5>
                                    {totalRooms} rooms for VND {totalPrice.toLocaleString()}
                                </h5>
                                <p>Includes taxes and charges</p>
                                <button className="btn btn-primary fs-3 py-2 px-5 mt-2">
                                    Reserve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-2 my-5 pb-5">
                    <div className="review-container d-flex flex-column align-items-center mx-auto">
                        <div className="rating-header d-flex align-items-center mb-5 mt-3">
                            <div className="score fw-bold">4.4</div>
                            <div>
                                <div className="review-text">Very good</div>
                                <div className="review-count">132 reviews</div>
                            </div>
                        </div>

                        <div className="review-slider d-flex align-items-center mb-5 pb-5">
                            <div className="arrow">
                                <img
                                    src={icons.chevronLeftIcon}
                                    alt="Arrow"
                                    className="arrow-left-icon"
                                />
                            </div>

                            <div className="review-card-container">
                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starHalfYellowIcon}
                                            alt="Star"
                                            className="star-half-yellow-icon"
                                        />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>

                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starHalfYellowIcon}
                                            alt="Star"
                                            className="star-half-yellow-icon"
                                        />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>

                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starHalfYellowIcon}
                                            alt="Star"
                                            className="star-half-yellow-icon"
                                        />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>

                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-icon"
                                        />
                                        <img
                                            src={icons.starYellowIcon}
                                            alt="Star"
                                            className="star-half-yellow-icon"
                                        />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>
                            </div>

                            <div className="arrow">
                                <img
                                    src={icons.chevronRightIcon}
                                    alt="Arrow"
                                    className="arrow-right-icon"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-2 my-5 pb-5">
                    <div className="row g-0 align-items-center">
                        <div className="col-md-4 text-bg-light text-center">
                            <div className="fs-1 h-100">Q&A</div>
                        </div>

                        <div className="col-md-8 accordion accordion-flush">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseOne"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseOne"
                                    >
                                        Accordion Item #1
                                    </button>
                                </h2>
                                <div
                                    id="flush-collapseOne"
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        Placeholder content for this accordion, which is intended to
                                        demonstrate the <code>.accordion-flush</code> className.
                                        This is the first item's accordion body.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseTwo"
                                    >
                                        Accordion Item #2
                                    </button>
                                </h2>
                                <div
                                    id="flush-collapseTwo"
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        Placeholder content for this accordion, which is intended to
                                        demonstrate the <code>.accordion-flush</code> className.
                                        This is the second item's accordion body. Let's imagine this
                                        being filled with some actual content.
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseThree"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseThree"
                                    >
                                        Accordion Item #3
                                    </button>
                                </h2>
                                <div
                                    id="flush-collapseThree"
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#accordionFlushExample"
                                >
                                    <div className="accordion-body">
                                        Placeholder content for this accordion, which is intended to
                                        demonstrate the <code>.accordion-flush</code> className.
                                        This is the third item's accordion body. Nothing more
                                        exciting happening here in terms of content, but just
                                        filling up the space to make it look, at least at first
                                        glance, a bit more representative of how this would look in
                                        a real-world application.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
