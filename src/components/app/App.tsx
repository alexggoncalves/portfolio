import "../../styles/css/App.css";

import { useEffect, useState } from "react";

import AsciiLayoutRoot from "./AsciiLayoutRoot";

function App() {
    const [isReady, setIsReady] = useState(false);

    // const asciiSequence = useAsciiRenderStore((state) => state.asciiSequence)

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

    return <>

    {isReady && <AsciiLayoutRoot />}</>;
}

export default App;
