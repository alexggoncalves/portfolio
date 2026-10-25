import { Outlet, useLocation, useParams } from "react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { View } from "@react-three/drei";

import useImagePreloader from "../hooks/useImagePreloader";
import { imagesToPreload } from "../data/content";

import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import ProjectViewer from "./pages/project-viewer/ProjectViewer";
import Footer from "./Footer";
import { Canvas } from "@react-three/fiber";
import StarrySkyScene from "./general/StarrySkyScene";

const App = () => {
    const [revealed, setRevealed] = useState(false);
    const [visibleProject, setVisibleProject] = useState<string | null>(null);

    const { pathname } = useLocation();
    const { projectId } = useParams();
    const { loaded, progress } = useImagePreloader(imagesToPreload);

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
        window.scrollTo(0, 0);
    }, [section, loaded]);

    // Fixed pixel sizes for canvases that ignore the mobile toolbar showing/hiding
    useEffect(() => {
        let lastWidth = 0;

        const setSizes = () => {
            if (window.innerWidth === lastWidth) return; // toolbar show/hide only changes height
            lastWidth = window.innerWidth;

            const root = document.documentElement.style;
            root.setProperty("--canvas-height", `${Math.max(window.innerHeight, window.screen.height)}px`);
            root.setProperty("--hero-height", `${window.innerHeight}px`);
        };

        setSizes();
        window.addEventListener("resize", setSizes);
        return () => window.removeEventListener("resize", setSizes);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("revealed", revealed);
    }, [revealed]);

    return (
        <>
            <LoadingScreen progress={progress} onReveal={() => setRevealed(true)} />

            <Canvas
                className="app-canvas"
                eventSource={document.getElementById("root")!}
            >
                <View.Port />
            </Canvas>

            <Header />

            <StarrySkyScene />

            {loaded && (
                <main>

                    <Outlet />
                    {visibleProject && (
                        <ProjectViewer projectId={visibleProject} isOpen={!!projectId} />
                    )}

                </main>
            )}

            {section !== "work" && <Footer />}
        </>
    );
}

export default App;
