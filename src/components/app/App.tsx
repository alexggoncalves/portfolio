import "../../styles/css/App.css";

// import ErrorElement from "./ErrorElement";

// import { Outlet, useLocation, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import { buildGlobalAssets, requestAssets } from "../assets/assetStream";
import AsciiSceneStage from "./AsciiSceneStage";

import { AsciiRenderConfig } from "./AsciiRenderConfig";
import { createAsciiBlocks, createBrightnessMap } from "../assets/asciiBlocks";

function App() {
    // Error message
    // const error = useRouteError();
    // const location = useLocation();

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        createBrightnessMap(AsciiRenderConfig.asciiSequence);

        (async () => {
            await createAsciiBlocks();
            await requestAssets(buildGlobalAssets());
            setIsReady(true);
        })();
    }, []);

    // useEffect(() => {
    //     if (error) {
    //         setShowError(true);
    //         console.error("Route error:", error);
    //     } else {
    //         setShowError(false);
    //     }
    // }, [error, location.pathname]);

    return (
        <>
            {isReady && <AsciiSceneStage />}

            {/* {showError ? <ErrorElement /> : <Outlet />} */}
        </>
    );
}

export default App;
