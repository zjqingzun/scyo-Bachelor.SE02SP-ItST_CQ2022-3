import { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import icons from "~/assets/icon";

import "./PropertyDetail.scss";

const PropertyDetail = ({ handleNext = () => {}, formData = {}, updateData = () => {} }) => {
    const formik = useFormik({
        initialValues: {
            hotelName: "",
            hotelAddress: "",
            hotelCity: "",
            hotelDistrict: "",
            hotelWard: "",
            // hotelFloor: "",
            // hotelRoom: "",
            hotelStar: "N/A",
        },
        validationSchema: Yup.object({
            hotelName: Yup.string().required("Hotel name is required"),
            hotelAddress: Yup.string().required("Hotel address is required"),
            hotelCity: Yup.string().required("City is required"),
            hotelDistrict: Yup.string().required("District is required"),
            hotelWard: Yup.string().required("Ward is required"),
            // hotelFloor: Yup.number().required("Number of floors is required"),
            // hotelRoom: Yup.number().required("Number of rooms is required"),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [isSelectedProvince, setIsSelectedProvince] = useState(false);
    const [isSelectedDistrict, setIsSelectedDistrict] = useState(false);

    useEffect(() => {
        fetch(`https://open.oapi.vn/location/provinces?page=0&size=1000`)
            .then((res) => res.json())
            .then((data) => {
                setProvinces(data.data);
            });

        if (formData.hotelCity) {
            setIsSelectedProvince(true);
        }

        if (formData.hotelDistrict) {
            setIsSelectedDistrict(true);
        }

        formik.setValues({
            hotelName: formData.hotelName || "",
            hotelAddress: formData.hotelAddress || "",
            hotelCity: formData.hotelCity || "",
            hotelDistrict: formData.hotelDistrict || "",
            hotelWard: formData.hotelWard || "",
            // hotelFloor: formData.hotelFloor || "",
            // hotelRoom: formData.hotelRoom || "",
            hotelStar: formData.hotelStar || "N/A",
        });
    }, []);

    useEffect(() => {
        if (isSelectedProvince && formik.values.hotelCity) {
            fetch(
                `https://open.oapi.vn/location/districts/${formik.values.hotelCity}?page=0&size=1000`
            )
                .then((res) => res.json())
                .then((data) => {
                    setDistricts(data.data);

                    if (data.data.length === 0) {
                        formik.values.hotelDistrict = "---";
                    }
                });
        }
    }, [isSelectedProvince, formik.values.hotelCity]);

    useEffect(() => {
        if (isSelectedDistrict && formik.values.hotelDistrict) {
            fetch(
                `https://open.oapi.vn/location/wards/${formik.values.hotelDistrict}?page=0&size=1000`
            )
                .then((res) => res.json())
                .then((data) => {
                    setWards(data.data);

                    if (data.data.length === 0) {
                        formik.values.hotelWard = "---";
                    }
                });
        }
    }, [isSelectedDistrict, formik.values.hotelDistrict]);

    const handleCityChange = (e) => {
        formik.setFieldValue("hotelDistrict", "");
        formik.setFieldValue("hotelWard", "");
        setDistricts([]);
        setWards([]);
        formik.setFieldValue("hotelCity", e.target.value);
        setIsSelectedProvince(true);
    };

    const handleDistrictChange = (e) => {
        formik.setFieldValue("hotelWard", "");
        setWards([]);
        formik.setFieldValue("hotelDistrict", e.target.value);
        setIsSelectedDistrict(true);
    };

    const checkValidation = () => {
        formik.setTouched({
            hotelName: true,
            hotelAddress: true,
            hotelCity: true,
            hotelDistrict: true,
            hotelWard: true,
        });

        formik.handleSubmit();

        if (formik.isValid && formik.dirty) {
            updateData(formik.values);
            handleNext();
        }
    };

    // console.log(">>> render", formik.values);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="hotelName" className="form-label">
                                Hotel Name <span className="red-dot">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.hotelName && formik.errors.hotelName
                                        ? "is-invalid"
                                        : ""
                                }`}
                                value={formik.values.hotelName}
                                onChange={formik.handleChange}
                                id="hotelName"
                            />
                            <div className="invalid-feedback">{formik.errors.hotelName}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hotelAddress" className="form-label">
                                Hotel Address <span className="red-dot">*</span>
                            </label>
                            <input
                                value={formik.values.hotelAddress}
                                onChange={formik.handleChange}
                                type="text"
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.hotelAddress && formik.errors.hotelAddress
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="hotelAddress"
                            />
                            <div className="invalid-feedback">{formik.errors.hotelAddress}</div>
                        </div>
                        <div className="row row-cols-3 mb-3">
                            <div className="col">
                                <label htmlFor="hotelCity" className="form-label">
                                    City <span className="red-dot">*</span>
                                </label>
                                <select
                                    className={`form-select form-select-lg fs-4 ${
                                        formik.touched.hotelCity && formik.errors.hotelCity
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="city"
                                    id="hotelCity"
                                    value={formik.values.hotelCity}
                                    onChange={(e) => {
                                        handleCityChange(e);
                                    }}
                                >
                                    <option value="">Select city</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.id}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{formik.errors.hotelCity}</div>
                            </div>
                            <div className="col">
                                <label htmlFor="hotelDistrict" className="form-label">
                                    District{" "}
                                    {districts.length != 0 && <span className="red-dot">*</span>}
                                </label>
                                <select
                                    disabled={!isSelectedProvince || districts.length === 0}
                                    className={`form-select form-select-lg fs-4 ${
                                        formik.touched.hotelDistrict && formik.errors.hotelDistrict
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="hotelDistrict"
                                    name="district"
                                    value={formik.values.hotelDistrict}
                                    onChange={(e) => {
                                        handleDistrictChange(e);
                                    }}
                                >
                                    <option value="">Select district</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    {formik.errors.hotelDistrict}
                                </div>
                            </div>
                            <div className="col">
                                <label htmlFor="hotelWard" className="form-label">
                                    Ward {wards.length != 0 && <span className="red-dot">*</span>}
                                </label>
                                <select
                                    disabled={!isSelectedDistrict || wards.length === 0}
                                    id="hotelWard"
                                    name="ward"
                                    className={`form-select form-select-lg fs-4 ${
                                        formik.touched.hotelWard && formik.errors.hotelWard
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formik.values.hotelWard}
                                    onChange={(e) =>
                                        formik.setFieldValue("hotelWard", e.target.value)
                                    }
                                >
                                    <option value="">Select ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{formik.errors.hotelWard}</div>
                            </div>
                        </div>
                        <div className="row row-cols-lg-2 mb-3">
                            <div className="col">
                                <label htmlFor="hotelFloor" className="form-label">
                                    Number of floors
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    className="form-control form-control-lg fs-4"
                                    id="hotelFloor"
                                />
                                <div className="invalid-feedback"></div>
                            </div>

                            <div className="col">
                                <label htmlFor="hotelRoom" className="form-label">
                                    Number room per floor
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    className="form-control form-control-lg fs-4"
                                    id="hotelRoom"
                                />
                                <div className="invalid-feedback"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-3">
                            <label className="form-label">
                                What is the star rating of your hotel?
                            </label>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hotelStar"
                                    id="flexCheckDefault"
                                    value="N/A"
                                    checked={formik.values.hotelStar === "N/A" ? true : false}
                                    onChange={formik.handleChange}
                                />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    N/A
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hotelStar"
                                    id="oneStar"
                                    value="1"
                                    checked={formik.values.hotelStar === "1" ? true : false}
                                    onChange={formik.handleChange}
                                />
                                <label
                                    className="form-check-label d-flex align-items-center gap-2"
                                    htmlFor="oneStar"
                                >
                                    1 star
                                    {
                                        <img
                                            src={icons.yellowStarIcon}
                                            alt="star"
                                            className="property-detail__star"
                                        />
                                    }
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hotelStar"
                                    id="twoStar"
                                    value="2"
                                    checked={formik.values.hotelStar === "2" ? true : false}
                                    onChange={formik.handleChange}
                                />
                                <label
                                    className="form-check-label d-flex align-items-center gap-2"
                                    htmlFor="twoStar"
                                >
                                    2 star
                                    {
                                        <>
                                            <img
                                                src={icons.yellowStarIcon}
                                                alt="star"
                                                className="property-detail__star"
                                            />
                                            <img
                                                src={icons.yellowStarIcon}
                                                alt="star"
                                                className="property-detail__star"
                                            />
                                        </>
                                    }
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hotelStar"
                                    id="threeStar"
                                    value="3"
                                    checked={formik.values.hotelStar === "3" ? true : false}
                                    onChange={formik.handleChange}
                                />
                                <label
                                    className="form-check-label d-flex align-items-center gap-2"
                                    htmlFor="threeStar"
                                >
                                    3 star
                                    {
                                        <>
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <img
                                                    src={icons.yellowStarIcon}
                                                    alt="star"
                                                    className="property-detail__star"
                                                    key={index}
                                                />
                                            ))}
                                        </>
                                    }
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hotelStar"
                                    id="fourStar"
                                    value="4"
                                    checked={formik.values.hotelStar === "4"}
                                    onChange={formik.handleChange}
                                />
                                <label
                                    className="form-check-label d-flex align-items-center gap-2"
                                    htmlFor="fourStar"
                                >
                                    4 star
                                    {
                                        <>
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <img
                                                    src={icons.yellowStarIcon}
                                                    alt="star"
                                                    className="property-detail__star"
                                                    key={index}
                                                />
                                            ))}
                                        </>
                                    }
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hotelStar"
                                    id="fiveStar"
                                    value="5"
                                    checked={formik.values.hotelStar === "5" ? true : false}
                                    onChange={formik.handleChange}
                                />
                                <label
                                    className="form-check-label d-flex align-items-center gap-2"
                                    htmlFor="fiveStar"
                                >
                                    5 star
                                    {
                                        <>
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <img
                                                    src={icons.yellowStarIcon}
                                                    alt="star"
                                                    className="property-detail__star"
                                                    key={index}
                                                />
                                            ))}
                                        </>
                                    }
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-success btn-lg fs-3 px-4"
                        style={{ background: "#227B94" }}
                        onClick={() => checkValidation()}
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PropertyDetail;
