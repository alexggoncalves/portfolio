import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";
import useWorkStore from "../../stores/workStore";

import type { Work } from "../../stores/workStore";

import SceneCanvas from "./SceneCanvas";
import AsciiGlyphField from "../ASCIIField/AsciiGlyphField";
import { ASCIILayer } from "../ASCIIField/ASCIILayer";
import { ASCIIPage } from "../ASCIIField/ASCIIPage";

import MainScene from "../3DScenes/MainScene";

import { Frame } from "../Pages/Elements/Frame";
import { Navigation } from "../Pages/Elements/Navigation";

import { HomePage } from "../Pages/HomePage";
import { WorkPage } from "../Pages/WorkPage";
import { ContactsPage } from "../Pages/ContactsPage";
import { WorkDetails } from "../Pages/WorkDetails";

//---------------------------------------------------------------------
// useFixedElements (Hook): Initialize the fixed layers (Nav + Frame)
//---------------------------------------------------------------------
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

//------------------------------------------------------------------------
// Create ASCII page: Initilializes an instance of the page to load
//-----------------------------------------------------------------------
function createPage(
    scene: string,
    isMobile: boolean,
    goTo: (path: string) => void,
    works: Work[]
): ASCIIPage {
    let page;
    if (scene == "") {
        // Homepage
        page = new HomePage();
        page.init(isMobile);
    } else if (scene == "contacts") {
        // Contacts page
        page = new ContactsPage();
        page.init(isMobile);
    } else if (scene.startsWith("work")) {
        // Work
        //[".../work"] and [".../work/:workId]"
        const parts = scene.split("/");

        if (parts[1]) {
            // If there is a workID open work details, else open works page
            const work = works.find((work) => work.id == parts[1]);
            if (work) {
                const workDetailsPage = new WorkDetails(work, goTo);
                workDetailsPage.init(isMobile);
                page = workDetailsPage;
            } else {
                // NOT FOUND !! (Not implemented)
                page = new HomePage();
                page.init(isMobile);
            }
        } else {
            const workPage = new WorkPage(works, goTo);
            workPage.init();
            page = workPage;
        }
    } else {
        // NOT FOUND PAGE!! (Not implemented)
        page = new HomePage();
        page.init(isMobile);
    }

    // Initialize opacity for fade transition
    page.opacity = 0;
    page.targetOpacity = 1;
    page.fadeSpeed = 5;

    return page;
}

//---------------------------------------------------------------------
// Scene Handler: Handle ASCII page and 3D Scene state based on route
//---------------------------------------------------------------------
function SceneHandler() {
    const [currentPage, setCurrentPage] = useState<ASCIIPage | null>(null);
    const [nextPage, setNextPage] = useState<ASCIIPage | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const goTo = (path: string) => {
        navigate(path);
    };

    const { uiTexture, canvasSize } = useAsciiStore();
    const { isMobile } = useSceneStore();
    const { works } = useWorkStore();

    // Initialize frame and navigations layers
    const fixedElements = useFixedElements(goTo, isMobile, [
        uiTexture?.width,
        uiTexture?.height,
    ]);

    // Change scene when route or sizes change
    useEffect(() => {
        // Get path and remove first "/"
        const scene = location.pathname.slice(1);
        const newPage = createPage(scene, isMobile, goTo, works);

        // Set page on first load and return
        if (!currentPage) {
            newPage.fadeSpeed = 3; // Slow down first fade in
            setCurrentPage(newPage);
            return;
        }

        // Start current fade
        currentPage.targetOpacity = 0;

        if (currentPage instanceof WorkPage) {
            currentPage.fadeImagesToAscii();
        }

        if (currentPage) currentPage.destroy();
        if (nextPage) nextPage.destroy();

        setNextPage(newPage);
    }, [location.pathname, isMobile, canvasSize.x, canvasSize.y]);

    // Handle page transitions
    useEffect(() => {
        if (!currentPage || !nextPage) return;

        // When transition is complete, destroy the currentPage and replace with the new page
        currentPage.onFadeOutComplete = () => {
            // currentPage.destroy?.();
            setCurrentPage(nextPage);
            setNextPage(null);
        };
    }, [currentPage, nextPage]);

    useEffect(() => {});

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
        </>
    );
}

export default SceneHandler;
