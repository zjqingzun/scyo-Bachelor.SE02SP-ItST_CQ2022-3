import React, { useEffect, useState } from 'react';
import './hotelDetails.css';
import icons from "~/assets/icon";
import SearchBarNoLocation from '~/components/SearchBarNoLocation';
import { ro } from 'date-fns/locale';

const locations = [
    { id: 1, name: 'Home', parentId: null },
    { id: 2, name: 'Vietnam', parentId: 1 },
    { id: 3, name: 'Ho Chi Minh', parentId: 2 },
    { id: 4, name: 'Sabay Airport Apartment', parentId: 3 },
];

const HotelDetails = () => {
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
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);

    useEffect(() => {
        const generateBreadcrumb = () => {
            let currentLocationId = 4; // Start from 'Sabay Airport Apartment'
            const items = [];

            // Find and build breadcrumb by traversing parent-child hierarchy
            while (currentLocationId !== null) {
                const location = locations.find(loc => loc.id === currentLocationId);
                if (location) {
                    items.push(location.name);
                    currentLocationId = location.parentId; // Move to parent location
                } else {
                    break;
                }
            }

            // Reverse to get the correct order and set 'Home' as the first item
            setBreadcrumbItems(items.reverse());
        };

        generateBreadcrumb();
    }, []); // Runs once when the component is mounted

    const [isActive, setIsActive] = useState(false);

    const handleHeartClick = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="mx-auto p-5">
            <div className="nav-bar-search px-5 py-2 mt-5">
                <nav
                    style={{
                        "--bs-breadcrumb-divider":
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")",
                    }}
                    aria-label="breadcrumb"
                >
                    <ul li="breadcrumb" className="breadcrumb d-flex">
                        {breadcrumbItems.map((item, index) => (
                            <li class="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="row px-5 py-2">
                <div className="col-md-8 pe-5">
                    <h1 className='my-0'>Sabay Airport Apartment</h1>
                </div>
                <div className="col-md-8 pb-3 d-flex">
                    <img src={icons.locationIcon} alt="Location" className="location-icon me-3" />
                    <p className='pt-3'>Phnom Penh, Cambodia</p>
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
                    <div className="property-images">
                        <img src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/428733700.jpg?k=72c0b6d2e0bba8bf4f0109e91fd225ce840d1cf6717a6cc35a578894da9eeb99&o=&hp=1"
                            alt="Main" className="main-img rounded" />
                        <div className="row">
                            <div className="col-3">
                                <img
                                    src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/428731082.jpg?k=1921175ddf14d4871fe7f3585a3e66e9fed02a61810965e72be6a72a3df9881a&o=&hp=1"
                                    alt="Sub" className="thumbnail rounded" /></div>
                            <div className="col-3">
                                <img
                                    src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/430679432.jpg?k=f00135cc61394e1bd7a514df648dab6406cb24a168383bc83fbf3e5cab5b9911&o=&hp=1"
                                    alt="Sub" className="thumbnail rounded" /></div>
                            <div className="col-3">
                                <img
                                    src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/430679813.jpg?k=f321b16d5365618559d5b00794db817623d923d2cdb14a4364a36ad188530ddb&o=&hp=1"
                                    alt="Sub" className="thumbnail rounded" /></div>
                            <div className="col-3">
                                <button className="btn btn-outline-secondary w-100 fs-3 py-2">+ 34 other</button>
                            </div>
                        </div>
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
                    <p>Sabay Airport Apartment - 1 min to TSN Airport - Breakfast included has air-conditioned guest
                        accommodation in Ho Chi Minh City...</p>
                    <ul>
                        <li>5 km from Tan Dinh Market</li>
                        <li>6 km from Reunification Palace</li>
                        <li>2.4 km from Tan Son Nhat International Airport</li>
                    </ul>
                    <p><strong>Distance in property description is calculated using © OpenStreetMap</strong></p>

                    <button className="btn btn-primary fs-3 py-2 px-5 mt-5">Reserve</button>
                </div>
            </div>

            <div className="px-5 py-4">
                <div className="px-2 my-5 pb-5" id="info">
                    <p className="fs-3">Sabay Airport Apartment - 1 min to TSN Airport - Breakfast included has air-conditioned
                        guest
                        accommodation in Ho Chi Minh City, 5 km from Tan Dinh Market, 5 km from Giac Lam Pagoda and 6 km
                        from War Remnants Museum.
                        Couples particularly like the location — they rated it 9.2 for a two-person trip.
                        Distance in property description is calculated using © OpenStreetMap
                    </p>
                    <p className="fs-3">Each unit features a fully equipped kitchen with a microwave, a seating area with a
                        sofa, a
                        flat-screen TV, a washing machine, and a private bathroom with bidet and a hairdryer. For added
                        convenience, the property can provide towels and bed linen for an extra charge.
                        The apartment features a terrace. </p>
                    <p className="fs-3">Reunification Palace is 6 km from Sabay Airport Apartment - 1 min to TSN Airport -
                        Breakfast
                        included, while Diamond Plaza is 6 km from the property.
                        The nearest airport is Tan Son Nhat International Airport, 2.4 km from the accommodation.</p>
                </div>
                
                <div className='mx-5 search'>
                    <SearchBarNoLocation border-radius={12}/>
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