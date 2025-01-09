import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useMemo, useCallback } from "react";
import "./hotelDetails.css";
import icons from "~/assets/icon";
import SearchBarNoLocation from "~/components/SearchBarNoLocation";
import { getHotelDetail, startBooking } from "~/services/apiService";
import { convertCurrency, formatCurrency } from "~/utils/currencyUtils";
import { useSelector } from "react-redux";

const HotelDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { checkInDate, checkOutDate, numOfPeople, isFav } = location.state || {};

    const currency = useSelector((state) => state.currency.currency);
    const exchangeRate = useSelector((state) => state.currency.exchangeRate);
    const userInfo = useSelector((state) => state.account.userInfo);

    const newCurrency = useRef("VND");

    const [roomPrice1, setRoomPrice1] = useState(0);
    const [roomPrice2, setRoomPrice2] = useState(0);
    const [roomPrice1Now, setRoomPrice1Now] = useState(0);
    const [roomPrice2Now, setRoomPrice2Now] = useState(0);

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

    // const [roomPrice1, setRoomPrice1] = useState(0);
    // const [roomPrice2, setRoomPrice2] = useState(0);

    const [hotelDetails, setHotelDetails] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHearted, setIsHearted] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);

    const [roomCounts, setRoomCounts] = useState({});
    const [isWeekend, setIsWeekend] = useState(false);

    // Hàm kiểm tra ngày cuối tuần
    const checkWeekend = (date) => {
        const day = new Date(date).getDay();
        return day === 6 || day === 0; // Thứ 7 hoặc Chủ nhật
    };

    const handleToggleHeart = () => {
        setIsHearted((prev) => !prev);
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
        } = location.state || {};

        setIsWeekend(checkWeekend(checkInDate) || checkWeekend(checkOutDate));

        const fetchHotelDetails = async () => {
            setIsLoaded(false);
            try {
                const response = await fetch(
                    `http://localhost:3001/api/hotels/${id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType2=${roomType2}&roomType4=${roomType4}`
                );
                const data = await response.json();
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
                const response = await fetch(`http://localhost:3001/api/review/${id}`);
                const data = await response.json();
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
        const data = {
            hotelId: +id,
            checkInDate: new Date(checkInDate).toISOString(),
            checkOutDate: new Date(checkOutDate).toISOString(),
            roomType2: 2,
            type2Price: roomPrice1,
            roomType4: 4,
            type4Price: roomPrice2,
            sumPrice: room_types.reduce((total, room) => {
                const count = roomCounts[room.id] || 0;
                const price = isWeekend ? room.weekend_price : room.price;
                return total + count * price;
            }, 0),
            userId: +userInfo.id,
        };

        const res = await startBooking(data);

        const numberOfRoom2 =
            roomCounts[hotelDetails.room_types.find((room) => room.type === 2).id] || 0;
        const numberOfRoom4 =
            roomCounts[hotelDetails.room_types.find((room) => room.type === 4).id] || 0;

        console.log(">>> Start booking response: ", res);

        navigate("/reserve", {
            state: {
                ...res.bookingData,
                numberOfRoom2: numberOfRoom2,
                numberOfRoom4: numberOfRoom4,
            },
        });
    };

    return (
        <div className="mx-auto p-5">
            <div className="row px-5 py-2">
                <div className="col-md-10 pb-3 d-flex flex-column">
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
                <div className="col-md-2 d-flex justify-content-end">
                    <img
                        src={isHearted ? icons.redHeartIcon : icons.heartIcon}
                        alt="Heart"
                        className="heart-icon me-3"
                        onClick={handleToggleHeart}
                        style={{ cursor: "pointer" }}
                    />
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
                                {showAllImages ? "See Less" : "See More"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-md-4 ps-5">
                    <h2>Rating overall:</h2>
                    <div className="star-rating py-2 mb-5">
                        {Array.from({ length: star }, (_, index) => (
                            <img
                                key={index}
                                src={icons.starYellowIcon}
                                alt="Star"
                                className="star-icon mt-2"
                                style={{ width: "40px" }}
                            />
                        ))}
                    </div>
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
                                        <th className="fs-1">Room type</th>
                                        <th className="fs-1">Number of guest</th>
                                        <th className="fs-1">Today's price</th>
                                        <th className="fs-1">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {room_types.map((room) => (
                                        <tr key={room.id}>
                                            <td className="py-4">
                                                <strong>
                                                    {room.type === 2
                                                        ? "Room type 2"
                                                        : "Room type 4"}
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
                                                                room.numberOfRoom2
                                                            )
                                                        }
                                                        className="btn btn-outline-secondary"
                                                        disabled={(roomCounts[room.id] || 0) <= 0}
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
                                                                room.numberOfRoom2
                                                            )
                                                        }
                                                        className="btn btn-outline-secondary"
                                                        disabled={
                                                            (roomCounts[room.id] || 0) >=
                                                            room.numberOfRoom2
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
                                    Total: VND{" "}
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
                                >
                                    Reserve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-4">
                    <p className="mb-5" style={{ fontSize: "30px", fontWeight: "bold" }}>
                        Customer Reviews
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
    );
};

export default HotelDetails;
