import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

const NotFound = () => {
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.account.userInfo);

    const handleBackHome = () => {
        if (userInfo.role === "user" || !userInfo.role) {
            navigate("/");
        } else if (userInfo.role === "hotelier") {
            navigate("/hotel-owner/dashboard");
        } else if (userInfo.role === "admin") {
            navigate("/admin/dashboard");
        }
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button onClick={() => handleBackHome()} type="primary">
                    Back Home
                </Button>
            }
        />
    );
};

export default NotFound;
