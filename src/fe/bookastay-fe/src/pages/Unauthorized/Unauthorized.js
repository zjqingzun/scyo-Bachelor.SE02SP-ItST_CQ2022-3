import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Button, Result } = require("antd");

const Unauthorized = () => {
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.account.userInfo);

    const handleBackHome = () => {
        if (userInfo.role === "user") {
            navigate("/");
        } else if (userInfo.role === "hotelier") {
            navigate("/hotel-owner/dashboard");
        }
        // To do
        else if (userInfo.role === "admin") {
            navigate("/admin/dashboard");
        }
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
