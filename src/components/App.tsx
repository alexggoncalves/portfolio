import { Outlet, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import LoadingScreen from "./layout/LoadingScreen";
import StarrySky from "./layout/StarrySky";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

import ProjectViewer from "./pages/project-viewer/ProjectViewer";
import RoomScene from "./scenes/Room/RoomScene";

import useScrollReset from "../hooks/useScrollReset";
import useSection from "../hooks/useSection";
import useLoadingProgress from "../hooks/useLoadingProgress";
import { prefetchAllProjects } from "../utils/prefetchMedia";

const App = () => {
    const [revealed, setRevealed] = useState(false);
    const [visibleProject, setVisibleProject] = useState<string | null>(null);
    const mainRef = useRef<HTMLElement>(null);

    const { loaded, progress } = useLoadingProgress()
    const section = useSection()

    useScrollReset(section, loaded)

    useEffect(() => {
        if (revealed) prefetchAllProjects();
    }, [revealed]);

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

    const showFooter = section !== "work" && !projectId;

    return (
        <>
            <LoadingScreen progress={progress} onReveal={() => setRevealed(true)} />

            <div id="scroll-container" className="scroll-container">
                <div className="scroll-container__content">
                    {/* Starry background */}
                    <StarrySky />

                    {/* Hero scene */}
                    <RoomScene active={section === "home"} paused={!!projectId} />

                    {/* App Content */}
                    <div className="app-content" inert={!revealed}>
                        <Header />

                        <div className="page">
                            {loaded && (
                                <main id="main" ref={mainRef} tabIndex={-1}>
                                    {/* App pages */}
                                    <Outlet />

                                    {/* Project Sliding Overlay */}
                                    {visibleProject && (
                                        <ProjectViewer projectId={visibleProject} isOpen={!!projectId} />
                                    )}
                                </main>
                            )}

                            {showFooter && <Footer />}
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}

export default App;
