import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";

import SceneCanvas from "./SceneCanvas";
import LayoutRenderer from "./LayoutRenderer";
import Postprocessing from "./postprocessing/Postprocessing";

import SceneRenderer from "../scenes/SceneRenderer";

import usePageManager from "../../hooks/usePageManager";
import useNav from "../../hooks/useNav";
import { RenderConfig } from "./RenderConfig";

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function RenderStage() {
    const location = useLocation();
    const { isMobile } = useSceneStore();

    // Initialize the page manager state
    usePageManager(location, isMobile, []);
   
    // Initialize frame and navigations layers
    const nav = useNav([RenderConfig.gridSize.x, RenderConfig.gridSize.y, isMobile]);
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
