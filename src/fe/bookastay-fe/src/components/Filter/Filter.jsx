import { useEffect, useRef, useState } from "react";
import RangeSlider from "react-range-slider-input";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "react-range-slider-input/dist/style.css";

import { convertCurrency, formatCurrency } from "~/utils/currencyUtils";
import { useDebounce } from "~/hooks";
// import geocodeAddress from "~/utils/geocodeAddress";

import "./Filter.scss";

const Filter = (props) => {
    const { t } = useTranslation();
    const currency = useSelector((state) => state.currency.currency);
    const baseCurrency = useSelector((state) => state.currency.baseCurrency);
    const exchangeRate = useSelector((state) => state.currency.exchangeRate);

    const nowCurrency = useRef("VND");

    const [priceToShow, setPriceToShow] = useState([0, 0]);

    const [rangePrice, setRangePrice] = useState([0, 5000000]);

    const handlePriceInput = (event) => {
        // setPrice((prev) => [...event]);

        setPriceToShow((prev) => [...event]);

        // props.handleFilter({
        //     price,
        //     selectedScores,
        //     selectedStars,
        // });
    };

    // Tạo state để quản lý các checkbox
    const [selectedScores, setSelectedScores] = useState({
        checkboxExcellent: false,
        checkboxVeryGood: false,
        checkboxGood: false,
        checkboxPleasant: false,
    });

    // Hàm xử lý thay đổi checkbox
    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setSelectedScores((prev) => ({
            ...prev,
            [id]: checked,
        }));

        // Gọi hàm filter ở component cha
        // props.handleFilter({
        //     price,
        //     selectedScores,
        //     selectedStars,
        // });
    };

    const [selectedStars, setSelectedStars] = useState({
        checkboxFiveStar: false,
        checkboxFourStar: false,
        checkboxThreeStar: false,
        checkboxTwoStar: false,
        checkboxOneStar: false,
    });

    const handleStarCheckboxChange = (event) => {
        const { id, checked } = event.target;

        setSelectedStars((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const debouncedPrice = useDebounce(priceToShow, 200);
    const debouncedSelectedScores = useDebounce(selectedScores, 200);
    const debouncedSelectedStars = useDebounce(selectedStars, 200);

    useEffect(() => {
        const dataPrice = [
            Math.round(convertCurrency(priceToShow[0], currency, "VND", exchangeRate)),
            Math.round(convertCurrency(priceToShow[1], currency, "VND", exchangeRate)),
        ];

        console.log(">>> data", dataPrice);

        props.handleFilter({
            price: dataPrice,
            selectedScores: selectedScores,
            selectedStars: selectedStars,
        });
    }, [debouncedPrice, debouncedSelectedScores, debouncedSelectedStars]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await geocodeAddress("Phuoc Thuan, Xuyen Moc, Ba Ria - Vung Tau");
    //         // console.log(data);
    //     };

    //     fetchData();
    // }, []);

    const handleChangeCurrency = () => {
        if (currency !== nowCurrency.current) {
            setPriceToShow((prev) => [
                ...[
                    convertCurrency(prev[0], baseCurrency, currency, exchangeRate),
                    convertCurrency(prev[1], baseCurrency, currency, exchangeRate),
                ],
            ]);

            if (currency === "VND") {
                setRangePrice((prev) => [...[0, 5000000]]);
            } else {
                setRangePrice((prev) => [
                    ...[
                        convertCurrency(prev[0], baseCurrency, currency, exchangeRate),
                        convertCurrency(prev[1], baseCurrency, currency, exchangeRate),
                    ],
                ]);
            }

            nowCurrency.current = currency;
        }
    };

    useEffect(() => {
        handleChangeCurrency();
    }, [currency]);

    return (
        <div className="filter-container">
            <h3 className="filter__heading text-center fs-1">{t("filter.filter")}</h3>

            <div className="separate"></div>

            <div className="fitter__group d-flex flex-column">
                <span className="filter__title fs-3 fw-semibold">{t("filter.price")}</span>
                <span className="filter__text fs-5 mb-5">
                    {formatCurrency(priceToShow[0], currency)} -{" "}
                    {formatCurrency(priceToShow[1], currency)}+
                </span>
                <RangeSlider
                    min={rangePrice[0]}
                    max={rangePrice[1]}
                    value={priceToShow}
                    onInput={(event) => handlePriceInput(event)}
                />
            </div>

            <div className="separate"></div>

            <div className="filter__group">
                <span className="filter__title fs-3 fw-semibold">
                    {t("filter.reviewScore.title")}
                </span>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedScores.checkboxExcellent}
                        id="checkboxExcellent"
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="checkboxExcellent">
                        {t("filter.reviewScore.excellent")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedScores.checkboxVeryGood}
                        onChange={handleCheckboxChange}
                        id="checkboxVeryGood"
                    />
                    <label className="form-check-label" htmlFor="checkboxVeryGood">
                        {t("filter.reviewScore.veryGood")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedScores.checkboxGood}
                        onChange={handleCheckboxChange}
                        id="checkboxGood"
                    />
                    <label className="form-check-label" htmlFor="checkboxGood">
                        {t("filter.reviewScore.good")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedScores.checkboxPleasant}
                        onChange={handleCheckboxChange}
                        id="checkboxPleasant"
                    />
                    <label className="form-check-label" htmlFor="checkboxPleasant">
                        {t("filter.reviewScore.pleasant")}
                    </label>
                </div>
            </div>

            <div className="separate"></div>

            <div className="filter__group">
                <span className="filter__title fs-3 fw-semibold">
                    {t("filter.starRating.title")}
                </span>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedStars.checkboxFiveStar}
                        onChange={handleStarCheckboxChange}
                        id="checkboxFiveStar"
                    />
                    <label className="form-check-label" htmlFor="checkboxFiveStar">
                        {t("filter.starRating.5stars")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedStars.checkFourStar}
                        onChange={handleStarCheckboxChange}
                        id="checkboxFourStar"
                    />
                    <label className="form-check-label" htmlFor="checkboxFourStar">
                        {t("filter.starRating.4stars")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedStars.checkThreeStar}
                        onChange={handleStarCheckboxChange}
                        id="checkboxThreeStar"
                    />
                    <label className="form-check-label" htmlFor="checkboxThreeStar">
                        {t("filter.starRating.3stars")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedStars.checkboxTwoStar}
                        onChange={handleStarCheckboxChange}
                        id="checkboxTwoStar"
                    />
                    <label className="form-check-label" htmlFor="checkboxTwoStar">
                        {t("filter.starRating.2stars")}
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedStars.checkboxOneStar}
                        onChange={handleStarCheckboxChange}
                        id="checkboxOneStar"
                    />
                    <label className="form-check-label" htmlFor="checkboxOneStar">
                        {t("filter.starRating.1star")}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Filter;
