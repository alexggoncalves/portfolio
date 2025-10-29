import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";

import SceneCanvas from "./SceneCanvas";
import AsciiGlyphField from "../ASCIIField/AsciiGlyphField";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { ASCIIPage } from "../Pages/ASCIIPage";

import MainScene from "../Scenes/MainScene";

import { Frame } from "../Pages/Frame";
import { Navigation } from "../Pages/Navigation";

import { HomePage } from "../Pages/Homepage";
import { WorkPage } from "../Pages/WorkPage";
import { ContactsPage } from "../Pages/ContactsPage";


function useFixedElements(goTo: (path: string) => void, deps: any[]) {
    const [frameLayer, setFrameLayer] = useState<Frame | null>(null);
    const [navLayer, setNavLayer] = useState<Navigation | null>(null);

    useEffect(() => {
        const frameLayer = new Frame();
        frameLayer.init();
        setFrameLayer(frameLayer);

        const navLayer = new Navigation(goTo);
        navLayer.init();
        setNavLayer(navLayer);

        return () => {
            navLayer.destroy();
            frameLayer.destroy();
        };
    }, deps);

    if (!frameLayer || !navLayer) return [] as ASCIILayer[];
    return [frameLayer, navLayer];
}

function SceneHandler() {
    const [currentPage, setCurrentPage] = useState<ASCIIPage | null>(null);
    // const [nextPage, setNextPage] = useState<ASCIIPage | null>(null);

    const { uiTexture } = useAsciiStore();
    const { setScene } = useSceneStore();

    const location = useLocation();
    const navigate = useNavigate();
    const goTo = (path: string) => {
        navigate(path);
    };

    // Initialize frame and navigations layers
    const fixedElements = useFixedElements(goTo, [
        uiTexture?.width,
        uiTexture?.height,
    ]);

    // Set scene based on route
    useEffect(() => {
        const scene = location.pathname.slice(1);
        if (scene == "") {
            setScene("home");
            const page = new HomePage();
            page.init();
            setCurrentPage(page);
        } else if (scene == "work") {
            setScene("home");
            const page = new WorkPage();
            page.init();
            setCurrentPage(page);
        } else if (scene == "contacts") {
            setScene("home");
            const page = new ContactsPage();
            page.init();
            setCurrentPage(page);
        }

    }, [location]);

    return (
        <>
            <SceneCanvas>
                <MainScene />

                <AsciiGlyphField
                    fixedElements={fixedElements}
                    currentPage={currentPage}
                    nextPage={null}
                />
            </SceneCanvas>

            <div className="html-overlay"></div>
        </>
    );
}

export default SceneHandler;
