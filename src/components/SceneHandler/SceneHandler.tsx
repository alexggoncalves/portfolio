import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";
import useFixedLayers from "../../hooks/useFixedLayers";

import SceneCanvas from "./SceneCanvas";
import PageRenderer from "../PageRenderer/PageRenderer";
import Postprocessing from "../PageRenderer/Postprocessing/Postprocessing";

import MediaViewer from "../Pages/MediaViewer/MediaViewer";

import MainScene from "./3DScenes/MainScene";
import usePageManager from "../../hooks/usePageManager";
import { ScrollControls } from "@react-three/drei";

//---------------------------------------------------------------------
// Scene Handler: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function SceneHandler() {
    const { uiTexture } = useAsciiStore();

    const location = useLocation();
    const { isMobile } = useSceneStore();

    // Initialize frame and navigations layers
    const fixedLayers = useFixedLayers([uiTexture?.width, uiTexture?.height]);

    // Manage Pages (initialize and update)
    const { currentPage, nextPage } = usePageManager(location, isMobile, [
        uiTexture?.width,
        uiTexture?.height,
    ]);

    return (
        <>
            <SceneCanvas>
                <MainScene />

                <PageRenderer
                    fixedLayers={fixedLayers}
                    currentPage={currentPage}
                    nextPage={nextPage}
                />

                <Postprocessing/>
            </SceneCanvas>

            <MediaViewer />
        </>
    );
}

export default SceneHandler;
