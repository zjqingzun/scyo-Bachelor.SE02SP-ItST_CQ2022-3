// Layouts
import { HeaderOnly, HotelOwnerLayout, AdminLayout, NoneLayout } from "../components/Layout";

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
import {
    Dashboard,
    Room,
    Guest,
    AddRoom,
    RoomType,
    OrderDetail,
    Login as HotelOwnerLogin,
    Register as HotelOwnerRegister,
} from "~/pages/HotelOwner";
import Unauthorized from "~/pages/Unauthorized/Unauthorized";

// Admin Pages
import AdminDashboard from "../pages/Admin/dashboard/dashboard";
import ManageUsers from "../pages/Admin/manageUsers/manageUsers";
import ManageHotelOwners from "../pages/Admin/manageHotelOwners/manageHotelOwners";
import ManageHotels from "../pages/Admin/manageHotels/manageHotels";
import ManageRequests from "../pages/Admin/manageRequets/manageRequests";
import AdminLogin from "../pages/Admin/login/login";
import RequestDetails from "../pages/Admin/RequestDetails/requestDetails";
import NotFound from "~/pages/NotFound/NotFound";

const publicRoutes = [
    {
        path: "/",
        component: Home,
        requiredRole: ["guest", "user"],
    },
    {
        path: "/unauthorized",
        component: Unauthorized,
        layout: NoneLayout,
    },
    {
        path: "/about",
        component: About,
        requiredRole: ["guest", "user", "hotelier", "admin"],
    },
    {
        path: "/after-search",
        component: AfterSearch,
        requiredRole: ["guest", "user"],
    },
    {
        path: "/reserve",
        component: Reserve,
        requiredRole: ["user"],
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
        path: "/history",
        component: History,
        requiredRole: ["user"],
    },
    {
        path: "/favorite",
        component: Favorite,
        requiredRole: ["user"],
    },
    {
        path: "/account-setting",
        component: AccountSetting,
        requiredRole: ["user", "hotelier", "admin"],
    },
    {
        path: "/review",
        component: Review,
        requiredRole: ["user"],
    },
    {
        path: "/hotel/:id",
        component: HotelDetails,
        requiredRole: ["user", "guest"],
    },
    {
        path: "/hotel-owner/register-hotel",
        component: RegisterHotel,
        layout: HeaderOnly,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner/dashboard",
        component: Dashboard,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner/room",
        component: Room,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner/guest",
        component: Guest,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner/order-detail/:userId/:reservationId",
        component: OrderDetail,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner",
        component: Dashboard,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner/login",
        component: HotelOwnerLogin,
        layout: NoneLayout,
    },
    {
        path: "/hotel-owner/register",
        component: HotelOwnerRegister,
        layout: NoneLayout,
    },
    {
        path: "/hotel-owner/room/add-room",
        component: AddRoom,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/hotel-owner/room-type",
        component: RoomType,
        layout: HotelOwnerLayout,
        requiredRole: ["hotelier"],
    },
    {
        path: "/admin/login",
        component: AdminLogin,
        layout: NoneLayout,
    },
    {
        path: "/admin/dashboard",
        layout: AdminLayout,
        component: AdminDashboard,
        requiredRole: ["admin"],
    },
    {
        path: "/admin/manage-users",
        layout: AdminLayout,
        component: ManageUsers,
        requiredRole: ["admin"],
    },
    {
        path: "/admin/manage-hotel-owners",
        layout: AdminLayout,
        component: ManageHotelOwners,
        requiredRole: ["admin"],
    },
    {
        path: "/admin/manage-hotels",
        layout: AdminLayout,
        component: ManageHotels,
        requiredRole: ["admin"],
    },
    {
        path: "/admin/manage-requests",
        layout: AdminLayout,
        component: ManageRequests,
        requiredRole: ["admin"],
    },
    {
        path: "/not-found",
        component: NotFound,
        layout: NoneLayout,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
