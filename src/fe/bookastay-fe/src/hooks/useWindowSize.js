import { useState, useEffect } from "react";
import useDebounce from "./useDebounce"; // Đảm bảo bạn import đúng đường dẫn

const useWindowSize = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sử dụng useDebounce để trì hoãn giá trị width
    const debouncedWidth = useDebounce(size.width, 100); // Thay đổi 100ms theo nhu cầu

    return { width: debouncedWidth };
};

export default useWindowSize;
