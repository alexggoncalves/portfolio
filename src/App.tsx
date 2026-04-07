import "./styles/css/App.css";

import ErrorElement from "./components/elements/ErrorElement";

import { Outlet, useLocation, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import useSceneStore from "./stores/sceneStore";
import RenderStage from "./components/render/RenderStage";
import AssetLoader from "./components/render/AssetLoader";

function App() {
    const { setIsMobile } = useSceneStore();

    // Detect mobile screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        handleResize(); // Initial check

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
