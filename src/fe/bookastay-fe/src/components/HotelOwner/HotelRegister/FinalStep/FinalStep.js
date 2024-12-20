import { Card, Form } from "react-bootstrap";
import "./FinalStep.scss";
import { useState } from "react";

const FinalStep = ({ handlePrev = () => {}, formData = {} }) => {
    const [isOnlinePayment, setIsOnlinePayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentNumber, setPaymentNumber] = useState("");

    const [isValidating, setIsValidating] = useState(false);

    const checkValidation = () => {
        if (isOnlinePayment) {
            setIsValidating(true);
            if (!paymentMethod) {
                return;
            }

            if (paymentMethod === "momo" && !paymentNumber) {
                return;
            }
        }
    };

    return (
        <div className="final-step">
            <div className="row">
                <div className="col-6">
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
                                            setPaymentNumber("");
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
                                                        !paymentNumber &&
                                                        "is-invalid") ||
                                                    ""
                                                }`}
                                                value={paymentNumber}
                                                onChange={(e) => setPaymentNumber(e.target.value)}
                                            />
                                            <Form.Control.Feedback>
                                                Please enter a valid momo number
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                )}
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
                                    Next
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FinalStep;
