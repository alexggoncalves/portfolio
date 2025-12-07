import { useEffect, useState } from "react";

import { Frame } from "../components/Pages/Layers/Frame";
import { Navigation } from "../components/Pages/Layers/Navigation";
import { Layer } from "../components/PageRenderer/Layer";
import { useNavigate } from "react-router";

//---------------------------------------------------------------------
// useFixedElements (Hook): Initialize the fixed layers (Nav + Frame)
//---------------------------------------------------------------------
function useFixedLayers(deps: any[]) {
    const [frameLayer, setFrameLayer] = useState<Frame | null>(null);
    const [navLayer, setNavLayer] = useState<Navigation | null>(null);

    const navigate = useNavigate();
    const goTo = (p: string) => navigate(p);

    const isMobile = false;

    useEffect(() => {
        // Create and initialize page frame
        const frameLayer = new Frame();
        frameLayer.init();
        setFrameLayer(frameLayer);

        // Create and initialize navigation layer
        const navLayer = new Navigation(goTo);
        navLayer.init(isMobile);
        setNavLayer(navLayer);

        // Destroy elements on component unmount
        return () => {
            navLayer.destroy();
            frameLayer.destroy();
        };
    }, deps);

    if (!frameLayer || !navLayer) return [] as Layer[];
    return [frameLayer, navLayer];
}

export default useFixedLayers;
