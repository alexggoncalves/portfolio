import "../../styles/css/App.css";

import { useEffect, useState } from "react";

import AsciiLayoutRoot from "./AsciiLayoutRoot";
import useAsciiRenderStore from "../../stores/asciiRenderStore";
import useAssetStore from "./assets/assetStore";


function App() {
    const [isReady, setIsReady] = useState(false);

    const charSize = useAsciiRenderStore((state) => state.charSize);
    const loadGlobalAssets = useAssetStore((state) => state.loadGlobalAssets);

    useEffect(() => {
        loadGlobalAssets();
        
    }, [loadGlobalAssets]);


    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                // createBrightnessMap(AsciiRenderConfig.asciiSequence);

                // await createAsciiBlocks();
                // await requestAssets(buildGlobalAssets());

                if (isMounted) setIsReady(true);
            } catch (err) {
                console.error("App init failed:", err);
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            {/* <LayoutRoot>

            </LayoutRoot>
            <GridCanvasContainer cellWidth={charSize.w} cellHeight={charSize.h}>
                <LayoutRenderPipeline />
            </GridCanvasContainer> */}
            {isReady && <AsciiLayoutRoot />}
        </>
    );
}

export default App;
