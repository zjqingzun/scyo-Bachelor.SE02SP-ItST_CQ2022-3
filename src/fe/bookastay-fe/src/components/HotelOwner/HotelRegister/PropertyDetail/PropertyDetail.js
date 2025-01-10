import { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import icons from "~/assets/icon";

import "./PropertyDetail.scss";

const PropertyDetail = ({ handleNext = () => {}, formData = {}, updateData = () => {} }) => {
    const userId = localStorage.getItem("user_id");
    console.log(">>> User ID", userId);
    const formik = useFormik({
        initialValues: {
            name: "",
            address: "",
            city: "",
            district: "",
            ward: "",
            star: "N/A",
            description: "",
            phone: "",
            email: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Hotel name is required"),
            address: Yup.string().required("Hotel address is required"),
            city: Yup.string().required("City is required"),
            district: Yup.string().required("District is required"),
            ward: Yup.string().required("Ward is required"),
            description: Yup.string().max(500, "Description cannot exceed 500 characters"),
            phone: Yup.string()
                .matches(/^\d{10}$/, "Phone must be a valid 10-digit number")
                .required("Phone is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
        }),
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

        if (formData.city) {
            setIsSelectedProvince(true);
        }

        if (formData.district) {
            setIsSelectedDistrict(true);
        }

        formik.setValues({
            name: formData.name || "",
            address: formData.address || "",
            city: formData.city || "",
            district: formData.district || "",
            ward: formData.ward || "unknown",
            star: formData.star || "N/A",
            description: formData.description || "",
            phone: formData.phone || "",
            email: formData.email || "",
        });
    }, []);

    useEffect(() => {
        if (isSelectedProvince && formik.values.city) {
            fetch(`https://open.oapi.vn/location/districts/${formik.values.city}?page=0&size=1000`)
                .then((res) => res.json())
                .then((data) => {
                    setDistricts(data.data);

                    if (data.data.length === 0) {
                        formik.values.district = "---";
                    }
                });
        }
    }, [isSelectedProvince, formik.values.city]);

    useEffect(() => {
        if (isSelectedDistrict && formik.values.district) {
            fetch(`https://open.oapi.vn/location/wards/${formik.values.district}?page=0&size=1000`)
                .then((res) => res.json())
                .then((data) => {
                    setWards(data.data);

                    if (data.data.length === 0) {
                        formik.values.ward = "---";
                    }
                });
        }
    }, [isSelectedDistrict, formik.values.district]);

    const handleCityChange = (e) => {
        formik.setFieldValue("district", "");
        formik.setFieldValue("ward", "");
        setDistricts([]);
        setWards([]);
        formik.setFieldValue("city", e.target.value);
        setIsSelectedProvince(true);
    };

    const handleDistrictChange = (e) => {
        formik.setFieldValue("ward", "");
        setWards([]);
        formik.setFieldValue("district", e.target.value);
        setIsSelectedDistrict(true);
    };

    const checkValidation = () => {
        formik.setTouched({
            name: true,
            address: true,
            city: true,
            district: true,
            ward: true,
            description: true,
            phone: true,
            email: true,
        });

        formik.handleSubmit();

        if (formik.isValid && formik.dirty) {
            const selectedProvince = provinces.find(
                (province) => province.id === formik.values.city
            );
            const selectedDistrict = districts.find(
                (district) => district.id === formik.values.district
            );
            const selectedWard = wards.find((ward) => ward.id === formik.values.ward);

            const detailAddress = `${formik.values?.address} ${
                selectedWard?.name ? "," + selectedWard.name : ""
            } ${selectedDistrict?.name ? "," + selectedDistrict.name : ""} ${
                selectedProvince?.name ? "," + selectedProvince.name : ""
            }`;

            updateData({
                name: formik.values.name,
                district: selectedDistrict?.name,
                ward: selectedWard?.name || "unknown",
                city: selectedProvince?.name,
                detailAddress,
                description: formik.values.description,
                phone: formik.values.phone,
                email: formik.values.email,
                star: formik.values.star,
            });
            handleNext();
        }
    };

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="row row-cols-1 row-cols-md-2 gy-3">
                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Hotel Name <span className="red-dot">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.name && formik.errors.name ? "is-invalid" : ""
                                }`}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                id="name"
                            />
                            <div className="invalid-feedback">{formik.errors.name}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="detailAddress" className="form-label">
                                Hotel Address <span className="red-dot">*</span>
                            </label>
                            <input
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                type="text"
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.address && formik.errors.address
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="address"
                            />
                            <div className="invalid-feedback">{formik.errors.address}</div>
                        </div>
                        <div className="row row-cols-2 row-cols-md-3 mb-3">
                            <div className="col">
                                <label htmlFor="city" className="form-label">
                                    City <span className="red-dot">*</span>
                                </label>
                                <select
                                    className={`form-select form-select-lg fs-4 ${
                                        formik.touched.city && formik.errors.city
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    name="city"
                                    id="city"
                                    value={formik.values.city}
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
                                <div className="invalid-feedback">{formik.errors.city}</div>
                            </div>
                            <div className="col">
                                <label htmlFor="district" className="form-label">
                                    District{" "}
                                    {districts.length !== 0 && <span className="red-dot">*</span>}
                                </label>
                                <select
                                    disabled={!isSelectedProvince || districts.length === 0}
                                    className={`form-select form-select-lg fs-4 ${
                                        formik.touched.district && formik.errors.district
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="district"
                                    name="district"
                                    value={formik.values.district}
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
                                <div className="invalid-feedback">{formik.errors.district}</div>
                            </div>
                            <div className="col">
                                <label htmlFor="ward" className="form-label">
                                    Ward {wards.length !== 0 && <span className="red-dot">*</span>}
                                </label>
                                <select
                                    disabled={!isSelectedDistrict || wards.length === 0}
                                    id="ward"
                                    name="ward"
                                    className={`form-select form-select-lg fs-4 ${
                                        formik.touched.ward && formik.errors.ward
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={formik.values.ward}
                                    onChange={(e) => formik.setFieldValue("ward", e.target.value)}
                                >
                                    <option value="">Select ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{formik.errors.ward}</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.description && formik.errors.description
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="invalid-feedback">{formik.errors.description}</div>
                            )}
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone <span className="red-dot">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.phone && formik.errors.phone ? "is-invalid" : ""
                                }`}
                                id="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                            />
                            <div className="invalid-feedback">{formik.errors.phone}</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email <span className="red-dot">*</span>
                            </label>
                            <input
                                type="email"
                                className={`form-control form-control-lg fs-4 ${
                                    formik.touched.email && formik.errors.email ? "is-invalid" : ""
                                }`}
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            <div className="invalid-feedback">{formik.errors.email}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                What is the star rating of your hotel?
                            </label>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="star"
                                    id="flexCheckDefault"
                                    value="N/A"
                                    checked={formik.values.star === "N/A" ? true : false}
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
                                    name="star"
                                    id="oneStar"
                                    value="1"
                                    checked={formik.values.star === "1" ? true : false}
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
                                    name="star"
                                    id="twoStar"
                                    value="2"
                                    checked={formik.values.star === "2" ? true : false}
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
                                    name="star"
                                    id="threeStar"
                                    value="3"
                                    checked={formik.values.star === "3" ? true : false}
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
                                    name="star"
                                    id="fourStar"
                                    value="4"
                                    checked={formik.values.star === "4"}
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
                                    name="star"
                                    id="fiveStar"
                                    value="5"
                                    checked={formik.values.star === "5" ? true : false}
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
                        type="submit"
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
