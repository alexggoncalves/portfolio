import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";
import useFixedLayers from "../../hooks/useFixedLayers";

import SceneCanvas from "./SceneCanvas";
import LayoutRenderer from "./LayoutRenderer";
import Postprocessing from "./postprocessing/Postprocessing";

import SceneRenderer from "../scenes/SceneRenderer";

import usePageManager from "../../hooks/usePageManager";
import { Cursor } from "../elements/Cursor";
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

    // Initialize the page manager state
    usePageManager(location, isMobile, [gridSize.x, gridSize.y]);

    const [cursor] = useState<Cursor>(new Cursor()); 

    return (
        <>
            <SceneCanvas>
                <SceneRenderer />

                <LayoutRenderer
                    fixedLayers={fixedLayers}
                    cursor={cursor}
                />

                <Postprocessing/>
            </SceneCanvas>
        </>
    );
}

export default RenderStage;
