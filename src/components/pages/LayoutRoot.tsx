import { matchPath, useLocation } from "react-router-dom";
// import type { Page } from "../../stores/sceneStore";
// import useSceneStore from "../../stores/sceneStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import ProjectViewer from "./project-viewer/ProjectViewer";
import Header from "../Header";
import ProjectsGridPage from "./projects-grid/ProjectsGridPage";
import ContactPage from "./contact/ContactPage";
import HomePage from "./homepage/HomePage";
import useImagePreloader from "../../hooks/useImagePreloader";
import { imagesToPreload } from "../../data/content";
import LoadingScreen from "../LoadingScreen";

export type Page = "home" | "work" | "contact";

const BASE_PATHS = ["work", "contact"];

const getActivePage = (pathname: string): Page => {
    if (pathname.startsWith("/work")) return "work";
    if (pathname === "/contact") return "contact";
    return "home";
};

const getActiveProjectId = (pathname: string): string | null => {
    const match =
        matchPath("/:projectId", pathname) ||
        matchPath("/work/:projectId", pathname);

    const id = match?.params.projectId;

    // "/work" and "/contact" aren't project ids
    return id && !BASE_PATHS.includes(id) ? id : null;
};

function LayoutRoot() {
    const { pathname } = useLocation();
    const page = getActivePage(pathname);
    const projectId = getActiveProjectId(pathname);

    const { loaded, progress } = useImagePreloader(imagesToPreload);

    const mainRef = useRef<HTMLElement>(null);

    const activePage = getActivePage(pathname);
    const activeProjectId = getActiveProjectId(pathname);

    const [visibleProject, setVisibleProject] = useState<string | null>(null);

    // Project window open + delayed close
    useEffect(() => {
        if (projectId) {
            setVisibleProject(projectId);
            return;
        }

        const timeout = setTimeout(() => setVisibleProject(null), 400);
        return () => clearTimeout(timeout);
    }, [projectId]);

    // Reset scroll of main on page change
    useLayoutEffect(() => {
        if (mainRef.current) mainRef.current.scrollTop = 0;
    }, [page, loaded]);

    return (
        <>
            <LoadingScreen progress={progress} />
            <Header />

            {loaded && (
                <main ref={mainRef}>
                    {activePage === "home" && <HomePage />}
                    {activePage === "work" && <ProjectsGridPage />}
                    {activePage === "contact" && <ContactPage />}

                    {visibleProject && (
                        <ProjectViewer
                            projectId={visibleProject}
                            isOpen={!!activeProjectId}
                        />
                    )}
                </main>
            )}
        </>
    );
}

export default LayoutRoot;
