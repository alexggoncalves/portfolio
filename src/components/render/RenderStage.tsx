import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";

import SceneCanvas from "./SceneCanvas";
import LayoutRenderer from "./LayoutRenderer";
import Postprocessing from "./postprocessing/Postprocessing";

import SceneRenderer from "../scenes/SceneRenderer";

import usePageManager from "../../hooks/usePageManager";
import useNav from "../../hooks/useNav";

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function RenderStage() {
    const location = useLocation();
    const { isMobile } = useSceneStore();
    const { gridSize } = useAsciiStore();

    // Initialize frame and navigations layers
    const nav = useNav([gridSize.x, gridSize.y, isMobile]);

    // Initialize the page manager state
    usePageManager(location, isMobile, [gridSize.x, gridSize.y]);

    return (
        <>
            <SceneCanvas>
                <SceneRenderer />

                <LayoutRenderer nav={nav} />

                <Postprocessing />
            </SceneCanvas>
        </>
    );
}

export default RenderStage;
