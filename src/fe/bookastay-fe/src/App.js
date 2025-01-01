import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./utils/i18n";

import { publicRoutes } from "./routes";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { Fragment, useEffect } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccount } from "./redux/action/accountAction";

function App() {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.account.userInfo);

    useEffect(() => {
        if (userInfo && !userInfo.email) {
            dispatch(doGetAccount());
        }
    }, []);

    return (
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
                    </Routes>
                </div>
            </Suspense>
        </Router>
    );
}

export default App;
