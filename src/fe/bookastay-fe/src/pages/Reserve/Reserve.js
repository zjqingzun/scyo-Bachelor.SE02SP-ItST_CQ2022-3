import { useState } from "react";
import "./Reserve.scss";

import Stepper from "~/components/Stepper/Stepper";

const Reserve = () => {
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

    const [currentStep, setCurrentStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);

    const handleNext = () => {
        setCurrentStep((prevStep) => {
            if (prevStep === stepsConfig.length) {
                setIsComplete(true);
                return prevStep;
            }

            return prevStep + 1;
        });
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div>
            <h1>Reserve</h1>

            <Stepper
                stepsConfig={stepsConfig}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                isComplete={isComplete}
                setIsComplete={setIsComplete}
            />

            <div className="content">
                {currentStep === 1 && (
                    <div className="step-content">
                        <h2>Your selection</h2>
                        <p>Content for step 1</p>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="step-content">
                        <h2>Your details</h2>
                        <p>Content for step 2</p>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="step-content">
                        <h2>Payment details</h2>
                        <p>Content for step 3</p>
                    </div>
                )}
            </div>

            <div className="actions">
                {!isComplete && currentStep > 1 && (
                    <button className="btn btn-secondary" onClick={() => handlePrev()}>
                        Prev
                    </button>
                )}

                {!isComplete && (
                    <button className="btn btn-success" onClick={() => handleNext()}>
                        {currentStep === stepsConfig.length ? "Finish" : "Next"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Reserve;
