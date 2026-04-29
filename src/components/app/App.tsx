import "../../styles/css/App.css";

import { useEffect, useState } from "react";

import { buildGlobalAssets, requestAssets } from "../assets/assetStream";
import AsciiSceneStage from "./AsciiSceneStage";

import { AsciiRenderConfig } from "./AsciiRenderConfig";
import { createAsciiBlocks, createBrightnessMap } from "../assets/asciiBlocks";

function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                createBrightnessMap(AsciiRenderConfig.asciiSequence);

                await createAsciiBlocks();
                await requestAssets(buildGlobalAssets());

                setIsReady(true);
            } catch (err) {
                console.error("App init failed:", err);
            }
        };

        init();
    }, []);
    
    return <>{isReady && <AsciiSceneStage />}</>;
}

export default App;
