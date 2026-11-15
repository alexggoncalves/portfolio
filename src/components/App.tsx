import { Outlet, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import useStableCanvasSizes from "../hooks/useStableCanvasSizes";

import Header from "./layout/Header";
import LoadingScreen from "./layout/LoadingScreen";
import ProjectViewer from "./pages/project-viewer/ProjectViewer";
import Footer from "./layout/Footer";
import RoomScene from "./scenes/RoomScene";
import StarrySky from "./scenes/StarrySky";
import useScrollReset from "../hooks/useScrollReset";
import useSection from "../hooks/useSection";
import useLoadingProgress from "../hooks/useLoadingProgress";

const App = () => {
    const [revealed, setRevealed] = useState(false);
    const [visibleProject, setVisibleProject] = useState<string | null>(null);
    const mainRef = useRef<HTMLElement>(null);

    const { loaded, progress } = useLoadingProgress()
    const section = useSection()

    useStableCanvasSizes();
    useScrollReset(section, loaded)

    // Open project viewer page
    const { projectId } = useParams();
    useEffect(() => {
        if (projectId) {
            setVisibleProject(projectId);
            return;
        }
        const timeout = setTimeout(() => setVisibleProject(null), 500);
        return () => clearTimeout(timeout);
    }, [projectId]);

    // Reveal (fade in) website body
    useEffect(() => {
        document.body.classList.toggle("revealed", revealed);
    }, [revealed]);


    // Move focus into the page on reveal and page changes for screen readers
    useEffect(() => {
        if (!revealed) return;
        mainRef.current?.focus({ preventScroll: true });
    }, [revealed, section]);

    return (
        <>
            <LoadingScreen progress={progress} onReveal={() => setRevealed(true)} />
            <StarrySky />

            <RoomScene active={section === "home"} paused={!!projectId} />

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
