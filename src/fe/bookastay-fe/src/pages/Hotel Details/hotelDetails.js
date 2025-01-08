import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import './hotelDetails.css';
import icons from "~/assets/icon";
import SearchBarNoLocation from '~/components/SearchBarNoLocation';
import { ro } from 'date-fns/locale';
import { useParams } from "react-router-dom";

const HotelDetails = () => {
    const location = useLocation();
    const { name, address, images, price, rating, review, star, id, description } = location.state || {};

    const [room1Count, setRoom1Count] = useState(0);
    const [room2Count, setRoom2Count] = useState(0);
    const roomPrice1 = 500000;
    const roomPrice2 = 800000;

    const handleIncrease = (room, setRoomCount) => {
        setRoomCount((prev) => prev + 1);
    };

    const handleDecrease = (room, setRoomCount) => {
        setRoomCount((prev) => (prev > 1 ? prev - 1 : 0));
    };

    const totalRooms = room1Count + room2Count;
    const totalPrice = room1Count * roomPrice1 + room2Count * roomPrice2;

    const [isActive, setIsActive] = useState(false);

    const handleHeartClick = () => {
        setIsActive(!isActive);
    };

    const [showAll, setShowAll] = useState(false);

    const visibleImages = showAll ? images : images.slice(0, 4);


    return (
        <div className="mx-auto p-5">
            <div className="row px-5 py-2">
                <div className="col-md-8 pe-5">
                    <h1 className='mt-5'>{name}</h1>
                </div>
                <div className="col-md-8 pb-3 d-flex">
                    <img src={icons.locationIcon} alt="Location" className="location-icon me-3" />
                    <p className='pt-3'>{address}</p>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                    <i
                        id="heartIcon"
                        className={`heart-icon ${isActive ? 'fa-solid' : 'fa-regular'} fa-heart`}
                        onClick={handleHeartClick}
                        style={{
                            color: isActive ? 'red' : 'black',
                            fontSize: isActive ? '24px' : '20px',
                            cursor: 'pointer',
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
                        <img src={icons.starHalfYellowIcon} alt="Star" className="star-half-yellow-icon" />
                    </div>
                    <p className="fs-3"> {description} </p>

                    <button className="btn btn-primary fs-3 py-2 px-5 mt-5">Reserve</button>
                </div>
            </div>

            <div className="px-5 py-4">
                <div className='mx-5 search'>
                    <SearchBarNoLocation border-radius={12} />
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
                                    {/* Room 1 */}
                                    <tr>
                                        <td>
                                            <strong>One-Bedroom Apartment</strong>
                                        </td>
                                        <td>
                                            <span className="fs-4">👤👤</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <span>VND {roomPrice1.toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex align-items-center ms-3">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleDecrease("room1", setRoom1Count)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={room1Count}
                                                        readOnly
                                                        className="form-control mx-2 text-center"
                                                        style={{ width: "50px" }}
                                                    />
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleIncrease("room1", setRoom1Count)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-2">
                                                = VND {(room1Count * roomPrice1).toLocaleString()}
                                            </p>
                                        </td>
                                    </tr>

                                    {/* Room 2 */}
                                    <tr>
                                        <td>
                                            <strong>One-Bedroom Apartment</strong>
                                        </td>
                                        <td>
                                            <span className="fs-4">👤👤👤👤</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="me-3">
                                                    <span>VND {roomPrice2.toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex align-items-center ms-3">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleDecrease("room2", setRoom2Count)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={room2Count}
                                                        readOnly
                                                        className="form-control mx-2 text-center"
                                                        style={{ width: "50px" }}
                                                    />
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleIncrease("room2", setRoom2Count)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-2">
                                                = VND {(room2Count * roomPrice2).toLocaleString()}
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Summary Section */}
                            <div className="text-end">
                                <h5>
                                    {totalRooms} rooms for VND {totalPrice.toLocaleString()}
                                </h5>
                                <p>Includes taxes and charges</p>
                                <button className="btn btn-primary fs-3 py-2 px-5 mt-2">Reserve</button>
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
                                <img src={icons.chevronLeftIcon} alt="Arrow" className="arrow-left-icon" />
                            </div>

                            <div className="review-card-container">
                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starHalfYellowIcon} alt="Star" className="star-half-yellow-icon" />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>

                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starHalfYellowIcon} alt="Star" className="star-half-yellow-icon" />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>

                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starHalfYellowIcon} alt="Star" className="star-half-yellow-icon" />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>

                                <div className="review-card">
                                    <div className="profile-pic"></div>
                                    <div className="name">Customer's name</div>
                                    <div className="stars">
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-icon" />
                                        <img src={icons.starYellowIcon} alt="Star" className="star-half-yellow-icon" />
                                    </div>
                                    <div className="comment">Comment sth here...</div>
                                </div>
                            </div>

                            <div className="arrow">
                                <img src={icons.chevronRightIcon} alt="Arrow" className="arrow-right-icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-2 my-5 pb-5">
                    <div className="row g-0 align-items-center">
                        <div className="col-md-4 text-bg-light text-center">
                            <div className="fs-1 h-100">
                                Q&A
                            </div>
                        </div>

                        <div className="col-md-8 accordion accordion-flush">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                        Accordion Item #1
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the first item's accordion body.</div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                        Accordion Item #2
                                    </button>
                                </h2>
                                <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the second item's accordion body. Let's imagine this being filled with some actual content.</div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                        Accordion Item #3
                                    </button>
                                </h2>
                                <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> className. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.</div>
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