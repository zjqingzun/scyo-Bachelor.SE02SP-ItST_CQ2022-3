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
import { useSelector } from "react-redux";

const AfterSearch = () => {
    const location = useLocation();

    const userInfo = useSelector((state) => state.account.userInfo);

    const [searchedHotel, setSearchedHotel] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalPage, setTotalPage] = useState(0);
    const [total, setTotal] = useState(0);

    const [searchData, setSearchData] = useState({
        destination: sessionStorage.getItem("searchData")
            ? JSON.parse(sessionStorage.getItem("searchData")).destination
            : location.state?.destination ?? "",
        startDate: sessionStorage.getItem("searchData")
            ? JSON.parse(sessionStorage.getItem("searchData")).startDate
            : location.state?.startDate ?? "",
        endDate: sessionStorage.getItem("searchData")
            ? JSON.parse(sessionStorage.getItem("searchData")).endDate
            : location.state?.endDate ?? "",
        numOfPeople: sessionStorage.getItem("searchData")
            ? JSON.parse(sessionStorage.getItem("searchData")).numOfPeople
            : location.state?.numOfPeople ?? {
                  roomType2: location.state?.numOfPeople?.roomType2 ?? 0,
                  roomType4: location.state?.numOfPeople?.roomType4 ?? 0,
              },
    });

    const filteredHotels = useMemo(() => {
        if (!searchedHotel?.length) return [];
        return searchedHotel;
    }, [searchedHotel]);

    const backup = useRef([]);

    const [isLoaded, setIsLoaded] = useState(true);
    const [filterData, setFilterData] = useState({});

    const isFirstMount = useRef(true);
    const isFetching = useRef(false);

    const fetchHotels = useCallback(async () => {
        if (!location.state || isFetching.current) {
            return;
        }

        isFetching.current = true;
        setIsLoaded(true);

        try {
            console.log("Search data:", searchData);

            const response = await getHotels(
                {
                    city: searchData.destination || location.state.destination || "",
                    checkInDate: searchData.checkInDate || location.state.startDate || "",
                    checkOutDate: searchData.checkOutDate || location.state.endDate || "",
                    roomType2: searchData.roomType2 || location.state.numOfPeople?.roomType2 || 0,
                    roomType4: searchData.roomType4 || location.state.numOfPeople?.roomType4 || 0,
                    page: currentPage,
                    minPrice: filterData.minPrice || 0,
                    maxPrice: filterData.maxPrice || 0,
                    minRating: filterData.minRating || 0,
                    minStar: filterData.minStar || [1, 2, 3, 4, 5],
                    per_page: pageSize,
                },
                userInfo.id
            );

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
            isFetching.current = false;
            if (isFirstMount.current) {
                isFirstMount.current = false;
            }
        }
    }, [location.state, currentPage, filterData, pageSize, searchData, userInfo.id]);

    useEffect(() => {
        console.log("Location state:", location.state);

        if (isFirstMount.current) {
            window.scrollTo(0, 0); // Scroll to top
            fetchHotels();
            isFirstMount.current = false;
        }

        return () => {
            // cleanup session storage
            sessionStorage.removeItem("searchData");
        };
    }, []);

    useEffect(() => {
        if (!isFirstMount.current) {
            window.scrollTo(0, 0);
            fetchHotels();
        }
    }, [filterData, currentPage, pageSize]);

    const handleSearch = useCallback((searchData) => {
        // console.log("Search data:", searchData);

        // save to session storage
        sessionStorage.setItem("searchData", JSON.stringify(searchData));

        setSearchData((prev) => ({
            ...prev,
            ...searchData,
        }));
    }, []);

    useEffect(() => {
        if (searchData) {
            window.scrollTo(0, 0);
            fetchHotels();
        }
    }, [searchData]);

    const handlePaginationChange = useCallback((page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
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

        let starArrayNumber = Object.keys(selectedStars)
            .filter((key) => selectedStars[key])
            .map((key) => textToStar[key]);

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
            minStar: starArrayNumber.length > 0 ? starArrayNumber : [1, 2, 3, 4, 5],
        });
    }, []);

    return (
        <>
            <div className="after-search my-5 pb-5">
                <div className="after-search__search-bar">
                    <SearchBar
                        handleSearch={handleSearch}
                        border-radius={12}
                        searchData={searchData || location.state}
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
                                            <HotelCard
                                                {...hotel}
                                                checkInDate={
                                                    searchData?.startDate ||
                                                    location.state.startDate
                                                }
                                                checkOutDate={
                                                    searchData?.endDate || location.state.endDate
                                                }
                                                numOfPeople={
                                                    searchData?.numOfPeople ||
                                                    location.state.numOfPeople
                                                }
                                            />
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
                                            handlePaginationChange(page, pageSize);
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
