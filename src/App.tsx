import "./styles/css/App.css";

import ErrorElement from "./components/elements/ui/ErrorElement";

import { Outlet, useLocation, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import RenderStage from "./components/render/RenderStage";
import AssetLoader from "./components/render/AssetLoader";

function App() {
    // Error message
    const error = useRouteError();
    const [showError, setShowError] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (error) {
            setShowError(true);
            console.error("Route error:", error);
        } else {
            setShowError(false);
        }
    }, [error, location.pathname]);

    return (
        <>
            <AssetLoader />
            <RenderStage />

            {showError ? <ErrorElement /> : <Outlet />}
        </>
    );
}

export default App;
