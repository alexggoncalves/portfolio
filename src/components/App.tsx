import { Outlet, useLocation, useNavigationType, useParams } from "react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";

import useImagePreloader from "../hooks/useImagePreloader";
import useStableCanvasSizes from "../hooks/useStableCanvasSizes";
import { imagesToPreload } from "../data/content";

import Header from "./layout/Header";
import LoadingScreen from "./layout/LoadingScreen";
import ProjectViewer from "./pages/project-viewer/ProjectViewer";
import Footer from "./layout/Footer";
import { Canvas } from "@react-three/fiber";
import StarrySkyScene from "./scenes/StarrySkyScene";
import HeroScene from "./scenes/HeroScene";

const SECTION_TITLES = {
    home: "Alex — Creative Developer",
    work: "Work — Alex",
    contact: "Contact — Alex",
}

const App = () => {
    const [revealed, setRevealed] = useState(false);
    const [visibleProject, setVisibleProject] = useState<string | null>(null);
    const mainRef = useRef<HTMLElement>(null);

    const { pathname } = useLocation();
    const { projectId } = useParams();
    const navigationType = useNavigationType();

    const { loaded, progress } = useImagePreloader(imagesToPreload);
    useStableCanvasSizes();

    // Reveal (fade in) website body
    useEffect(() => {
        document.body.classList.toggle("revealed", revealed);
    }, [revealed]);

    // Open project viewer page
    useEffect(() => {
        if (projectId) {
            setVisibleProject(projectId);
            return;
        }
        const timeout = setTimeout(() => setVisibleProject(null), 400);
        return () => clearTimeout(timeout);
    }, [projectId]);

    // Scroll to top when the page changes
    const section = pathname.startsWith("/work") ? "work" : pathname === "/contact" ? "contact" : "home";
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [section, loaded]);

    // Set page title for screen readers
    useEffect(() => {
        document.title = SECTION_TITLES[section];
    }, [section]);

    // Move focus into the page on reveal and page changes for screen readers
    useEffect(() => {
        if (!revealed) return;
        mainRef.current?.focus({ preventScroll: true });
    }, [revealed, section]);

    // Fade the new page in once it has rendered
    useLayoutEffect(() => {
        document.documentElement.classList.remove("page-leaving");
    }, [pathname]);

    // Disable transition when navigating with browser's back and forward
    useLayoutEffect(() => {
        const html = document.documentElement;
        html.classList.remove("page-leaving");
        html.classList.toggle("page-pop", navigationType === "POP");
    }, [pathname, navigationType]);

    return (
        <>
            <LoadingScreen progress={progress} onReveal={() => setRevealed(true)} />

            <Canvas
                className="app-canvas"
                aria-hidden="true"
                eventSource={document.getElementById("root")!}
            >
                <View.Port />
            </Canvas>

            <StarrySkyScene />
            <HeroScene active={section === "home"} />

            <div className="app-content" inert={!revealed}>
                <Header />

                <div className="page">
                    {loaded && (
                        <main id="main" ref={mainRef} tabIndex={-1}>
                            <Outlet />
                            {visibleProject && (
                                <ProjectViewer projectId={visibleProject} isOpen={!!projectId} />
                            )}

                        </main>
                    )}

                    {section !== "work" && !projectId && <Footer />}
                </div>
            </div>
        </>
    );
}

export default App;
