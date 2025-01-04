// Layouts
import { HeaderOnly, HotelOwnerLayout } from "../components/Layout";

// Pages
import Home from "../pages/Home";
import About from "../pages/AboutUs";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import AfterSearch from "../pages/AfterSearch";
import Reserve from "~/pages/Reserve/Reserve";
import HotelDetails from "../pages/Hotel Details/hotelDetails";
import History from "../pages/History";
import Favorite from "../pages/FAV";
import AccountSetting from "../pages/Account";
import Review from "~/pages/Review";

// Hotel Owner Pages
import RegisterHotel from "~/pages/HotelOwner/RegisterHotel/RegisterHotel";
import { Dashboard, Room, Guest, AddRoom, RoomType } from "~/pages/HotelOwner";
import Unauthorized from "~/pages/Unauthorized/Unauthorized";

const publicRoutes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/unauthorized",
        component: Unauthorized,
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
        restricted: true,
    },
    {
        path: "/register",
        component: Register,
        layout: HeaderOnly,
        restricted: true,
    },
    {
        path: "/hotel-details",
        component: HotelDetails,
    },
    {
        path: "/hotel-owner/register-hotel",
        component: RegisterHotel,
        layout: HeaderOnly,
    },
    {
        path: "/hotel-owner/dashboard",
        component: Dashboard,
        layout: HotelOwnerLayout,
        requiredRole: "hotelier",
    },
    {
        path: "/hotel-owner/room",
        component: Room,
        layout: HotelOwnerLayout,
        requiredRole: "hotelier",
    },
    {
        path: "/hotel-owner/guest",
        component: Guest,
        layout: HotelOwnerLayout,
        requiredRole: "hotelier",
    },
    {
        path: "/hotel-owner",
        component: Dashboard,
        layout: HotelOwnerLayout,
        requiredRole: "hotelier",
    },
    {
        path: "/hotel-owner/room/add-room",
        component: AddRoom,
        layout: HotelOwnerLayout,
        requiredRole: "hotelier",
    },
    {
        path: "/hotel-owner/room-type",
        component: RoomType,
        layout: HotelOwnerLayout,
        requiredRole: "hotelier",
    },
    {
        path: "/history",
        component: History,
    },
    {
        path: "/favorite",
        component: Favorite,
    },
    {
        path: "/account-setting",
        component: AccountSetting,
    },
    {
        path: "/review",
        component: Review,
    },
];

const hotelOwnerRoutes = [
    {
        path: "/hotel-owner/register-hotel",
        component: RegisterHotel,
        layout: HeaderOnly,
    },
    {
        path: "/hotel-details",
        component: HotelDetails,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
