import { useEffect, useRef, useState } from "react";
import "./Stepper.scss";

const Stepper = ({
    stepsConfig = [],
    currentStep = 1,
    setCurrentStep = () => {},
    isComplete = false,
    setIsComplete = () => {},
}) => {
    const stepRef = useRef([]);

    const [margins, setMargins] = useState({
        marginLeft: 0,
        marginRight: 0,
    });

    const calculateProgressBarWidth = () => {
        return Math.ceil(((currentStep - 1) / (stepsConfig.length - 1)) * 100);
    };

    useEffect(() => {
        setMargins({
            marginLeft: Math.ceil(stepRef.current[0].offsetWidth / 2),
            marginRight: stepRef.current[stepsConfig.length - 1].offsetWidth / 2,
        });
    }, [stepRef, stepsConfig.length]);

    if (stepsConfig.length === 0) {
        return <> </>;
    }

    return (
        <>
            <div className="stepper">
                {stepsConfig.map((step, index) => {
                    const isCurrent = index + 1 === currentStep;
                    const isCompleted = index + 1 < currentStep || isComplete;
                    return (
                        <div
                            ref={(el) => (stepRef.current[index] = el)}
                            key={index}
                            className={`step ${isCurrent ? "step--current" : ""} ${
                                isCompleted ? "step--completed" : ""
                            }`}
                        >
                            <div className="step__title">{step.title}</div>
                            <div className="step__number">{index + 1}</div>
                        </div>
                    );
                })}

                <div
                    className="progress-bar"
                    style={{
                        width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
                        marginLeft: margins.marginLeft,
                        marginRight: margins.marginRight,
                    }}
                >
                    <div
                        className="progress-bar__progress"
                        style={{
                            width: `${calculateProgressBarWidth()}%`,
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default Stepper;
