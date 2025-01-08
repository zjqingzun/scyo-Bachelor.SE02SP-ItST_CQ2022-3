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
    const params = new URLSearchParams({
        city: query?.city || "",
        checkInDate: query?.checkInDate || "",
        checkOutDate: query?.checkOutDate || "",
        roomType2: query?.roomType2 || 0,
        roomType4: query?.roomType4 || 0,
        minPrice: query?.minPrice || 0,
        maxPrice: query?.maxPrice || 0,
        minRating: query?.minRating || 0,
        minStar: query?.minStar || 0,
        page: query?.page || 1,
        per_page: query?.per_page || 6,
    });

    return await axios.get(`/hotels/search?${params.toString()}`);
};

// Homepage api
const getRecommendHotels = async () => {
    return await axios.get(`/hotels/recommended-hotel`);
};

// FAV
const addFavorite = async (userId, hotelId) => {
    return await axios.get(`/user/addFav?userId=${userId}&hotelId=${hotelId}`);
};

const removeFavorite = async (userId, hotelId) => {
    return await axios.get(`/user/deleteFav?userId=${userId}&hotelId=${hotelId}`);
};

const getAllFavorite = async ({ userId, page = 1, limit = 6, sortBy = "name", order = "ASC" }) => {
    const params = new URLSearchParams({
        userId: userId,
        page: page || 1,
        limit: limit || 6,
        sortBy: sortBy || "name",
        order: order || "ASC",
    });

    return await axios.get(`/user/fav?${params.toString()}`);
};

// Profile

const updateProfile = async (data) => {
    return await axios.post("/user/update", data);
};

const updateAvatar = async (email, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await axios.post(`/user/avatar/upload/${email}`, formData);
};

const getAvatarUrl = async (email) => {
    return await axios.get(`/user/avatar/url/${email}`);
};

export {
    userLogin,
    getProfile,
    getRefreshToken,
    userRegister,
    getHotels,
    getRecommendHotels,
    addFavorite,
    removeFavorite,
    getAllFavorite,
    updateAvatar,
    getAvatarUrl,
    updateProfile,
};
