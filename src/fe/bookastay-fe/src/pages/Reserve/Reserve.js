import { useEffect, useRef, useState } from "react";
import DatePicker from "rsuite/DatePicker";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Button, Result } from "antd";
import * as Yup from "yup";

import Stepper from "~/components/Stepper/Stepper";

// (Optional) Import component styles. If you are using Less, import the `index.less` file.
import "./Reserve.scss";
import "rsuite/DatePicker/styles/index.css";

import images from "~/assets/image";
import icons from "~/assets/icon";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
    checkTimeBooking,
    deleteCookie,
    getBookingInfo,
    getHotelDetail,
    paymentBooking,
    postBookingInfo,
} from "~/services/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCheckInOutDate, formatDate } from "~/utils/datetime";

const StyledStepLabel = styled.div`
    font-size: 2.8rem;
    text-align: center;
    font-weight: 600;
    color: #1a4870;
`;

const Reserve = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
        tempInfo,
    } = location.state || {};

    const [hotelDetail, setHotelDetail] = useState(null);
    const [bookingInfo, setBookingInfo] = useState(null);

    useEffect(() => {
        const fetchBookingInfo = async () => {
            try {
                const response = await getBookingInfo();
                console.log(">>> response", response);

                if (response) {
                    setBookingInfo(response.data);
                }
            } catch (error) {
                toast.error("Failed to get booking information");
            }
        };
        if (location.state && location.state.isReturn) {
            fetchBookingInfo();
        }
    }, []);

    const searchParams = new URLSearchParams(location.search);

    const partnerCode = searchParams.get("partnerCode");
    const orderId = searchParams.get("orderId");
    const requestId = searchParams.get("requestId");
    const amount = searchParams.get("amount");
    const orderInfo = searchParams.get("orderInfo");
    const transId = searchParams.get("transId");
    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");
    const payType = searchParams.get("payType");
    const responseTime = searchParams.get("responseTime");
    const extraData = searchParams.get("extraData");
    const signature = searchParams.get("signature");

    const [isFinishCashPayment, setIsFinishCashPayment] = useState(false);

    // Xử lý logic sau khi nhận kết quả thanh toán
    useEffect(() => {
        if (resultCode) {
            console.log("Payment result:", {
                partnerCode,
                orderId,
                requestId,
                amount,
                orderInfo,
                transId,
                resultCode,
                message,
                payType,
                responseTime,
                extraData,
                signature,
            });

            if (resultCode === "0") {
                clearInterval(intervalIdRef.current);

                console.log("Payment successful:", {
                    partnerCode,
                    orderId,
                    amount,
                    transId,
                    message,
                });

                const clearCookie = async () => {
                    try {
                        const res = await deleteCookie();
                    } catch (error) {
                        console.error("Failed to delete cookie:", error);
                    }
                };

                clearCookie();

                // Hiển thị thông báo thành công
                toast.success("Payment successful!");
            } else {
                console.error("Payment failed:", {
                    resultCode,
                    message,
                });
                // Hiển thị thông báo lỗi
                toast.error(`Payment failed: ${message}`);
            }
        }

        // clear cookie
        return () => {
            const clearCookie = async () => {
                try {
                    const res = await deleteCookie();
                } catch (error) {
                    console.error("Failed to delete cookie:", error);
                }
            };

            // clearCookie();
        };
    }, [resultCode]);

    const intervalIdRef = useRef(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (resultCode === "0" || isFinishCashPayment) {
                return false;
            }
            try {
                const response = await checkTimeBooking(); // Gọi API
                console.log(">>> response", response);

                if (
                    response &&
                    +response.status_code === 403 &&
                    resultCode !== "0" &&
                    !isFinishCashPayment
                ) {
                    toast.error("Booking time is expired");
                    navigate(`/hotel/${hotelId}`, {
                        state: {
                            checkInDate: formatDate(checkInDate, "yyyy-mm-dd"),
                            checkOutDate: formatDate(checkOutDate, "yyyy-mm-dd"),
                            roomType2,
                            roomType4,
                            rooms,
                            sumPrice,
                            type2Price,
                            type4Price,
                            userId,
                            numberOfRoom2,
                            numberOfRoom4,
                        },
                    });

                    return true;
                }
            } catch (error) {
                toast.error("Failed to check availability");

                return false;
            }
        };

        fetchAvailability();

        intervalIdRef.current = setInterval(async () => {
            const res = await fetchAvailability();

            if (res === false) {
                clearInterval(intervalIdRef.current);
            }
        }, 1000 * 30); // Gọi API mỗi 30 giây

        return () => {
            clearInterval(intervalIdRef.current);

            const clearCookie = async () => {
                try {
                    const res = await deleteCookie();
                } catch (error) {
                    console.error("Failed to delete cookie:", error);
                }
            };

            // clearCookie();
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            name: userInfo?.name || "",
            cccd: userInfo?.cccd || "",
            email: userInfo?.email || "",
            phone: userInfo?.phone || "",
            specialRequest: "",
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
            title: t("reserve.stepTitle.step1"),
        },
        {
            title: t("reserve.stepTitle.step2"),
        },
        {
            title: t("reserve.stepTitle.step3"),
        },
    ];

    const [currentStep, setCurrentStep] = useState(2);
    const [isComplete, setIsComplete] = useState(false);

    const handleNext = async () => {
        if (currentStep === 2) {
            formik.handleSubmit();

            formik.setTouched({
                name: true,
                cccd: true,
                email: true,
                phone: true,
                specialRequest: true,
            });

            if (formik.isValid) {
                setCurrentStep((prevStep) => {
                    if (prevStep === stepsConfig.length) {
                        setIsComplete(true);
                        return prevStep;
                    }

                    return prevStep + 1;
                });
            }

            try {
                const res = await postBookingInfo(formik.values.specialRequest);
                console.log(">>> res", res);
            } catch (error) {
                console.log(">>> error", error);
                toast.error("Failed to post booking info");
            }

            return;
        }

        // finish
        if (currentStep === stepsConfig.length) {
            try {
                const res = await paymentBooking(paymentMethod);

                console.log(">>> res", res);

                if (paymentMethod === "momo" && res.paymentUrl) {
                    // open in current tab
                    window.open(res.paymentUrl, "_self");
                } else {
                    if (+res.status_code === 200) {
                        clearInterval(intervalIdRef.current);
                        toast.success("Payment successful!");
                        setIsFinishCashPayment(true);
                    }
                }
            } catch (error) {
                console.log(">>> error", error);
                toast.error("Failed to payment booking");
            }

            // setIsComplete(true);

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

    if ((resultCode && resultCode === "0") || isFinishCashPayment) {
        return (
            <Result
                status="success"
                title="Successfully Purchased!"
                subTitle={paymentMethod === "momo" ? "Order number: " + orderId : ""}
                extra={[
                    <Button
                        type="primary"
                        key="console"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Go Homepage
                    </Button>,
                    // <Button key="buy">Buy Again</Button>,
                ]}
            />
        );
    } else if (resultCode && resultCode !== "0") {
        return (
            <Result
                status="error"
                title="Payment failed"
                subTitle={`Order number: ${orderId}`}
                extra={[
                    <Button type="primary" key="console" onClick={() => navigate("/")}>
                        Go Homepage
                    </Button>,
                    // <Button key="buy">Buy Again</Button>,
                ]}
            />
        );
    }

    return (
        <>
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
                                                            name="name"
                                                            disabled
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
                                                            name="cccd"
                                                            disabled
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
                                                    disabled
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
                                                            disabled
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
                                                <span className="fw-lighter">
                                                    {t("reserve.hotel")}
                                                </span>
                                                <div className="d-flex gap-1">
                                                    {[
                                                        ...Array(
                                                            hotelDetail?.star ||
                                                                bookingInfo?.hotel?.star ||
                                                                0
                                                        ),
                                                    ].map((_, index) => (
                                                        <img
                                                            style={{ width: 20 }}
                                                            key={index}
                                                            src={icons.yellowStarIcon}
                                                            alt="star"
                                                            className="hotel-card__star-icon"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <h2>{hotelDetail?.name || bookingInfo?.hotel?.name}</h2>
                                            <p className="fw-light mt-3">
                                                {hotelDetail?.address ||
                                                    bookingInfo?.hotel?.address}
                                            </p>
                                        </div>
                                        {/* Detail */}
                                        <div>
                                            <div className="d-flex mt-4">
                                                <div>
                                                    <span>Check-in</span>
                                                    <h4 className="mt-2 fs-3 fw-bold">
                                                        {formatCheckInOutDate(
                                                            checkInDate ||
                                                                tempInfo?.checkInDate ||
                                                                bookingInfo?.checkInDate,
                                                            localStorage.getItem("i18nextLng")
                                                        )}
                                                    </h4>
                                                </div>

                                                <div className="separate--vertical"></div>

                                                <div>
                                                    <span>Check-out</span>
                                                    <h4 className="mt-2 fs-3 fw-bold">
                                                        {formatCheckInOutDate(
                                                            checkOutDate ||
                                                                tempInfo?.checkOutDate ||
                                                                bookingInfo?.checkOutDate,
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
                                                        {numberOfRoom2 + numberOfRoom4 ||
                                                            bookingInfo?.roomType2 +
                                                                bookingInfo?.roomType4}{" "}
                                                        {t("reserve.rooms")}
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
                                                <p className="fw-medium">
                                                    {bookingInfo?.roomType2 || numberOfRoom2} x{" "}
                                                    {t("reserve.double")}
                                                </p>
                                                <p className="fw-medium">
                                                    {bookingInfo?.roomType4 || numberOfRoom4} x{" "}
                                                    {t("reserve.quadruple")}
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href="#!"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/hotel/${hotelId}`, {
                                                    state: {
                                                        checkInDate: formatDate(
                                                            checkInDate,
                                                            "yyyy-mm-dd"
                                                        ),
                                                        checkOutDate: formatDate(
                                                            checkOutDate,
                                                            "yyyy-mm-dd"
                                                        ),
                                                        roomType2,
                                                        roomType4,
                                                        rooms,
                                                        sumPrice,
                                                        type2Price,
                                                        type4Price,
                                                        userId,
                                                        numberOfRoom2,
                                                        numberOfRoom4,
                                                    },
                                                });
                                            }}
                                        >
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
                                            <span className="ms-3">
                                                {bookingInfo?.sumPrice?.toLocaleString() ||
                                                    sumPrice?.toLocaleString()}{" "}
                                                VND
                                            </span>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <span>{t("reserve.discount")}</span>
                                            <span className="ms-3">-0 VND</span>
                                        </div>

                                        <div className="d-flex justify-content-between mt-5 fs-4  fw-bold">
                                            <span>{t("reserve.totalPrice")}</span>
                                            <span className="ms-3">
                                                {bookingInfo?.sumPrice?.toLocaleString() ||
                                                    sumPrice?.toLocaleString()}{" "}
                                                VND
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reserve;
