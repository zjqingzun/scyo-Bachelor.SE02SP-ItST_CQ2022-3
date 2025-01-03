// Layouts
import { HeaderOnly, HotelOwnerLayout, AdminLayout } from "../components/Layout";

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

// Admin Pages
import AdminDashboard from '../pages/Admin/dashboard/dashboard';
import ManageUsers from '../pages/Admin/manageUsers/manageUsers';
import ManageHotelOwners from '../pages/Admin/manageHotelOwners/manageHotelOwners';
import ManageHotels from '../pages/Admin/manageHotels/manageHotels';
import ManageRequests from '../pages/Admin/manageRequets/manageRequests';
import AdminLogin from '../pages/Admin/login/login';
import RequestDetails from '../pages/Admin/RequestDetails/requestDetails';

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
        path: "/admin",
        layout: AdminLayout,
        component: AdminLogin,
    },
    {
        path: "/admin/dashboard",
        layout: AdminLayout,
        component: AdminDashboard,
    },
    {
        path: "/admin/manage-users",
        layout: AdminLayout,
        component: ManageUsers,
    },
    {
        path: "/admin/manage-hotel-owners",
        layout: AdminLayout,
        component: ManageHotelOwners,
    },
    {
        path: "/admin/manage-hotels",
        layout: AdminLayout,
        component: ManageHotels,
    },
    {
        path: "/admin/manage-requests",
        layout: AdminLayout,
        component: ManageRequests,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
