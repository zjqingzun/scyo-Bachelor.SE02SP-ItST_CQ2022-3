import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Collapse, Empty, Flex, Spin, Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./AfterSearch.scss";

import SearchBar from "~/components/SearchBar";
import Filter from "~/components/Filter";
import { HotelAfterSearchCard as HotelCard } from "~/components/HotelCard";

import { getHotels } from "~/services/apiService";
import { toast } from "react-toastify";

// This function converts the string to lowercase, then perform the conversion
function toLowerCaseNonAccentVietnamese(str) {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

const MockRecommend = [
    {
        id: 1,
        name: "The Grand Ho Tram Strip",
        address: "Phuoc Thuan, Xuyen Moc, Ba Ria - Vung Tau",
        image: "https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 3877530,
        rating: 9.5,
        review: 100,
        star: 5,
    },
    {
        id: 2,
        name: "Jan Hostel Central Point",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/square600/458830113.webp?k=ff0cb97b7983f09e099de3260a9553fa2a4d0582323e0a962b52cf67ffc2b38f&o=",
        price: 3948613,
        rating: 9.0,
        review: 50,
        star: 4,
    },
    {
        id: 3,
        name: "HANZ 345 Business Suite Grand Residence",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/square600/586909150.webp?k=422e9c17817cd27de89aaa113a1711a3b23151c8f13919aa1dc08a970b70cf97&o=",
        price: 2660000,
        rating: 9.3,
        review: 80,
        star: 4,
    },
    {
        id: 4,
        name: "Apina Saigon - Truong Dinh",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/627961646.jpg?k=fcfe1652c85b804653cb8647c3735dba4d0c1073d39c837949902d202569f83e&o=&hp=1",
        price: 4288680,
        rating: 9.5,
        review: 70,
        star: 5,
    },
    {
        id: 5,
        name: "3Bedroom - Icon56 Building - Hana Apart",
        address: "Quận 4, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/629676872.jpg?k=fde6bd191057f745d622c97a6c6680ebfa036d330404d50ce577f380d8731701&o=&hp=1",
        price: 4288680,
        rating: 9.5,
        review: 50,
        star: 4,
    },
    {
        id: 6,
        name: "Halo Hotel",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/481411027.jpg?k=2a164ab4e60b9dcaf84e6c09d4db23752402717cf6d837f512eed337c5955ff9&o=",
        price: 2488680,
        rating: 7.5,
        review: 100,
        star: 5,
    },
];

const AfterSearch = () => {
    const location = useLocation();

    const [searchedHotel, setSearchedHotel] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalPage, setTotalPage] = useState(0);
    const [total, setTotal] = useState(0);

    const filteredHotels = useMemo(() => {
        if (!searchedHotel?.length) return [];
        return searchedHotel;
    }, [searchedHotel]);

    const backup = useRef([]);

    const [isLoaded, setIsLoaded] = useState(true);
    const [filterData, setFilterData] = useState({});

    const fetchHotels = useCallback(async () => {
        if (!location.state) {
            return;
        }

        setIsLoaded(true);

        try {
            const response = await getHotels({
                city: location.state.destination ?? "",
                checkInDate: location.state.startDate ?? "",
                checkOutDate: location.state.endDate ?? "",
                roomType2: location.state.numOfPeople?.roomType2 ?? 0,
                roomType4: location.state.numOfPeople?.roomType4 ?? 0,
                page: currentPage,
                minPrice: filterData.minPrice || 0,
                maxPrice: filterData.maxPrice || 0,
                minRating: filterData.minRating || 0,
                minStar: filterData.minStar || 0,
                per_page: pageSize,
            });

            if (response.status_code === 200 && response.data) {
                const data = response.data;
                backup.current = data;
                setSearchedHotel(data);
                setTotalPage(response.total_pages);
                setCurrentPage(response.page);
                setTotal(response.total);
            } else {
                toast.error("Error when fetching hotels");
            }
        } catch (error) {
            console.error("Error fetching hotels:", error);
            toast.error("Error when fetching hotels");
        } finally {
            setIsLoaded(false);
        }
    }, [location.state, currentPage, filterData, pageSize]);

    // useEffect(() => {
    //     // console.log(">>> first render AfterSearch");
    //     // Cuộn lên đầu trang
    //     window.scrollTo(0, 0);

    //     if (!location.state) {
    //         return;
    //     }

    //     let data = [];

    //     const fetchHotels = async () => {
    //         setIsLoaded(true);

    //         try {
    //             const response = await getHotels({
    //                 city: location?.state?.destination ?? "",
    //                 checkInDate: location?.state?.startDate ?? "",
    //                 checkOutDate: location?.state?.endDate ?? "",
    //                 roomType2: location?.state?.numOfPeople?.roomType2 ?? 0,
    //                 roomType4: location?.state?.numOfPeople?.roomType4 ?? 0,
    //                 page: currentPage,
    //                 minPrice: filterData.minPrice || 0,
    //                 maxPrice: filterData.maxPrice || 0,
    //                 minRating: filterData.minRating || 0,
    //                 minStar: filterData.minStar || 0,
    //             });

    //             if (response.status_code === 200 && response.data) {
    //                 data = response.data;

    //                 backup.current = data;
    //                 setSearchedHotel(data);

    //                 setTotalPage((prev) => response.total_pages);
    //                 setCurrentPage((prev) => response.page);
    //             } else {
    //                 toast.error("Error when fetching hotels");
    //                 return [];
    //             }

    //             return response;
    //         } catch (error) {
    //             console.log(error);
    //             toast.error("Error when fetching hotels");
    //             return [];
    //         } finally {
    //             setIsLoaded(false);
    //         }
    //     };

    //     fetchHotels();

    //     // let data = MockRecommend.filter((hotel) => {
    //     //     return toLowerCaseNonAccentVietnamese(hotel.address).includes(
    //     //         toLowerCaseNonAccentVietnamese(location.state.destination)
    //     //     );
    //     // });

    //     // backup.current = data;
    // }, [
    //     location.state,
    //     currentPage,
    //     totalPage,
    //     filterData?.minPrice,
    //     filterData?.maxPrice,
    //     filterData?.minRating,
    //     filterData?.minStar,
    // ]);

    // console.log(">>> render AfterSearch");

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top
        fetchHotels();
    }, [fetchHotels]);

    const handleSearch = useCallback((searchData) => {
        location.state = {
            destination: searchData.destination,
            startDate: searchData.startDate,
            endDate: searchData.endDate,
            numOfPeople: searchData.numOfPeople,
        };
        fetchHotels(); // Refetch when search data changes
    }, []);

    const textToScore = {
        checkboxExcellent: 9,
        checkboxVeryGood: 8,
        checkboxGood: 7,
        checkboxPleasant: 6,
    };

    const textToStar = {
        checkboxOneStar: 1,
        checkboxTwoStar: 2,
        checkboxThreeStar: 3,
        checkboxFourStar: 4,
        checkboxFiveStar: 5,
    };

    const handleFilter = useCallback((filterData) => {
        const { price, selectedScores, selectedStars } = filterData;

        const minPrice = price?.[0] || 0;
        const maxPrice = price?.[1] || 0;

        let minRating = selectedScores
            ? Math.min(
                  ...Object.keys(selectedScores)
                      .filter((key) => selectedScores[key])
                      .map((key) => textToScore[key])
              )
            : 0;

        let minStar = selectedStars
            ? Math.min(
                  ...Object.keys(selectedStars)
                      .filter((key) => selectedStars[key])
                      .map((key) => textToStar[key])
              )
            : 0;

        if (minRating === Infinity) {
            minRating = 0;
        }

        if (minStar === Infinity) {
            minStar = 0;
        }

        setFilterData({
            minPrice,
            maxPrice,
            minRating,
            minStar,
        });
    }, []);

    return (
        <>
            <div className="after-search my-5 pb-5">
                <div className="after-search__search-bar">
                    <SearchBar
                        handleSearch={handleSearch}
                        border-radius={12}
                        searchData={location.state}
                    />
                </div>

                <div className="after-search__body mt-4">
                    <div className="row gx-4">
                        <div className="col-12 col-lg-3">
                            <div className="after-search__filter d-none d-lg-block">
                                <Filter handleFilter={handleFilter} />
                            </div>

                            <div className="d-lg-none">
                                <Collapse
                                    style={{ padding: "0", marginBottom: "1rem" }}
                                    items={[
                                        {
                                            key: "1",
                                            label: "Filter",
                                            children: (
                                                <div className="after-search__filter">
                                                    <Filter handleFilter={handleFilter} />
                                                </div>
                                            ),
                                            styles: {
                                                body: { padding: "0" },
                                            },
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-lg-9 position-relative">
                            <div className="row row-cols-1 gy-5">
                                {filteredHotels.length > 0 ? (
                                    filteredHotels.map((hotel) => (
                                        <div key={hotel.id} className="col">
                                            <HotelCard {...hotel} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col my-5">
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={<span>No hotels found</span>}
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

                            {filteredHotels.length > 0 && (
                                <div className="pagination mt-5 d-flex justify-content-center">
                                    <Pagination
                                        showQuickJumper
                                        defaultCurrent={currentPage}
                                        total={total}
                                        defaultPageSize={pageSize}
                                        pageSizeOptions={[6, 12, 18, 24]}
                                        onChange={(page, pageSize) => {
                                            console.log(page, pageSize);
                                            setCurrentPage(page);
                                            setPageSize(pageSize);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AfterSearch;
