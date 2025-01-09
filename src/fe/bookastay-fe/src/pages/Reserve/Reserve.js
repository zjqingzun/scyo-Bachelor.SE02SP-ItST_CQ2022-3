import { useEffect, useRef, useState } from "react";
import DatePicker from "rsuite/DatePicker";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

import Stepper from "~/components/Stepper/Stepper";

// (Optional) Import component styles. If you are using Less, import the `index.less` file.
import "./Reserve.scss";
import "rsuite/DatePicker/styles/index.css";

import images from "~/assets/image";
import icons from "~/assets/icon";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getHotelDetail } from "~/services/apiService";
import { useLocation } from "react-router-dom";
import { formatCheckInOutDate } from "~/utils/datetime";

const StyledStepLabel = styled.div`
    font-size: 2.8rem;
    text-align: center;
    font-weight: 600;
    color: #1a4870;
`;

const Reserve = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const userInfo = useSelector((state) => state.account.userInfo);

    const {
        hotelId,
        checkInDate,
        checkOutDate,
        roomType2,
        roomType4,
        rooms,
        sumPrice,
        type2Price,
        type4Price,
        userId,
        numberOfRoom2,
        numberOfRoom4,
    } = location.state || {};

    const [hotelDetail, setHotelDetail] = useState(null);

    useEffect(() => {
        const fetchHotelDetail = async () => {
            try {
                // console.log(hotelId, checkInDate, checkOutDate, numberOfRoom2, numberOfRoom4);

                const response = await getHotelDetail(hotelId, {
                    checkInDate,
                    checkOutDate,
                    roomType2: numberOfRoom2,
                    roomType4: numberOfRoom4,
                });

                // console.log(response.data);

                setHotelDetail(response.data);
            } catch (error) {
                toast.error("Failed to get hotel detail");
            }
        };

        fetchHotelDetail();
    }, [location.state]);

    const formik = useFormik({
        initialValues: {
            name: userInfo?.name || "",
            cccd: userInfo?.cccd || "",
            email: userInfo?.email || "",
            phone: userInfo?.phone || "",
            discount: "",
            specialRequest: "",
            arrivalTime: new Date(),
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            cccd: Yup.string().required("CCCD is required"),
            email: Yup.string()
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format")
                .required("Email is required"),
            phone: Yup.string().required("Phone number is required"),
        }),
        onSubmit: (values) => {
            persistData.current = {
                ...persistData.current,
                name: values.name,
                cccd: values.cccd,
                email: values.email,
                phone: values.phone,
                discount: values.discount,
                specialRequest: values.specialRequest,
                arrivalTime: values.arrivalTime,
            };
        },
    });

    const [paymentMethod, setPaymentMethod] = useState("momo");

    const persistData = useRef({
        name: "",
        cccd: "",
        email: "",
        phone: "",
        discount: "",
        specialRequest: "",
        arrivalTime: null,
        paymentMethod: "",
    });

    const stepsConfig = [
        {
            title: "Your selection",
        },
        {
            title: "Your details",
        },
        {
            title: "Payment details",
        },
    ];

    const [currentStep, setCurrentStep] = useState(2);
    const [isComplete, setIsComplete] = useState(false);

    const handleNext = () => {
        if (currentStep === 2) {
            formik.handleSubmit();

            if (formik.isValid && formik.dirty) {
                setCurrentStep((prevStep) => {
                    if (prevStep === stepsConfig.length) {
                        setIsComplete(true);
                        return prevStep;
                    }

                    return prevStep + 1;
                });
            }

            return;
        }

        // finish
        if (currentStep === stepsConfig.length) {
            setIsComplete(true);

            persistData.current = {
                ...persistData.current,
                paymentMethod,
            };

            console.log(persistData.current);

            return;
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const roomsInfoRef = useRef();

    const handleToggleIcon = (event) => {
        event.target.style.transform = `rotate(${
            event.target.style.transform === "rotate(-180deg)" ? "0deg" : "-180deg"
        })`;

        console.log(roomsInfoRef.current.className);

        roomsInfoRef.current.className =
            roomsInfoRef.current.className === "collapse" ? "collapse show" : "collapse";
    };

    return (
        <div className="reserve-page">
            <div className="d-none d-md-flex">
                <Stepper
                    stepsConfig={stepsConfig}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isComplete={isComplete}
                    setIsComplete={setIsComplete}
                />
            </div>

            <div className="d-md-none">
                {currentStep === 2 && <StyledStepLabel>{stepsConfig[1].title}</StyledStepLabel>}
                {currentStep === 3 && <StyledStepLabel>{stepsConfig[2].title}</StyledStepLabel>}
            </div>

            <div className="reserve-page__content">
                <div className="row gy-4 gx-2 gx-lg-3">
                    <div className="col-md-6 col-lg-7">
                        <div className="reserve-container">
                            {currentStep === 2 && (
                                <>
                                    {/* <h2>Enter your details</h2> */}
                                    <h2>{t("reserve.detailHeader")}</h2>

                                    <form className="mt-5" onSubmit={formik.handleSubmit}>
                                        <div className="row row-cols-1 row-cols-lg-2">
                                            <div className="col">
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="reserveFirstNameInput"
                                                        className="form-label"
                                                    >
                                                        {t("reserve.name")}:{" "}
                                                        <span className="red-dot">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        className={`form-control form-control-lg fs-4  ${
                                                            formik.errors.name &&
                                                            formik.touched.name
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        id="reserveFirstNameInput"
                                                        placeholder="Enter your name"
                                                    />
                                                    <div className="invalid-feedback">
                                                        {formik.errors.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="reserveLastNameInput"
                                                        className="form-label"
                                                    >
                                                        {t("reserve.identityNumber")}:{" "}
                                                        <span className="red-dot">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formik.values.cccd}
                                                        onChange={formik.handleChange}
                                                        className={`form-control form-control-lg fs-4  ${
                                                            formik.errors.cccd &&
                                                            formik.touched.cccd
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        id="reserveLastNameInput"
                                                        placeholder="Enter your cccd"
                                                    />
                                                    <div className="invalid-feedback">
                                                        {formik.errors.cccd}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                htmlFor="reserveEmailInput"
                                                className="form-label"
                                            >
                                                {t("reserve.email")}:{" "}
                                                <span className="red-dot">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                className={`form-control form-control-lg fs-4  ${
                                                    formik.errors.email && formik.touched.email
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                id="reserveEmailInput"
                                                placeholder="Enter your email"
                                            />
                                            <div className="invalid-feedback">
                                                {formik.errors.email}
                                            </div>
                                        </div>

                                        <div className="row row-cols-1 row-cols-lg-2">
                                            <div className="col">
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="reservePhoneInput"
                                                        className="form-label"
                                                    >
                                                        {t("reserve.phone")}:{" "}
                                                        <span className="red-dot">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={formik.values.phone}
                                                        onChange={formik.handleChange}
                                                        className={`form-control form-control-lg fs-4  ${
                                                            formik.errors.phone &&
                                                            formik.touched.phone
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        id="reservePhoneInput"
                                                        placeholder="Enter your phone number"
                                                    />
                                                    <div className="invalid-feedback">
                                                        {formik.errors.phone}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col">
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="reserveDiscountInput"
                                                        className="form-label"
                                                    >
                                                        Discount (optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="discount"
                                                        value={formik.values.discount}
                                                        onChange={formik.handleChange}
                                                        className={`form-control form-control-lg fs-4 `}
                                                        id="reserveDiscountInput"
                                                        placeholder="Enter your discount code"
                                                    />
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                id="flexCheckDefault"
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="flexCheckDefault"
                                            >
                                                Agree to our privacy
                                            </label>
                                        </div> */}

                                        <div className="separate"></div>

                                        <div className="mb-5">
                                            <label
                                                className="form-label"
                                                htmlFor="reserveSpecialRequestTextarea"
                                            >
                                                {t("reserve.specialRequests")}:
                                            </label>
                                            <textarea
                                                className="form-control fs-4 "
                                                placeholder="Enter your special request"
                                                id="reserveSpecialRequestTextarea"
                                                value={formik.values.specialRequest}
                                                onChange={formik.handleChange}
                                                name="specialRequest"
                                            ></textarea>
                                        </div>

                                        {/* <div className="row row-cols-2">
                                            <div className="col">
                                                <label className="form-label">
                                                    Your estimated arrival time (optional):
                                                </label>
                                                <DatePicker
                                                    value={formik.values.arrivalTime}
                                                    format="MM/dd/yyyy HH:mm"
                                                    size="lg"
                                                    locale={{
                                                        sunday: `${t("calendar.sunday")}`,
                                                        monday: `${t("calendar.monday")}`,
                                                        tuesday: `${t("calendar.tuesday")}`,
                                                        wednesday: `${t("calendar.wednesday")}`,
                                                        thursday: `${t("calendar.thursday")}`,
                                                        friday: `${t("calendar.friday")}`,
                                                        saturday: `${t("calendar.saturday")}`,
                                                        ok: `${t("calendar.ok")}`,
                                                        today: `${t("calendar.today")}`,
                                                        yesterday: `${t("calendar.yesterday")}`,
                                                        hours: `${t("calendar.hours")}`,
                                                        minutes: `${t("calendar.minutes")}`,
                                                        seconds: `${t("calendar.seconds")}`,
                                                    }}
                                                    style={{ width: "100%" }}
                                                />
                                            </div>
                                        </div> */}
                                    </form>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <h2>{t("reserve.paymentHeader")}</h2>

                                    <div className="mt-5">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="momoMethod"
                                                    value="momo"
                                                    onChange={(event) =>
                                                        setPaymentMethod(event.target.value)
                                                    }
                                                />
                                                <label
                                                    className="form-check-label ms-5"
                                                    htmlFor="momoMethod"
                                                >
                                                    Momo
                                                </label>
                                            </div>

                                            <img width={80} src={images.momoIcon} alt="" />
                                        </div>

                                        <div className="separate"></div>

                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="cashMethod"
                                                    value="cash"
                                                    onChange={(event) =>
                                                        setPaymentMethod(event.target.value)
                                                    }
                                                />
                                                <label
                                                    className="form-check-label ms-5"
                                                    htmlFor="cashMethod"
                                                >
                                                    {t("reserve.cash")}
                                                </label>
                                            </div>

                                            <img width={80} src={images.cashIcon} alt="" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Action */}
                            <div className="mt-5 d-flex justify-content-between">
                                <button
                                    {...(currentStep === 2 ? { disabled: true } : null)}
                                    className="btn btn-secondary btn-lg fs-3 px-4"
                                    style={{ background: "#227B94" }}
                                    onClick={() => handlePrev()}
                                >
                                    {t("reserve.back")}
                                </button>

                                {!isComplete && (
                                    <button
                                        className="btn btn-success btn-lg fs-3 px-4"
                                        style={{ background: "#227B94" }}
                                        onClick={() => handleNext()}
                                    >
                                        {currentStep === stepsConfig.length
                                            ? t("reserve.finish")
                                            : t("reserve.next")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-5">
                        <div className="row row-cols-1 gy-4">
                            <div className="col">
                                <div className="reserve-container">
                                    <h3>{t("reserve.bookingHeader")}</h3>

                                    <div className="separate my-4 mx-0"></div>

                                    {/* Hotel info */}
                                    <div>
                                        <div className="d-flex align-items-center gap-4 mb-1">
                                            <span className="fw-lighter">{t("reserve.hotel")}</span>
                                            <div className="d-flex gap-1">
                                                {[...Array(hotelDetail?.star ?? 0)].map(
                                                    (_, index) => (
                                                        <img
                                                            style={{ width: 20 }}
                                                            key={index}
                                                            src={icons.yellowStarIcon}
                                                            alt="star"
                                                            className="hotel-card__star-icon"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <h2>{hotelDetail?.name}</h2>
                                        <p className="fw-light mt-3">{hotelDetail?.address}</p>
                                    </div>
                                    {/* Detail */}
                                    <div>
                                        <div className="d-flex mt-4">
                                            <div>
                                                <span>Check-in</span>
                                                <h4 className="mt-2 fs-3 fw-bold">
                                                    {formatCheckInOutDate(
                                                        checkInDate,
                                                        localStorage.getItem("i18nextLng")
                                                    )}
                                                </h4>
                                            </div>

                                            <div className="separate--vertical"></div>

                                            <div>
                                                <span>Check-out</span>
                                                <h4 className="mt-2 fs-3 fw-bold">
                                                    {formatCheckInOutDate(
                                                        checkOutDate,
                                                        localStorage.getItem("i18nextLng")
                                                    )}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="separate mx-0 mt-5 mb-4"></div>
                                    {/* Room */}
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <span className="fs-4  fw-medium">
                                                    {t("reserve.yourChoice")}
                                                </span>
                                                <p className="fs-3 fw-bold">
                                                    3 {t("reserve.rooms")}
                                                </p>
                                            </div>

                                            <button>
                                                <img
                                                    style={{
                                                        width: 20,
                                                        transition: "transform 0.5s",
                                                    }}
                                                    src={icons.chevronDownIcon}
                                                    alt="chevron-down"
                                                    onClick={(event) => handleToggleIcon(event)}
                                                />
                                            </button>
                                        </div>

                                        <div
                                            className="collapse"
                                            ref={(ref) => (roomsInfoRef.current = ref)}
                                        >
                                            <p className="fw-medium">1 x Phòng Giường Đôi</p>
                                            <p className="fw-medium">2 x Phòng Giường Đơn</p>
                                        </div>
                                    </div>
                                    <a href="#!">
                                        <span className="reserve-page__change">
                                            {t("reserve.changeYourChoice")}
                                        </span>
                                    </a>
                                </div>
                            </div>

                            <div className="col">
                                <div className="reserve-container">
                                    <h3>{t("reserve.summaryHeader")}</h3>

                                    <div className="separate mx-0 my-3"></div>

                                    <div className="d-flex justify-content-between">
                                        <span>{t("reserve.originalPrice")}</span>
                                        <span className="ms-3">540,000VND</span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <span>{t("reserve.discount")}</span>
                                        <span className="ms-3">-40,000VND</span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-5 fs-4  fw-bold">
                                        <span>{t("reserve.totalPrice")}</span>
                                        <span className="ms-3">500,000VND</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reserve;
