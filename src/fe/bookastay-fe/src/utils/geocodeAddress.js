import axios from "axios";

const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
    )}`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return [parseFloat(lat), parseFloat(lon)];
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Error fetching geocode:", error);
        return null;
    }
};

export default geocodeAddress;
