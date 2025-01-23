import { useEffect, useReducer, useState } from "react";
import { Button, Result } from "antd";
import styled from "styled-components";
import axios from "axios";

import Stepper from "~/components/Stepper/Stepper";
import {
    PropertyDetail,
    RoomDetail,
    HotelImages,
    FinalStep,
} from "~/components/HotelOwner/HotelRegister";
import "./RegisterHotel.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccount } from "~/redux/action/accountAction";

const StyledStepLabel = styled.div`
    font-size: 2.8rem;
    text-align: center;
    font-weight: 600;
    color: #1a4870;
`;

const formReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_STEP":
            return {
                ...state,
                [action.stepKey]: action.payload,
            };
        default:
            return state;
    }
};

const RegisterHotel = () => {
    const reduxDispatch = useDispatch();
    const navigate = useNavigate();

    const account = useSelector((state) => state.account);

    const stepsConfig = [
        {
            title: "Property details",
        },
        {
            title: "Images",
        },
        {
            title: "Final steps",
        },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);

    const [formData, dispatch] = useReducer(formReducer, {
        propertyDetails: {},
        images: [],
        payment: {},
    });

    const persistData = async () => {
        // Persist data to the server
        // console.log(">>> Persist data", formData);
        const userId = localStorage.getItem("user_id");
        // console.log(">>> User ID", userId);
        try {
            // // Gửi propertyDetails
            const propertyResponse = await axios.post(
                `http://localhost:3001/api/hotels/add/basicInfo/${userId}`,
                formData.propertyDetails,
                {}
            );
            // console.log("Property details response:", propertyResponse.data);

            const hotelId = propertyResponse.data.hotel;
            // console.log("Hotel ID:", hotelId);

            // console.log(">>> formData", formData.images);
            // Gửi images
            // Chuẩn bị FormData cho images
            const formDataFiles = new FormData();
            formData.images.forEach((image) => {
                formDataFiles.append("images", image);
            });
            console.log("FormData:", formDataFiles);
            const imagesResponse = await axios.post(
                `http://localhost:3001/api/hotels/images/upload/${hotelId}`,
                formDataFiles,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // console.log("Images response:", imagesResponse.data);

            // Gửi payment
            const paymentResponse = await axios.post(
                `http://localhost:3001/api/hotels/payment/add/${hotelId}`,
                formData.payment.paymentAccount
            );
            // console.log("Payment response:", paymentResponse.data);

            // // Gửi roomDetails
            const { doubleRoomPrice, quadRoomPrice } = formData.payment;
            const roomDetailsResponse = await axios.post(
                `http://localhost:3001/api/room_types/add/${hotelId}`,
                {
                    doubleRoomPrice,
                    quadRoomPrice,
                }
            );

            reduxDispatch(doGetAccount());

            // console.log("Room details response:", roomDetailsResponse.data);
        } catch {
            console.log("Error when sending property details");
        }
    };

    useEffect(() => {
        if (isComplete) {
            console.log(">>> formData", formData);
            persistData();
        }
    }, [formData]);

    const updateStepData = (stepKey, payload) => {
        dispatch({ type: "UPDATE_STEP", stepKey, payload });
    };

    const handleNextStep = () => {
        if (currentStep < stepsConfig.length) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setIsComplete(true);
        console.log(">>> Completed");
    };

    return (
        <div className="register-hotel mt-5">
            {isComplete ? (
                <Result
                    status="success"
                    title="Successfully registered"
                    subTitle="Your hotel has been successfully registered."
                    extra={[
                        <Button
                            type="primary"
                            key="console"
                            onClick={() => {
                                navigate("/hotel-owner/dashboard");
                            }}
                        >
                            Go to dashboard
                        </Button>,
                    ]}
                />
            ) : (
                <>
                    <div className="d-none d-md-flex">
                        <Stepper stepsConfig={stepsConfig} currentStep={currentStep} />
                    </div>

                    <div className="d-md-none">
                        {currentStep === 1 && (
                            <StyledStepLabel>{stepsConfig[0].title}</StyledStepLabel>
                        )}
                        {currentStep === 2 && (
                            <StyledStepLabel>{stepsConfig[1].title}</StyledStepLabel>
                        )}
                        {currentStep === 3 && (
                            <StyledStepLabel>{stepsConfig[2].title}</StyledStepLabel>
                        )}
                    </div>

                    <div className="register-hotel__content mt-5">
                        <div className="register-hotel__form">
                            {currentStep === 1 && (
                                <PropertyDetail
                                    formData={formData.propertyDetails}
                                    updateData={(data) => updateStepData("propertyDetails", data)}
                                    handleNext={handleNextStep}
                                />
                            )}
                            {currentStep === 2 && (
                                <HotelImages
                                    handleNext={handleNextStep}
                                    formData={formData.images}
                                    updateData={(data) => updateStepData("images", data)}
                                    handlePrev={handlePrevStep}
                                />
                            )}
                            {currentStep === 3 && (
                                <FinalStep
                                    handlePrev={handlePrevStep}
                                    formData={formData}
                                    updateData={(data) => updateStepData("payment", data)}
                                    handleComplete={handleComplete}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RegisterHotel;
