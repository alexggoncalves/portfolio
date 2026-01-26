import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";
import useFixedLayers from "../../hooks/useFixedLayers";

import SceneCanvas from "./SceneCanvas";
import PageRenderer from "../PageRenderer/PageRenderer";
import Postprocessing from "../PageRenderer/Postprocessing/Postprocessing";

import MainScene from "./3DScenes/MainScene";
import usePageManager from "../../hooks/usePageManager";
import { Cursor } from "../PageRenderer/Elements/Cursor";
import { useState } from "react";

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function RenderStage() {
    const location = useLocation();
    const { isMobile } = useSceneStore();
    const { gridSize } = useAsciiStore();
    
    // Initialize frame and navigations layers
    const fixedLayers = useFixedLayers([gridSize.x, gridSize.y, isMobile]);

    // Manage Pages (initialize and update)
    const { currentPage, nextPage } = usePageManager(location, isMobile, [gridSize.x, gridSize.y]);

    const [cursor] = useState<Cursor>(new Cursor()); 

    return (
        <>
            <SceneCanvas>
                <MainScene />

                <PageRenderer
                    fixedLayers={fixedLayers}
                    currentPage={currentPage}
                    nextPage={nextPage}
                    cursor={cursor}
                />

                <Postprocessing/>
            </SceneCanvas>
        </>
    );
}

export default RenderStage;
