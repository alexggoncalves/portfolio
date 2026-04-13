import "./styles/css/App.css";

import ErrorElement from "./components/elements/ui/ErrorElement";

import { Outlet, useLocation, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import RenderStage from "./components/app/RenderStage";
import { buildGlobalAssets, requestAssets } from "./components/app/assetStream";
import useSceneStore from "./stores/sceneStore";

function App() {
    // Error message
    const error = useRouteError();
    const [showError, setShowError] = useState(false);
    const location = useLocation();

    const isReady = useSceneStore((s) => s.isReady);

    useEffect(() => {
        requestAssets(buildGlobalAssets()).then(()=>{
            useSceneStore.setState({ isReady: true });
        });
    }, []);

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
            {isReady && <RenderStage />}

            {showError ? <ErrorElement /> : <Outlet />}
        </>
    );
}

export default App;
