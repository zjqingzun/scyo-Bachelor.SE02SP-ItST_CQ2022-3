// Layouts
import { HeaderOnly } from "../components/Layout";

// Pages
import Home from "../pages/Home";
import About from "../pages/AboutUs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AfterSearch from "../pages/AfterSearch";
import Reserve from "~/pages/Reserve/Reserve";

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
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
