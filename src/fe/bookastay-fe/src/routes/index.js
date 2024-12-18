// Layouts
import { HeaderOnly } from "../components/Layout";

// Pages
import Home from "../pages/Home";
import About from "../pages/AboutUs";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import AfterSearch from "../pages/AfterSearch";
import Reserve from "~/pages/Reserve/Reserve";
import HotelDetails from "../pages/Hotel Details/hotelDetails";

const publicRoutes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/about",
        component: About,
    },
    {
        path: "/after-search",
        component: AfterSearch,
    },
    {
        path: "/reserve",
        component: Reserve,
    },
    {
        path: "/login",
        component: Login,
        layout: HeaderOnly,
    },
    {
        path: "/register",
        component: Register,
        layout: HeaderOnly,
    },
    {
        path: "/hotel-details",
        component: HotelDetails,
    }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
