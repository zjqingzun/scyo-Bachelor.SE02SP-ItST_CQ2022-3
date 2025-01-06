import { useNavigate } from "react-router-dom";

const { Button, Result } = require("antd");

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/");
    };

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
                <Button onClick={() => handleBackHome()} type="primary">
                    Back Home
                </Button>
            }
        />
    );
};

export default Unauthorized;
