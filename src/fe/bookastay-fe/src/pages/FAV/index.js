import React, { useCallback, useEffect, useState } from "react";
import "./fav.css";
import icons from "~/assets/icon";
import HotelCard from "~/components/HotelCard/HotelCard";
import { getAllFavorite } from "~/services/apiService";
import { useSelector } from "react-redux";
import { Button, Empty, Flex, Pagination, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
    const navigate = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageLimit, setPageLimit] = useState(6);

    const userInfo = useSelector((state) => state.account.userInfo);

    const [favoriteHotels, setFavoriteHotels] = useState([]);

    const fetchFavoriteHotels = useCallback(async () => {
        try {
            setIsLoaded(true);
            const response = await getAllFavorite({
                userId: userInfo.id,
                page: currentPage,
                limit: pageLimit,
            });

            if (response && +response.status === 200) {
                let hotels = response.data.hotels;

                setFavoriteHotels(hotels);

                console.log(">>> response.data", response);

                // Set total items
                setTotalItems(response.data.total);
            }
        } catch (error) {
            console.log(">>> error", error);
        } finally {
            setIsLoaded(false);
        }
    }, [currentPage, pageLimit, userInfo.id]);

    useEffect(() => {
        fetchFavoriteHotels();
    }, []);

    useEffect(() => {
        fetchFavoriteHotels();
    }, [currentPage, pageLimit, userInfo.id]);

    // Change page
    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageLimit(pageSize);
    };

    const handleDeleteFav = useCallback(
        async (hotelId) => {
            try {
                // Cập nhật UI ngay lập tức bằng cách lọc ra hotel đã xóa
                setFavoriteHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId));

                // Cập nhật tổng số items
                setTotalItems((prev) => prev - 1);

                // Kiểm tra nếu page hiện tại không còn items nào
                // và không phải là page đầu tiên thì chuyển về page trước đó
                if (favoriteHotels.length === 1 && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                }

                // Gọi API xóa favorite ở đây
                // const response = await deleteFavorite(hotelId);
            } catch (error) {
                console.log(">>> error deleting favorite:", error);
                // Nếu xóa thất bại thì fetch lại data
                fetchFavoriteHotels();
            }
        },
        [currentPage, favoriteHotels.length]
    );

    return (
        <>
            <div className="favorite-container">
                {/* Header Section */}
                <div className="favorite-header row my-5 py-5">
                    <div className="col-6 d-flex align-items-center ps-5 pt-5">
                        <img src={icons.redHeartIcon} alt="Heart" className="heartIcon ms-5" />
                        <h1 className="ms-5 pt-2">Favorite</h1>
                    </div>
                    {/* <div className="col-6">
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
                    </div> */}
                </div>

                {/* Hotels Section */}
                <div className="favorite-hotels row mx-5">
                    {favoriteHotels.length === 0 && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<span className="fs-3">No favorite hotels found</span>}
                        >
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/");
                                }}
                            >
                                Homepage
                            </Button>
                        </Empty>
                    )}
                    {favoriteHotels.map((item, index) => (
                        <div key={item.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <HotelCard
                                {...item}
                                maxHeight="450px"
                                removeFavorite={handleDeleteFav}
                                isFavorite={true}
                                minRoomPrice={item.price}
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
                            total={totalItems}
                            defaultPageSize={pageLimit}
                            pageSizeOptions={[6, 12, 18, 24]}
                            onChange={(page, pageSize) => {
                                handlePaginationChange(page, pageSize);
                            }}
                        />
                    </div>
                )}
            </div>
            {isLoaded && (
                <Flex
                    gap="middle"
                    vertical
                    align="center"
                    justify="center"
                    style={{
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        zIndex: 9999,
                    }}
                >
                    <Flex gap="middle">
                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{
                                        fontSize: 50,
                                        fontWeight: "bold",
                                    }}
                                    spin
                                />
                            }
                            size="large"
                        ></Spin>
                    </Flex>
                </Flex>
            )}
        </>
    );
};

export default Favorite;
