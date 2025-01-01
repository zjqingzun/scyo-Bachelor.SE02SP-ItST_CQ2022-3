import axios from "~/utils/axiosCustomize";

// Auth
const userLogin = async (data) => {
    console.log(data);

    return await axios.post("/auth/login", data);
};

const getProfile = async () => {
    return await axios.get("/auth/profile");
};

const getRefreshToken = async () => {
    return await axios.get(`/auth/renew_token/${localStorage.getItem("refresh_token")}`);
};

export { userLogin, getProfile, getRefreshToken };
