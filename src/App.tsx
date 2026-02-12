import "./styles/css/App.css";

import ErrorElement from "./components/elements/ErrorElement";

import { Outlet, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import useSceneStore from "./stores/sceneStore";
import RenderStage from "./components/render/RenderStage";
import CursorTracker from "./components/interaction/CursorTracker";
import AssetLoader from "./components/render/AssetLoader";

function App() {
    const { setIsMobile } = useSceneStore();

    // Detect mobile screen size
    useEffect(() => {
        if (window.innerWidth < 600) setIsMobile(true);
        else setIsMobile(false);
    }, [window.innerWidth, window.innerHeight]);

    // Error message
    const error = useRouteError();
    const [showError, setShowError] = useState(false);
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
            <AssetLoader/>
            <RenderStage />
            <CursorTracker/>

            <div id="dom-overlay">
                <header></header>
                <main></main>
            </div>

            {showError ? <ErrorElement /> : <Outlet />}
        </>
    );
}

export default App;
