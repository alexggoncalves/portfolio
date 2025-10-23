import "./styles/css/App.css";

import SceneCanvas from "./components/SceneCanvas";
import MainScene from "./components/MainScene";
import ErrorElement from "./components/ErrorElement";

import { useNavigate, Outlet, useRouteError, useLocation } from "react-router";
import { useEffect, useState } from "react";

function App() {
    const navigate = useNavigate();
    const error = useRouteError();

    const [showError, setShowError] = useState(false);

    // Redirect to mobile version
    useEffect(() => {
        if (window.innerWidth < 600) navigate("/mobile");
    }, []);

    useEffect(() => {
        if (error) {
            setShowError(true);
            console.error("Route error:", error);
        } else {
            setShowError(false);
        }
    }, [error, location]);

    return (
        <>
            <SceneCanvas>
                <MainScene />
            </SceneCanvas>

            {showError ? <ErrorElement /> : <Outlet />}
        </>
    );
}

export default App;
