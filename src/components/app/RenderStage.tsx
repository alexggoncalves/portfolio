import { useLocation } from "react-router";

import useSceneStore from "../../stores/sceneStore";

import SceneCanvas from "../render/SceneCanvas";
import LayoutRenderer from "../render/LayoutRenderer";
import Postprocessing from "../render/postprocessing/Postprocessing";

import SceneRenderer from "../scenes/SceneRenderer";

import usePageManager from "../../hooks/usePageManager";
import useNav from "../../hooks/useNav";
// import AssetLoader from "./AssetLoader";

//---------------------------------------------------------------------
// RenderStage: Handle page layout and 3d Scene + transitions
//---------------------------------------------------------------------
function RenderStage() {
    const location = useLocation();
    const { isMobile } = useSceneStore();

    // Initialize the page manager state
    usePageManager(location, isMobile);
   
    // Initialize frame and navigations layers
    const nav = useNav();
    return (
        <>
            <SceneCanvas>
                {/* <AssetLoader /> */}
                <SceneRenderer />
                <LayoutRenderer nav={nav} />

                <Postprocessing />
            </SceneCanvas>
        </>
    );
}

export default RenderStage;
