import { useEffect, useReducer, useState } from "react";

import Stepper from "~/components/Stepper/Stepper";
import {
    PropertyDetail,
    RoomDetail,
    HotelImages,
    FinalStep,
} from "~/components/HotelOwner/HotelRegister";
import "./RegisterHotel.scss";

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
    });

    const persistData = () => {
        // Persist data to the server
        console.log(">>> Persist data", formData);
    };

    useEffect(() => {
        persistData();
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

    return (
        <div className="register-hotel mt-5">
            <Stepper stepsConfig={stepsConfig} currentStep={currentStep} />

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
                        <FinalStep handlePrev={handlePrevStep} formData={formData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterHotel;
