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

// Hotel Owner Pages
import RegisterHotel from "~/pages/HotelOwner/RegisterHotel/RegisterHotel";
import { Dashboard, Room, Guest, AddRoom, RoomType } from "~/pages/HotelOwner";

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
    },
    {
        path: "/hotel-owner/room",
        component: Room,
        layout: HotelOwnerLayout,
    },
    {
        path: "/hotel-owner/guest",
        component: Guest,
        layout: HotelOwnerLayout,
    },
    {
        path: "/hotel-owner",
        component: Dashboard,
        layout: HotelOwnerLayout,
    },
    {
        path: "/hotel-owner/room/add-room",
        component: AddRoom,
        layout: HotelOwnerLayout,
    },
    {
        path: "/hotel-owner/room-type",
        component: RoomType,
        layout: HotelOwnerLayout,
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
    }
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
