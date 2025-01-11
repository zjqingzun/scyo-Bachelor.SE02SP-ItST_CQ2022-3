import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { convertCurrency, formatCurrency } from "~/utils/currencyUtils";
import icons from "~/assets/icon";

import { Modal } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import geocodeAddress from "~/utils/geocodeAddress";
import staticImages from "~/assets/image";
import "leaflet/dist/leaflet.css";
import "./HotelCard.scss";
import { addFavorite, getAllFavorite, removeFavorite } from "~/services/apiService";
import { addDays, formatDate } from "~/utils/datetime";

const HotelAfterSearchCard = ({
    name,
    address,
    images,
    minRoomPrice: price,
    averageRating: rating,
    totalReviews: review,
    star,
    id,
    isFav,
}) => {
    const location = useLocation();

    const navigate = useNavigate();
    const handleBookNow = () => {
        navigate(`/hotel/${id}`, {
            state: {
                id,
                name,
                address,
                images,
                price,
                rating,
                isFav: isFavorite,
                review,
                star,
                checkInDate: location.state?.startDate, // Truyền từ location.state
                checkOutDate: location.state?.endDate,
                roomType2: location.state?.numOfPeople?.roomType2,
                roomType4: location.state?.numOfPeople?.roomType4,
            },
        });
    };

    const { t } = useTranslation();

    const currency = useSelector((state) => state.currency.currency);
    const exchangeRate = useSelector((state) => state.currency.exchangeRate);

    const userInfo = useSelector((state) => state.account.userInfo);

    const [isFavorite, setIsFavorite] = useState(isFav);

    const [nowPrice, setNowPrice] = useState(price);

    const nowCurrency = useRef("VND");

    const getTextRating = () => {
        if (rating > 8) {
            return "Great";
        } else if (rating > 6) {
            return "Good";
        } else {
            return "Average";
        }
    };

    useEffect(() => {
        if (currency !== nowCurrency.current) {
            if (currency === "VND") {
                setNowPrice(price);
            } else {
                setNowPrice(convertCurrency(nowPrice, nowCurrency.current, currency, exchangeRate));
            }

            nowCurrency.current = currency;
        }
    }, [currency]);

    const [showMapModal, setShowMapModal] = useState(false);
    const mapPositionRef = useRef([10.5279716, 107.3921728]);

    const handleCloseMapModel = () => setShowMapModal(false);
    const handleShowMapModel = async (address) => {
        mapPositionRef.current = await geocodeAddress(address);

        setShowMapModal(true);
    };

    // test get all favorite
    // useEffect(() => {
    //     if (userInfo.email) {
    //         getAllFavorite({ userId: userInfo.id, page: 1, limit: 6, sortBy: "name", order: "ASC" })
    //             .then((res) => {
    //                 const favoriteList = res.data.hotels;
    //                 const isFav = favoriteList.some((fav) => fav.id === id);
    //                 setIsFavorite(isFav);
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // }, [userInfo.email]);

    return (
        <div className="hotel-card hotel-card--after-search">
            <Modal centered show={showMapModal} onHide={handleCloseMapModel}>
                <Modal.Body>
                    <Modal.Header closeButton></Modal.Header>
                    <MapContainer center={mapPositionRef.current} zoom={13}>
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
                </Modal.Body>
            </Modal>
            <div className="hotel-card__image-wrap">
                <a
                    href="#!"
                    style={{ display: "block", height: "100%" }}
                    onClick={(e) => {
                        e.preventDefault();
                        handleBookNow();
                    }}
                >
                    <img src={images[0]} alt={name} className="hotel-card__image" />
                </a>

                <button
                    onClick={() => {
                        if (isFavorite) {
                            removeFavorite(userInfo.id, id);
                        } else {
                            addFavorite(userInfo.id, id);
                        }
                        setIsFavorite(!isFavorite);
                    }}
                    className={`hotel-card__favorite ${userInfo.email ? "" : "d-none"}`}
                >
                    {userInfo.email && !isFavorite && (
                        <svg
                            className="hotel-card__favorite-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                        </svg>
                    )}
                    {userInfo.email && isFavorite && (
                        <svg
                            className="hotel-card__favorite-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="red"
                                d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                            />
                        </svg>
                    )}
                </button>
            </div>
            <div className="hotel-card__info flex-grow-1 mt-0 d-flex flex-column">
                <a title={name} className="hotel-card__name fs-1" onClick={() => handleBookNow()} style={{ fontSize: "20px", cursor: "pointer" }}>
                    {name}
                </a>
                <div className="hotel-card__star d-flex gap-2">
                    {[...Array(star)].map((_, index) => (
                        <img
                            key={index}
                            src={icons.yellowStarIcon}
                            alt="star"
                            className="hotel-card__star-icon"
                        />
                    ))}
                </div>
                <p title={address} className="hotel-card__address mt-2">
                    {address}
                </p>

                <div className="hotel-card__row justify-content-between w-100 mt-auto">
                    <a
                        href="#!"
                        onClick={(e) => {
                            e.preventDefault();
                            handleShowMapModel(address);
                        }}
                        className="hotel-card__open-map"
                    >
                        {t("hotelCard.OpenMap")}
                    </a>

                    <span className="hotel-card__price">{formatCurrency(nowPrice, currency)}</span>
                </div>

                <div className="hotel-card__row hotel-card__bottom gap-3 mt-3">
                    <div className="hotel-card__score">
                        <div className="hotel-card__rating">{Number(rating)?.toFixed(1)}</div>
                    </div>

                    <div className="hotel-card__row gap-2 h-100">
                        <span className="hotel-card__review">
                            {t(`hotelCard.${getTextRating()}`)}
                        </span>
                        <div className="hotel-card__separate"></div>
                        <span className="hotel-card__review">
                            {review} {t("hotelCard.Reviews")}
                        </span>
                    </div>

                    <button className="hotel-card__btn ms-auto" onClick={handleBookNow}>
                        {t("hotelCard.BookNow")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(HotelAfterSearchCard);
