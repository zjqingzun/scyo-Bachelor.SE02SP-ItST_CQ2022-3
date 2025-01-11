import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useMemo, useCallback } from "react";
import "./hotelDetails.css";
import icons from "~/assets/icon";
import SearchBarNoLocation from "~/components/SearchBarNoLocation";
import { addFavorite, getHotelDetail, removeFavorite, startBooking } from "~/services/apiService";
import { convertCurrency, formatCurrency } from "~/utils/currencyUtils";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import geocodeAddress from "~/utils/geocodeAddress";
import { Modal } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import staticImages from "~/assets/image";

import axios from "~/utils/axiosCustomize";

const HotelDetails = () => {
    const { t } = useTranslation();

    const { id, isFav } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { checkInDate, checkOutDate, numOfPeople } = location.state || {};
    const [isFavorite, setIsFavorite] = useState(isFav);
    console.log("check in: ", checkInDate);
    console.log("isFavorite: ", isFav);
    const mapPositionRef = useRef([10.5279716, 107.3921728]);
    const [showMapModal, setShowMapModal] = useState(true);

    const currency = useSelector((state) => state.currency.currency);
    const exchangeRate = useSelector((state) => state.currency.exchangeRate);
    const userInfo = useSelector((state) => state.account.userInfo);

    const newCurrency = useRef("VND");

    const [roomPrice1, setRoomPrice1] = useState(0);
    const [roomPrice2, setRoomPrice2] = useState(0);
    const [roomPrice1Now, setRoomPrice1Now] = useState(0);
    const [roomPrice2Now, setRoomPrice2Now] = useState(0);

    const [maxRoom2, setMaxRoom2] = useState(0);
    const [maxRoom4, setMaxRoom4] = useState(0);

    const convertPrice = useCallback(
        (price, fromCurrency, toCurrency) => {
            if (toCurrency === "VND") return price;
            return convertCurrency(price, fromCurrency, toCurrency, exchangeRate);
        },
        [exchangeRate]
    );

    useEffect(() => {
        if (currency !== newCurrency.current) {
            if (currency === "VND") {
                setRoomPrice1Now(roomPrice1);
                setRoomPrice2Now(roomPrice2);
            } else {
                setRoomPrice1Now(convertPrice(roomPrice1, "VND", currency));
                setRoomPrice2Now(convertPrice(roomPrice2, "VND", currency));
            }
            newCurrency.current = currency;
        }
    }, [currency, roomPrice1, roomPrice2, convertPrice]);

    const handleSearch = useCallback(async (data) => {
        const { startDate, endDate, numOfPeople } = data;

        try {
            const response = await getHotelDetail(id, {
                checkInDate: startDate,
                checkOutDate: endDate,
                roomType2: numOfPeople.roomType2 || 1,
                roomType4: numOfPeople.roomType4 || 1,
            });

            console.log(">>> Hotel detail: ", response.data);

            // roomPrice1.current = response.data.room_types[0].price;
            setRoomPrice1(response.data.room_types[0].price);
            if (checkWeekend(startDate) || checkWeekend(endDate)) {
                setRoomPrice1Now(response.data.room_types[0].weekend_price);
            } else {
                setRoomPrice1Now(response.data.room_types[0].price);
            }

            // roomPrice2.current = response.data.room_types[1].price;
            setRoomPrice2(response.data.room_types[1].price);
            if (checkWeekend(startDate) || checkWeekend(endDate)) {
                setRoomPrice2Now(response.data.room_types[1].weekend_price);
            } else {
                setRoomPrice2Now(response.data.room_types[1].price);
            }

            setRoomCounts({
                [response.data.room_types[0].id]: numOfPeople.roomType2 || 1,
                [response.data.room_types[1].id]: numOfPeople.roomType4 || 1,
            });

            setHotelDetails(response.data);
        } catch (error) {
            console.error(">>> Error: ", error);

            toast.error("Error while searching hotel detail");
        }
    }, []);

    const [hotelDetails, setHotelDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);

    const [roomCounts, setRoomCounts] = useState({});
    const [isWeekend, setIsWeekend] = useState(false);

    // Hàm kiểm tra ngày cuối tuần
    const checkWeekend = (date) => {
        const day = new Date(date).getDay();
        return day === 6 || day === 0; // Thứ 7 hoặc Chủ nhật
    };

    const toggleImageView = () => {
        setShowAllImages((prev) => !prev);
    };

    // Hàm thay đổi số lượng phòng
    const handleRoomCountChange = (id, increment, maxRooms) => {
        setRoomCounts((prevCounts) => {
            const currentCount = prevCounts[id] || 0;
            const newCount = currentCount + increment;

            if (newCount < 0 || newCount > maxRooms) {
                return prevCounts; // Không cho phép giảm dưới 0 hoặc vượt quá số phòng tối đa
            }

            return {
                ...prevCounts,
                [id]: newCount,
            };
        });
    };

    useEffect(() => {
        const {
            checkInDate = "2025-01-01",
            checkOutDate = "2025-01-02",
            roomType2 = 0,
            roomType4 = 0,
            isFav,
        } = location.state || {};

        setIsFavorite(isFav);

        setIsWeekend(checkWeekend(checkInDate) || checkWeekend(checkOutDate));

        const fetchHotelDetails = async () => {
            setIsLoaded(false);
            try {
                const response = await axios.get(
                    `/hotels/${id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType2=${roomType2}&roomType4=${roomType4}`
                );
                const data = response;
                if (data.status_code === 200) {
                    const room1 = data.data.room_types[0];
                    const room2 = data.data.room_types[1];

                    setRoomPrice1(room1.price);
                    setRoomPrice2(room2.price);

                    const isWeekendDay = checkWeekend(checkInDate) || checkWeekend(checkOutDate);
                    const initialPrice1 = isWeekendDay ? room1.weekend_price : room1.price;
                    const initialPrice2 = isWeekendDay ? room2.weekend_price : room2.price;

                    if (currency === "VND") {
                        setRoomPrice1Now(initialPrice1);
                        setRoomPrice2Now(initialPrice2);
                    } else {
                        setRoomPrice1Now(convertPrice(initialPrice1, "VND", currency));
                        setRoomPrice2Now(convertPrice(initialPrice2, "VND", currency));
                    }

                    setRoomCounts({
                        [room1.id]: roomType2 || 1,
                        [room2.id]: roomType4 || 1,
                    });

                    setMaxRoom2(data.data.numberOfRoom2);
                    setMaxRoom4(data.data.numberOfRoom4);

                    setHotelDetails(data.data);
                } else {
                    console.error("Error fetching hotel details");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/review/${id}`);
                const data = response;
                if (data.status_code === 200) {
                    setReviews(data.data.reviews);
                } else {
                    console.error("Failed to fetch reviews:", data.message);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
        fetchHotelDetails();
    }, [id, location.state]);

    if (!isLoaded) return <div>Loading...</div>;

    if (!hotelDetails) return <div>No details available</div>;

    const { name, address, description, star, images, room_types } = hotelDetails;

    const displayedImages = showAllImages ? images : images.slice(0, 5);

    const handleReserve = async () => {
        if (!userInfo.email) {
            toast.error("Please login to reserve", {
                position: "top-center",
            });
            return;
        }

        const numberOfRoom2 =
            roomCounts[hotelDetails.room_types.find((room) => room.type === 2).id] || 0;
        const numberOfRoom4 =
            roomCounts[hotelDetails.room_types.find((room) => room.type === 4).id] || 0;

        const data = {
            hotelId: +id,
            checkInDate: new Date(checkInDate).toISOString(),
            checkOutDate: new Date(checkOutDate).toISOString(),
            roomType2: numberOfRoom2,
            type2Price: roomPrice1,
            roomType4: numberOfRoom4,
            type4Price: roomPrice2,
            sumPrice: room_types.reduce((total, room) => {
                const count = roomCounts[room.id] || 0;
                const price = isWeekend ? room.weekend_price : room.price;

                return total + count * price;
            }, 0),
            userId: +userInfo.id,
        };

        console.log(">>> Start booking data: ", data);

        try {
            const res = await startBooking(data);
            console.log(">>> Start booking response: ", res);

            navigate("/reserve", {
                state: {
                    ...res.bookingData,
                    tempInfo: {
                        hotelId: +id,
                        checkInDate: new Date(checkInDate).toISOString(),
                        checkOutDate: new Date(checkOutDate).toISOString(),
                    },
                    numberOfRoom2: numberOfRoom2,
                    numberOfRoom4: numberOfRoom4,
                },
            });
        } catch (error) {
            console.error(">>> Error: ", error);
            toast.error("Error while starting booking");
        }
    };

    console.log(">>> location.state: ", location.state);

    return (
        <div className="mx-auto p-5">
            <div className="row px-5 py-2">
                <div className="col-md-11 pb-3 d-flex flex-column">
                    <h1 className="mt-5" style={{ fontWeight: "bold", fontSize: "40px" }}>
                        {name}
                    </h1>
                    <div className="d-flex align-items-center mt-3">
                        <img
                            src={icons.locationIcon}
                            alt="Location"
                            className="location-icon me-3"
                        />
                        <p className="pt-3 fs-3">{address}</p>
                    </div>
                </div>
                <div className="col-md-1">
                    <button
                        onClick={() => {
                            if (isFavorite) {
                                removeFavorite(userInfo.id, id);
                            } else {
                                addFavorite(userInfo.id, id);
                            }
                            setIsFavorite(!isFavorite);
                        }}
                        className={`hotel-card_favorite ${userInfo.email ? "" : "d-none"}`}
                    >
                        {userInfo.email && (
                            <>
                                {!isFavorite ? (
                                    <svg
                                        className="hotel-card_favorite-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="hotel-card_favorite-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            fill="red"
                                            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                                        />
                                    </svg>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="row px-5 py-2">
                <div className="col-md-8 pe-5">
                    <div className="image-gallery">
                        <div className="image-grid">
                            {displayedImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Hotel image ${index + 1}`}
                                    className={index === 0 ? "large-image" : "small-image"}
                                />
                            ))}
                        </div>
                        {images.length > 5 && (
                            <button
                                className="btn btn-primary mt-5"
                                style={{ fontSize: "18px", padding: "7px 20px" }}
                                onClick={toggleImageView}
                            >
                                {showAllImages
                                    ? t("hotelDetail.seeLess")
                                    : t("hotelDetail.seeMore")}
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-md-4 ps-5">
                    {/* <h2>{t("hotelDetail.ratingOverall")}:</h2> */}
                    <div className="star-rating py-2 mb-5">
                        <p className="fs-2 fw-bold mb-2">Rating overall:</p>
                        <div className="star-rating py-2 mb-4">
                            {Array.from({ length: star }, (_, index) => (
                                <img
                                    key={index}
                                    src={icons.starYellowIcon}
                                    alt="Star"
                                    className="star-icon mt-2"
                                    style={{ width: "50px" }}
                                />
                            ))}
                        </div>
                        <p className="fs-2 fw-bold mb-3">Location: </p>
                        <MapContainer
                            center={mapPositionRef.current}
                            zoom={13}
                            style={{
                                height: "460px",
                                width: "100%",
                                borderRadius: "12px",
                                border: "10px solid white",
                            }}
                        >
                            <TileLayer
                                maxZoom={30}
                                attribution="Google Maps"
                                url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                            />
                            <Marker
                                position={mapPositionRef.current}
                                icon={L.divIcon({
                                    className: "custom-marker",
                                    html: `<img src="${staticImages.mapMarkerIcon}" alt="marker" />`,
                                    iconSize: [50, 30],
                                })}
                            >
                                <Popup>
                                    <h2>{name}</h2>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
                <div className="px-5 py-4">
                    <div className="row my-5">
                        <p className="fs-3"> {description} </p>
                    </div>
                    <div className="my-5 search">
                        <SearchBarNoLocation
                            border-radius={12}
                            searchData={{
                                startDate: checkInDate,
                                endDate: checkOutDate,
                                numOfPeople: numOfPeople,
                            }}
                            handleSearch={handleSearch}
                        />
                    </div>
                    <div className="px-2 my-5 py-5">
                        <div className="card shadow p-3">
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="fs-1">{t("hotelDetail.roomType")}</th>
                                            <th className="fs-1">
                                                {t("hotelDetail.numberOfGuest")}
                                            </th>
                                            <th className="fs-1">{t("hotelDetail.todayPrice")}</th>
                                            <th className="fs-1">{t("hotelDetail.quantity")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {room_types.map((room) => (
                                            <tr key={room.id}>
                                                <td className="py-4">
                                                    <strong>
                                                        {room.type === 2
                                                            ? t("reserve.double")
                                                            : t("reserve.quadruple")}
                                                    </strong>
                                                </td>
                                                <td className="py-4">
                                                    <span className="fs-2">
                                                        {room.type === 2 ? "👤👤" : "👤👤👤👤"}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span>
                                                        {formatCurrency(
                                                            room.type === 2
                                                                ? roomPrice1Now
                                                                : roomPrice2Now,
                                                            newCurrency.current
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            onClick={() =>
                                                                handleRoomCountChange(
                                                                    room.id,
                                                                    -1,
                                                                    room.type === 2
                                                                        ? maxRoom2
                                                                        : maxRoom4
                                                                )
                                                            }
                                                            className="btn btn-outline-secondary"
                                                            disabled={
                                                                (roomCounts[room.id] || 0) <= 0
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-3">
                                                            {roomCounts[room.id] || 0}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleRoomCountChange(
                                                                    room.id,
                                                                    1,
                                                                    room.type === 2
                                                                        ? maxRoom2
                                                                        : maxRoom4
                                                                )
                                                            }
                                                            className="btn btn-outline-secondary"
                                                            disabled={
                                                                (roomCounts[room.id] || 0) >=
                                                                (room.type === 2
                                                                    ? maxRoom2
                                                                    : maxRoom4)
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="text-end mt-3">
                                    <p>
                                        {t("hotelDetail.total")}: VND{" "}
                                        {room_types
                                            .reduce((total, room) => {
                                                const count = roomCounts[room.id] || 0;
                                                const price = isWeekend
                                                    ? room.weekend_price
                                                    : room.price;
                                                return total + count * price;
                                            }, 0)
                                            .toLocaleString()}
                                    </p>
                                    <button
                                        className="btn btn-success"
                                        style={{ fontSize: "20px", padding: "5px 15px" }}
                                        onClick={() => handleReserve()}
                                        disabled={
                                            Object.values(roomCounts).reduce(
                                                (total, count) => total + count,
                                                0
                                            ) === 0
                                        }
                                    >
                                        {t("hotelDetail.reserve")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-4">
                        <p className="mb-5" style={{ fontSize: "30px", fontWeight: "bold" }}>
                            {t("hotelDetail.customerReviews")}
                        </p>
                        {/* Reviews Section */}
                        <div className="reviews-section">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div className="review-card" key={review.id}>
                                        <div className="profile-pic">
                                            <img
                                                src={review.avatar}
                                                alt="Profile"
                                                className="avatar-image"
                                            />
                                        </div>
                                        <div className="name mb-2 fs-2 fw-bold">{review.name}</div>
                                        <div className="stars">
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                const isFullStar = review.rate >= index + 1;
                                                const isHalfStar =
                                                    review.rate > index && review.rate < index + 1;
                                                return isFullStar ? (
                                                    <img
                                                        key={index}
                                                        src={icons.starYellowIcon}
                                                        alt="Star"
                                                        className="star-icon"
                                                    />
                                                ) : (
                                                    <img
                                                        key={index}
                                                        src={icons.starEmptyIcon}
                                                        alt="Empty Star"
                                                        className="star-gray-icon"
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="comment">{review.comment}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
