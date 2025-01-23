import { Card, Form } from "react-bootstrap";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./FinalStep.scss";

const FinalStep = ({
    handlePrev = () => {},
    formData = {},
    updateData = () => {},
    handleComplete = () => {},
}) => {
    const [isOnlinePayment, setIsOnlinePayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentAccount, setPaymentAccount] = useState("");

    const [isValidating, setIsValidating] = useState(false);

    const checkValidation = () => {
        if (isOnlinePayment) {
            setIsValidating(true);
            if (!paymentMethod) {
                return;
            }

            if (paymentMethod === "momo" && !paymentAccount) {
                return;
            }
        }

        formik.setTouched({
            doubleRoomPrice: true,
            quadRoomPrice: true,
        });

        if (formik.isValid && formik.dirty) {
            const data = {
                paymentAccount: paymentAccount,
                doubleRoomPrice: Number(formik.values.doubleRoomPrice),
                quadRoomPrice: Number(formik.values.quadRoomPrice),
            };

            console.log(">>> data", data);

            updateData({
                ...data,
            });
            handleComplete();
        }
    };

    const formik = useFormik({
        initialValues: {
            doubleRoomPrice: "",
            quadRoomPrice: "",
        },
        validationSchema: Yup.object({
            doubleRoomPrice: Yup.number()
                .positive("Room price must be a positive number.")
                .required("Room price is required"),
            quadRoomPrice: Yup.number()
                .positive("Room price must be a positive number.")
                .required("Room price is required"),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <div className="final-step">
            <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col">
                    <h2>Payment</h2>
                    <Card>
                        <Card.Body>
                            <div className="p-3">
                                <p className="h3">Do you want to add an online payment method?</p>
                                <div className="final-step__payment-options">
                                    <Form.Check
                                        type="radio"
                                        label="Yes"
                                        id="yes"
                                        name="yesNoGroup"
                                        onChange={() => setIsOnlinePayment(true)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="No"
                                        id="no"
                                        name="yesNoGroup"
                                        onChange={() => {
                                            setIsOnlinePayment(false);
                                            setPaymentMethod("");
                                            setPaymentAccount("");
                                            setIsValidating(false);
                                        }}
                                    />
                                </div>

                                {isOnlinePayment && (
                                    <Form.Group className="mt-3">
                                        <Form.Select
                                            size="lg"
                                            className={`fs-4 mt-3 ${
                                                (isOnlinePayment &&
                                                    isValidating &&
                                                    !paymentMethod &&
                                                    "is-invalid") ||
                                                ""
                                            }`}
                                            value={paymentMethod}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                            }}
                                        >
                                            <option value="">Select payment method</option>
                                            <option value="momo">Momo</option>
                                        </Form.Select>
                                        <Form.Control.Feedback>
                                            Please select a payment method
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                )}

                                {isOnlinePayment && paymentMethod === "momo" && (
                                    <div className="mt-3">
                                        <h3>Momo details</h3>
                                        <Form.Group className="mt-3">
                                            <Form.Control
                                                size="lg"
                                                type="text"
                                                placeholder="Momo number"
                                                className={`fs-4 mt-3 ${
                                                    (isOnlinePayment &&
                                                        isValidating &&
                                                        !paymentAccount &&
                                                        "is-invalid") ||
                                                    ""
                                                }`}
                                                value={paymentAccount}
                                                onChange={(e) => setPaymentAccount(e.target.value)}
                                            />
                                            <Form.Control.Feedback>
                                                Please enter a valid momo number
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col">
                    <h2>Price</h2>
                    <Card>
                        <Card.Body>
                            <div className="p-3">
                                <p className="h3">Enter price of two base room type?</p>
                                <Form.Group className="mt-3">
                                    <Form.Label className="fs-4">Double Room</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="number"
                                        name="doubleRoomPrice"
                                        value={formik.values.doubleRoomPrice}
                                        placeholder="Price of double room type"
                                        className={`fs-4 mt-3  ${
                                            formik.errors.doubleRoomPrice &&
                                            formik.touched.doubleRoomPrice
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        onChange={formik.handleChange}
                                    />
                                    <div className="invalid-feedback">
                                        {formik.errors.doubleRoomPrice}
                                    </div>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label className="fs-4">Quad Room</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="number"
                                        name="quadRoomPrice"
                                        value={formik.values.quadRoomPrice}
                                        placeholder="Price of quad room type"
                                        className={`fs-4 mt-3 ${
                                            formik.errors.quadRoomPrice &&
                                            formik.touched.quadRoomPrice
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        onChange={formik.handleChange}
                                    />
                                    <div className="invalid-feedback">
                                        {formik.errors.quadRoomPrice}
                                    </div>
                                </Form.Group>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                    className="btn btn-secondary btn-lg fs-3 px-4"
                    style={{
                        background: "transparent",
                        border: "1px solid #227B94",
                        color: "#227B94",
                    }}
                    onClick={() => handlePrev()}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="btn btn-success btn-lg fs-3 px-4"
                    style={{ background: "#227B94" }}
                    onClick={() => checkValidation()}
                >
                    Finish
                </button>
            </div>
        </div>
    );
};

export default FinalStep;
