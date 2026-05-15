import LayoutRenderPipeline from "../layout/LayoutRenderPipeline";
import useAsciiRenderStore from "../../stores/asciiRenderStore";

import GridCanvasContainer from "./GridCanvasContainer";
import useAssetStore from "./assets/assetStore";
import { useEffect } from "react";

//*-------------------------------------------------------------------------
//* Scene Root: Root container for the ascii + normal layout app
//*     - Places canvas inside a grid aligned container
//*     - Starts the app's render pipeline
//  TODO - Load assets and create ascii brightness map here maybe ?
//* ------------------------------------------------------------------------
function AsciiLayoutRoot() {
    const charSize = useAsciiRenderStore((state) => state.charSize);
    const loadGlobalAssets = useAssetStore((state) => state.loadGlobalAssets);

    useEffect(() => {
        loadGlobalAssets();
        
    }, [loadGlobalAssets]);

    return (
        <GridCanvasContainer cellWidth={charSize.w} cellHeight={charSize.h}>
            <LayoutRenderPipeline />
        </GridCanvasContainer>
    );
}

export default AsciiLayoutRoot;
