import { useState, useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";

import "./Home.scss";
import SearchBar from "../../components/SearchBar";
import HotelCard from "../../components/HotelCard";

const MockData = [
    {
        id: 1,
        url: "https://kinsley.bslthemes.com/wp-content/uploads/2021/08/img-banner-2-scaled-1-1920x1315.jpg",
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const MockDestination = [
    {
        id: 1,
        title: "Ho Chi Minh City",
        url: "https://plus.unsplash.com/premium_photo-1663050967225-1735152ab894?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 2,
        title: "Hanoi",
        url: "https://plus.unsplash.com/premium_photo-1691960159290-6f4ace6e6c4c?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 3,
        title: "Da Nang",
        url: "https://images.unsplash.com/photo-1670993077545-bfeeea1e0b5f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        title: "Vung Tau",
        url: "https://images.unsplash.com/photo-1707827547063-1fff65d22682?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 5,
        title: "Da Lat",
        url: "https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const MockRecommend = [
    {
        id: 1,
        name: "The Grand Ho Tram Strip",
        address: "Phuoc Thuan, Xuyen Moc, Ba Ria - Vung Tau",
        image: "https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 3877530,
        rating: 9.5,
        review: 100,
    },
    {
        id: 2,
        name: "Jan Hostel Central Point",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/square600/458830113.webp?k=ff0cb97b7983f09e099de3260a9553fa2a4d0582323e0a962b52cf67ffc2b38f&o=",
        price: 3948613,
        rating: 9.0,
        review: 50,
    },
    {
        id: 3,
        name: "HANZ 345 Business Suite Grand Residence",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/square600/586909150.webp?k=422e9c17817cd27de89aaa113a1711a3b23151c8f13919aa1dc08a970b70cf97&o=",
        price: 2660000,
        rating: 9.3,
        review: 80,
    },
    {
        id: 4,
        name: "Apina Saigon - Truong Dinh",
        address: "Quận 1, TP. Hồ Chí Minh",
        image: "https://cf.bstatic.com/xdata/images/hotel/square600/596644761.webp?k=e146b7295510455911929c4fc7e26ea69228075e46195df169989d59705c6db1&o=",
        price: 4288680,
        rating: 9.5,
        review: 100,
    },
];

const Home = () => {
    const { t } = useTranslation();

    const [images, setImages] = useState(MockData);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const lastIndex = images.length - 1;
        if (index < 0) {
            setIndex(lastIndex);
        }
        if (index > lastIndex) {
            setIndex(0);
        }
    }, [index, images]);

    useEffect(() => {
        let slider = setInterval(() => {
            setIndex(index + 1);
        }, 10000);
        return () => clearInterval(slider);
    }, [index]);

    const listRef = useRef(null);
    const itemPerView = 3;

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    useEffect(() => {
        if (MockRecommend.length <= itemPerView) {
            setIsAtEnd(true);
            setIsAtStart(true);
        }
    }, []);

    const handlePrev = () => {
        const gap = getComputedStyle(listRef.current).gap.replace("px", "") * 1;

        const scrollWidth =
            (listRef.current.offsetWidth - gap * (itemPerView - 1)) / itemPerView + gap;
        listRef.current.scrollLeft -=
            (listRef.current.offsetWidth - gap * (itemPerView - 1)) / itemPerView + gap;

        if (Math.ceil(listRef.current.scrollLeft) == Math.ceil(scrollWidth)) {
            setIsAtStart(true);
        }

        if (
            Math.ceil(listRef.current.scrollLeft) <=
            Math.ceil((MockRecommend.length - itemPerView) * scrollWidth)
        ) {
            setIsAtEnd(false);
        }
    };

    const handleNext = () => {
        const gap = getComputedStyle(listRef.current).gap.replace("px", "") * 1;

        const scrollWidth =
            (listRef.current.offsetWidth - gap * (itemPerView - 1)) / itemPerView + gap;

        listRef.current.scrollLeft += scrollWidth;

        if (listRef.current.scrollLeft >= 0) {
            setIsAtStart(false);
        }

        if (
            Math.ceil(listRef.current.scrollLeft) >=
            Math.ceil((MockRecommend.length - itemPerView - 1) * scrollWidth)
        ) {
            setIsAtEnd(true);
        }
    };

    return (
        <section className="homepage">
            <div className="homepage__top">
                <div className="homepage__slider">
                    {images &&
                        images.length > 0 &&
                        images.map((image, imageIndex) => {
                            let position = "nextSlide";
                            if (imageIndex === index) {
                                position = "activeSlide";
                            }
                            if (
                                imageIndex === index - 1 ||
                                (index === 0 && imageIndex === images.length - 1)
                            ) {
                                position = "lastSlide";
                            }

                            return (
                                <div
                                    key={`image-${imageIndex}`}
                                    className={`homepage__slider-image-wrap ${position}`}
                                >
                                    <img
                                        className="homepage__slider-image"
                                        src={image.url}
                                        alt={`image-${imageIndex}`}
                                    />
                                </div>
                            );
                        })}
                    <div className="homepage__slider-overlay"></div>

                    <div className="homepage__slider-nav">
                        {images &&
                            images.length > 0 &&
                            images.map((image, i) => (
                                <span
                                    key={i}
                                    className={`homepage__slider-nav-item ${
                                        index === i ? "homepage__slider-nav-item--active" : ""
                                    }`}
                                    onClick={() => setIndex(i)}
                                ></span>
                            ))}
                    </div>

                    <h1 className="homepage__title">
                        No matter where you’re going to, we’ll take you there
                    </h1>
                </div>
                <div className="homepage__search-bar">
                    <SearchBar border-radius={12} />
                </div>
            </div>

            <div className="homepage__top-destination">
                <h2 className="homepage__top-destination-title">{t("homepage.topDestinations")}</h2>

                <div className="homepage__top-destination-list">
                    {MockDestination &&
                        MockDestination.length > 0 &&
                        MockDestination.map((destination, index) => {
                            return (
                                <a href="#!" key={destination.id} className="destination-item">
                                    <img
                                        className="destination-item__image"
                                        src={destination.url}
                                        alt={destination.title}
                                    />
                                    <h3 className="destination-item__title">{destination.title}</h3>
                                </a>
                            );
                        })}
                </div>
            </div>

            <div className="homepage__recommend">
                <h2 className="homepage__recommend-title">{t("homepage.recommendedForYou")}</h2>

                <div className="homepage__recommend-list-wrap">
                    <div className="homepage__recommend-list" ref={listRef}>
                        {MockRecommend &&
                            MockRecommend.length > 0 &&
                            MockRecommend.map((hotel, index) => {
                                return (
                                    <div
                                        key={`recommend-${hotel.id}`}
                                        className="homepage__recommend-item"
                                    >
                                        <HotelCard {...hotel} />
                                    </div>
                                );
                            })}
                    </div>
                    <div className="homepage__recommend-list-actions">
                        <button
                            className={`homepage__recommend-btn ${isAtStart ? "hide" : ""}`}
                            onClick={() => handlePrev()}
                        >
                            <svg
                                className="homepage__recommend-btn-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                            >
                                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                            </svg>
                        </button>
                        <button
                            className={`homepage__recommend-btn ${isAtEnd ? "hide" : ""}`}
                            onClick={() => handleNext()}
                        >
                            <svg
                                className="homepage__recommend-btn-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                            >
                                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="homepage__subscribe">
                <div className="homepage__subscribe-left">
                    <h2 className="homepage__subscribe-title">Subscribe our newsletter</h2>
                    <p className="homepage__subscribe-desc">
                        Reciev latest news, update, and many other things every week.{" "}
                    </p>

                    <div className="homepage__subscribe-input-group">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="homepage__subscribe-input"
                        />
                        <button className="homepage__subscribe-btn">
                            <svg
                                className="homepage__subscribe-btn-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                            </svg>
                        </button>
                    </div>

                    <svg
                        className="homepage__subscribe-decor"
                        width="67"
                        height="77"
                        viewBox="0 0 67 77"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M66.1051 0L66.1051 76.2102L0.105118 38.1051L66.1051 0Z"
                            fill="#BFA82D"
                        />
                    </svg>
                    <svg
                        className="homepage__subscribe-decor"
                        width="62"
                        height="31"
                        viewBox="0 0 62 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M62 31C62 22.7783 58.7339 14.8933 52.9203 9.07969C47.1067 3.26606 39.2217 6.20722e-07 31 0C22.7783 -6.20722e-07 14.8933 3.26606 9.07969 9.07969C3.26606 14.8933 1.24144e-06 22.7783 0 31L31 31H62Z"
                            fill="#F1D84E"
                        />
                    </svg>
                </div>
                <div className="homepage__subscribe-right">
                    <img
                        className="homepage__subscribe-image"
                        src="https://plus.unsplash.com/premium_photo-1679768606018-7ac0b7583957?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                    />
                </div>
            </div>
        </section>
    );
};

export default Home;
