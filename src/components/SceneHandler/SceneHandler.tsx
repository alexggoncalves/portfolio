import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";
import useWorkStore from "../../stores/workStore";

import SceneCanvas from "./SceneCanvas";
import AsciiGlyphField from "../ASCIIField/AsciiGlyphField";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { ASCIIPage } from "../ASCIIField/ASCIIPage";

import MainScene from "../Scenes/MainScene";

import { Frame } from "../Pages/Frame";
import { Navigation } from "../Pages/Navigation";

import { HomePage } from "../Pages/HomePage";
import { WorkPage } from "../Pages/WorkPage";
import { ContactsPage } from "../Pages/ContactsPage";

// Create and initialize all elements that are fixed to the page
function useFixedElements(
    goTo: (path: string) => void,
    isMobile: boolean,
    deps: any[]
) {
    const [frameLayer, setFrameLayer] = useState<Frame | null>(null);
    const [navLayer, setNavLayer] = useState<Navigation | null>(null);

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

    if (!frameLayer || !navLayer) return [] as ASCIILayer[];
    return [frameLayer, navLayer];
}

function SceneHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const goTo = (path: string) => {
        navigate(path);
    };

    const [currentPage, setCurrentPage] = useState<ASCIIPage | null>(null);
    const [nextPage, setNextPage] = useState<ASCIIPage | null>(null);

    const { uiTexture } = useAsciiStore();
    const { setScene, isMobile } = useSceneStore();
    const { loaded, works } = useWorkStore();

    // Initialize frame and navigations layers
    const fixedElements = useFixedElements(goTo, isMobile, [
        uiTexture?.width,
        uiTexture?.height,
    ]);

    // Set scene based on route
    useEffect(() => {
        const newPage = createPageFromPath(location.pathname);

        if (!currentPage) {
            newPage.targetOpacity = 1;
            newPage.fadeSpeed = 2; // Slow down initial fade in
            newPage.opacity = 0;
            setCurrentPage(newPage);
            return;
        }

        currentPage.targetOpacity = 0;
        newPage.targetOpacity = 1;
        newPage.fadeSpeed = 6;
        newPage.opacity = 0;

        setNextPage(newPage);
    }, [location.pathname, isMobile]);

    useEffect(() => {
        if (!currentPage || !nextPage) return;

        // When transition is complete, destroy the currentPage and replace with the new page
        currentPage.onFadeOutComplete = () => {
            currentPage.destroy?.();
            setCurrentPage(nextPage);
            setNextPage(null);
        };
    }, [currentPage, nextPage]);

    const createPageFromPath = (path: String) => {
        const scene = path.slice(1);
        let page;

        if (scene == "") {
            setScene("home");
            page = new HomePage();
            page.init(isMobile);
        } else if (scene == "work") {
            setScene(scene);
            const workPage = new WorkPage(works);
            workPage.init();

            setTimeout(() => {
                workPage.fadeToFullImages();
            }, 100);
            page = workPage;
        } else if (scene == "contacts") {
            setScene(scene);
            page = new ContactsPage();
            page.init(isMobile);
        } else {
            setScene("error");
            page = new HomePage();
            page.init(isMobile);
        }

        return page;
    };

    return (
        <>
            <SceneCanvas>
                <MainScene />

                <AsciiGlyphField
                    fixedElements={fixedElements}
                    currentPage={currentPage}
                    nextPage={nextPage}
                />
            </SceneCanvas>

            <div className="html-overlay"></div>
        </>
    );
}

export default SceneHandler;
