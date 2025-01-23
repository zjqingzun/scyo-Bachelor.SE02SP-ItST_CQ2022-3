import React, { useState } from "react";
import "./review.css";
import icons from "~/assets/icon";
import { useLocation, useNavigate } from "react-router-dom";
import { postReview } from "~/services/apiService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Review = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userInfo = useSelector((state) => state.account.userInfo);

    const [rating, setRating] = useState(0); // Giá trị đánh giá (số sao)
    const [hover, setHover] = useState(0); // Số sao khi hover
    const [message, setMessage] = useState(""); // Nội dung tin nhắn

    const handleRateNow = async () => {
        try {
            const res = await postReview({
                comment: message,
                rating: rating,
                hotelId: location.state.hotelId,
                userId: userInfo.id,
            });

            if (res && +res.status_code === 200) {
                toast.success("Review successfully!");
                navigate("/history");
            }
        } catch (error) {
            toast.error("Review failed!");
        }
    };

    const handleMaybeLater = () => {
        // alert("You can review anytime later.");
        navigate("/history");
    };

    return (
        <div className="review-page p-5 text-center my-5">
            <h1 className="my-4" style={{ fontSize: "40px", fontWeight: "700" }}>
                SABAY AIRPORT APARTMENT
            </h1>
            <p className="mb-3 fs-2">How was the quality of the stay?</p>

            {/* Hàng ngôi sao */}
            <div className="mb-3">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <span
                            key={index}
                            onClick={() => setRating(starValue)} // Chọn số sao
                            onMouseEnter={() => setHover(starValue)} // Hover sao
                            onMouseLeave={() => setHover(0)} // Rời khỏi sao
                            style={{
                                fontSize: "5rem",
                                cursor: "pointer",
                                color: starValue <= (hover || rating) ? "#FFD700" : "#E4E5E9",
                            }}
                        >
                            ★
                        </span>
                    );
                })}
            </div>

            {/* Hộp nhập tin nhắn */}
            <textarea
                className="py-3 px-4 fs-3 mb-5 mt-3"
                placeholder="Leave a message if you want..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            {/* Nút hành động */}
            <div>
                <button
                    onClick={handleRateNow}
                    className="btn btn-primary fs-3 py-3 px-5 mb-5 mt-4 me-4"
                >
                    RATE NOW
                </button>
                <button
                    onClick={handleMaybeLater}
                    style={{
                        backgroundColor: "#fff",
                        color: "#007BFF",
                        border: "1px solid #007BFF",
                    }}
                    className="btn fs-3 py-3 px-5 mb-5 mt-4 ms-4"
                >
                    Maybe later
                </button>
            </div>
        </div>
    );
};

export default Review;
