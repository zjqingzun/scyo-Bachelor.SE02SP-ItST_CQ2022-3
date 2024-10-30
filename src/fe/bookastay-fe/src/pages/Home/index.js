import { useState, useEffect } from "react";

import "./Home.scss";

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

const Home = () => {
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

    // autoslide, clearInterval = een cleanup functie noodzakelijk bij interval
    useEffect(() => {
        let slider = setInterval(() => {
            setIndex(index + 1);
        }, 5000);
        return () => clearInterval(slider);
    }, [index]);

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
            </div>
        </section>
    );
};

export default Home;
