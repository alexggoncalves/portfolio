import "../../styles/css/App.css";

import { useEffect, useState } from "react";

import { AsciiRenderConfig } from "./config/AsciiRenderConfig";
import { createAsciiBlocks, createBrightnessMap } from "./assets/asciiBlocks";
import SceneRoot from "../layout/SceneRoot";

function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                createBrightnessMap(AsciiRenderConfig.asciiSequence);

                await createAsciiBlocks();
                // await requestAssets(buildGlobalAssets());

                setIsReady(true);
            } catch (err) {
                console.error("App init failed:", err);
            }
        };

        init();
    }, []);
    
    return <>{isReady && <SceneRoot />}</>;
}

export default App;
