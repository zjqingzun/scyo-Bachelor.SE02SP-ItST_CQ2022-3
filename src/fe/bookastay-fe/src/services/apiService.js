import axios from "~/utils/axiosCustomize";

// Auth
const userLogin = async (data) => {
    console.log(data);

    return await axios.post("/auth/login", data);
};

export { userLogin };
