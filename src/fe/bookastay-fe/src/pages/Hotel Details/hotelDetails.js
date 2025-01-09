
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useMemo, useCallback } from "react";
import "./hotelDetails.css";
import icons from "~/assets/icon";
import SearchBarNoLocation from "~/components/SearchBarNoLocation";
import { getHotelDetail } from "~/services/apiService";
import { convertCurrency, formatCurrency } from "~/utils/currencyUtils";
import { useSelector } from "react-redux";

const HotelDetails = () => {
    const { id } = useParams();
    const location = useLocation();

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
                    console.error('Failed to fetch reviews:', data.message);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
        fetchHotelDetails();
    }, [id, location.state]);

    if (!isLoaded) return <div>Loading...</div>;

    if (!hotelDetails) return <div>No details available</div>;

    const {
        name,
        address,
        description,
        star,
        images,
        room_types,
    } = hotelDetails;

    const displayedImages = showAllImages ? images : images.slice(0, 5);
    return (
        <div className="mx-auto p-5">
            <div className="row px-5 py-2">
                <div className="col-md-10 pb-3 d-flex flex-column">
                    <h1 className='mt-5' style={{ fontWeight: "bold", fontSize: "40px" }}>{name}</h1>
                    <div className="d-flex align-items-center mt-3">
                        <img src={icons.locationIcon} alt="Location" className="location-icon me-3" />
                        <p className='pt-3 fs-3'>{address}</p>
                    </div>
                </div>
                <div className="col-md-2 d-flex justify-content-end">
                    <img
                        src={isHearted ? icons.redHeartIcon : icons.heartIcon}
                        alt="Heart"
                        className="heart-icon me-3"
                        onClick={handleToggleHeart}
                        style={{ cursor: 'pointer' }}
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
                            <button className="btn btn-primary mt-5" style={{ fontSize: "18px", padding: "7px 20px" }} onClick={toggleImageView}>
                                {showAllImages ? "See Less" : "See More"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-md-4 ps-5">
                    <h2>Rating overall:</h2>
                    <div className="star-rating py-2 mb-5">
                        {Array.from({ length: star }, (_, index) => (
                            <img key={index} src={icons.starYellowIcon} alt="Star" className="star-icon mt-2" style={{ width: "40px" }} />
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
                                                <strong>{room.type === 2 ? "Room type 2" : "Room type 4"}</strong>
                                            </td>
                                            <td className="py-4">
                                                <span className="fs-2">
                                                    {room.type === 2 ? "👤👤" : "👤👤👤👤"}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span>
                                                    VND {isWeekend ? room.weekend_price.toLocaleString() : room.price.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        onClick={() => handleRoomCountChange(room.id, -1, room.numberOfRoom2)}
                                                        className="btn btn-outline-secondary"
                                                        disabled={(roomCounts[room.id] || 0) <= 0}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-3">{roomCounts[room.id] || 0}</span>
                                                    <button
                                                        onClick={() => handleRoomCountChange(room.id, 1, room.numberOfRoom2)}
                                                        className="btn btn-outline-secondary"
                                                        disabled={(roomCounts[room.id] || 0) >= room.numberOfRoom2}
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
                                    {room_types.reduce((total, room) => {
                                        const count = roomCounts[room.id] || 0;
                                        const price = isWeekend ? room.weekend_price : room.price;
                                        return total + count * price;
                                    }, 0).toLocaleString()}
                                </p>
                                <button className="btn btn-success" style={{ fontSize: "20px", padding: "5px 15px" }}>Reserve</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-4">
                    <p className="mb-5" style={{ fontSize: "30px", fontWeight: "bold" }}>Customer Reviews</p>
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
                                            const isHalfStar = review.rate > index && review.rate < index + 1;
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
            );
        </div>
    );
};

export default HotelDetails;
