import "./styles/css/App.css";

import ErrorElement from "./components/SceneHandler/ErrorElement";

import { useNavigate, Outlet, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import SceneHandler from "./components/SceneHandler/SceneHandler";

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
            <SceneHandler />

            {showError ? <ErrorElement /> : <Outlet />}
        </>
    );
}

export default App;
