import axios from "~/utils/axiosCustomize";

// Auth
const userLogin = async (data) => {
    console.log(data);

    return await axios.post("/auth/login", data);
};

const userRegister = async (createAuthDto, role) => {
    return await axios.post(`/auth/register/${role}`, createAuthDto);
};

const getProfile = async () => {
    return await axios.get("/auth/profile");
};

const getRefreshToken = async () => {
    return await axios.get(`/auth/renew_token/${localStorage.getItem("refresh_token")}`);
};

// Search
const getHotels = async (
    query = {
        city: "",
        checkInDate: "",
        checkOutDate: "",
        roomType2: 0,
        roomType4: 0,
        minPrice: 0,
        maxPrice: 0,
        minRating: 0,
        minStar: 0,
        page: 1,
        per_page: 6,
    }
) => {
    const {
        city,
        checkInDate,
        checkOutDate,
        roomType2,
        roomType4,
        minPrice,
        maxPrice,
        minRating,
        minStar,
        page,
        per_page,
    } = query;

    const params = new URLSearchParams({
        city,
        checkInDate,
        checkOutDate,
        roomType2,
        roomType4,
        minPrice,
        maxPrice,
        minRating,
        minStar,
        page,
        per_page,
    });

    return await axios.get(`/hotels/search?${params.toString()}`);
};

export { userLogin, getProfile, getRefreshToken, userRegister, getHotels };
