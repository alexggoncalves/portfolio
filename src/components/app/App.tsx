import "../../styles/css/App.css";

// import ErrorElement from "./ErrorElement";

// import { Outlet, useLocation, useRouteError } from "react-router";
import { useEffect } from "react";

import { buildGlobalAssets, requestAssets } from "../assets/assetStream";
import useSceneStore from "../../stores/sceneStore";
import AsciiSceneStage from "./AsciiSceneStage";
import {
    createAsciiTeamNames,
    createAsciiTitleArrays,
    createBrightnessMap,
} from "../assets/contentAssets";
import { AsciiRenderConfig } from "./RenderConfig";

function App() {
    // Error message
    // const error = useRouteError();
    // const location = useLocation();

    const isReady = useSceneStore((s) => s.isReady);

    useEffect(() => {
        createBrightnessMap(AsciiRenderConfig.asciiSequence);

        (async () => {
            await createAsciiTitleArrays();
            await createAsciiTeamNames();
            await requestAssets(buildGlobalAssets());
            useSceneStore.setState({ isReady: true });
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
