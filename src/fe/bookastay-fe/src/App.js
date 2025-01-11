import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./utils/i18n";

import { publicRoutes } from "./routes";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { Fragment, useEffect } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

import { doGetAccount } from "./redux/action/accountAction";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RestrictedRoute from "./components/RestrictedRoute/RestrictedRoute";

function App() {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.account.userInfo);
    const isLoading = useSelector((state) => state.account.isLoading);

    useEffect(() => {
        if (userInfo && !userInfo.email) {
            dispatch(doGetAccount());
        }
    }, [dispatch, userInfo]);

    return (
        <>
            {isLoading && (
                <Flex
                    gap="middle"
                    vertical
                    align="center"
                    justify="center"
                    style={{
                        height: "100vh",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        zIndex: 9999,
                    }}
                >
                    <Flex gap="middle">
                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{
                                        fontSize: 50,
                                        fontWeight: "bold",
                                    }}
                                    spin
                                />
                            }
                            size="large"
                        ></Spin>
                    </Flex>
                </Flex>
            )}

            <Router>
                <Suspense fallback="...is loading">
                    <div className="App">
                        <ToastContainer />
                        <Routes>
                            {publicRoutes.map((route, index) => {
                                const Page = route.component;

                                let Layout = DefaultLayout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }

                                if (route.restricted === true) {
                                    return (
                                        <Route key={index} element={<RestrictedRoute />}>
                                            <Route
                                                path={route.path}
                                                element={
                                                    <Layout>
                                                        <Page />
                                                    </Layout>
                                                }
                                            />
                                        </Route>
                                    );
                                }

                                // Kiểm tra xem route có yêu cầu role không
                                if (route.requiredRole) {
                                    return (
                                        <Route
                                            key={index}
                                            element={
                                                <PrivateRoute requiredRole={route.requiredRole} />
                                            }
                                        >
                                            <Route
                                                path={route.path}
                                                element={
                                                    <Layout>
                                                        <Page />
                                                    </Layout>
                                                }
                                            />
                                        </Route>
                                    );
                                }
                                // Nếu không yêu cầu role thì render ra bình thường
                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                            <Route path="*" element={<Navigate to="/not-found" />} />
                        </Routes>
                    </div>
                </Suspense>
            </Router>
        </>
    );
}

export default App;
