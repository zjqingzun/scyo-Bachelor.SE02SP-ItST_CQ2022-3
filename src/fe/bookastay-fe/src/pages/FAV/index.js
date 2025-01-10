import React, { useCallback, useEffect, useState } from "react";
import "./fav.css";
import icons from "~/assets/icon";
import HotelCard from "~/components/HotelCard/HotelCard";
import { getAllFavorite } from "~/services/apiService";
import { useSelector } from "react-redux";
import { Pagination } from "antd";

const Favorite = () => {
    const cardsData = [
        {
            name: "Hotel ABC",
            address: "123 Street, City, Country",
            images: [
                "https://kinsley.bslthemes.com/wp-content/uploads/2021/08/img-banner-2-scaled-1-1920x1315.jpg",
            ],
            price: 200,
            rating: 9.5,
            review: 100,
        },
        {
            name: "Hotel XYZ",
            address: "456 Street, City, Country",
            images: [
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            price: 150,
            rating: 8.5,
            review: 50,
        },
        {
            name: "Hotel LMN",
            address: "789 Street, City, Country",
            images: [
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            price: 300,
            rating: 7.5,
            review: 70,
        },
        {
            name: "Hotel DEF",
            address: "012 Street, City, Country",
            images: [
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            price: 250,
            rating: 6.5,
            review: 80,
        },
        {
            name: "Hotel GHI",
            address: "345 Street, City, Country",
            images: [
                "https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            price: 180,
            rating: 5.5,
            review: 90,
        },
        {
            name: "Hotel PQR",
            address: "678 Street, City, Country",
            images: [
                "https://cf.bstatic.com/xdata/images/hotel/square600/458830113.webp?k=ff0cb97b7983f09e099de3260a9553fa2a4d0582323e0a962b52cf67ffc2b38f&o=",
            ],
            price: 400,
            rating: 4.5,
            review: 110,
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 6 items per page
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredCards = cardsData.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentCards = filteredCards.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

    const userInfo = useSelector((state) => state.account.userInfo);

    const [favoriteHotels, setFavoriteHotels] = useState([]);

    const fetchFavoriteHotels = useCallback(async () => {
        try {
            const response = await getAllFavorite({
                userId: userInfo.id,
                page: currentPage,
                limit: itemsPerPage,
            });

            if (response && +response.status === 200) {
                const hotels = response.data.hotels;
                setFavoriteHotels(hotels);

                console.log(">>> response.data", response);
            }
        } catch (error) {
            console.log(">>> error", error);
        }
    }, [currentPage, itemsPerPage, userInfo.id]);

    useEffect(() => {
        fetchFavoriteHotels();
    }, []);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="favorite-container">
            {/* Header Section */}
            <div className="favorite-header row my-5 py-5">
                <div className="col-6 d-flex align-items-center ps-5 pt-5">
                    <img src={icons.redHeartIcon} alt="Heart" className="heartIcon ms-5" />
                    <h1 className="ms-5 pt-2">Favorite</h1>
                </div>
                <div className="col-6">
                    <div className="input-group pe-5 pt-5">
                        <input
                            type="text"
                            className="form-control p-3 fs-3"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img
                            src={icons.searchIcon}
                            alt="search"
                            className="btn btn-outline-primary searchIcon"
                        />
                    </div>
                </div>
            </div>

            {/* Hotels Section */}
            <div className="favorite-hotels row mx-5">
                {cardsData.map((item, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <HotelCard
                            name={item.name}
                            address={item.address}
                            images={item.images}
                            price={item.price}
                            rating={item.rating}
                            review={item.review}
                            maxHeight="450px"
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {favoriteHotels.length > 0 && (
                <div className="pagination mt-5 d-flex justify-content-center">
                    <Pagination
                        showQuickJumper
                        defaultCurrent={currentPage}
                        total={3123}
                        defaultPageSize={32}
                        pageSizeOptions={[6, 12, 18, 24]}
                        onChange={(page, pageSize) => {
                            handlePaginationChange(page, pageSize);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Favorite;
