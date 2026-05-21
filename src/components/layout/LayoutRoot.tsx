import { matchPath, useLocation } from "react-router-dom";
import Nav from "./Nav";
import ProjectWindow from "./project-window/ProjectWindow";
import ProjectsGridPage from "./projects-grid/ProjectsGridPage";
import ContactPage from "./contact/ContactPage";
import HomePage from "./homepage/HomePage";
import type { Page } from "../../stores/routeStore";
import useRouteStore from "../../stores/routeStore";
import { useEffect, useState } from "react";

const PAGES = ["projects", "contact"] as Page[];

const getActivePage = (pathname: string): Page => {
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname === "/contact") return "contact";
    return "home";
};

const getActiveProjectId = (pathname: string): string | null => {
    const match =
        matchPath("/:projectId", pathname) ||
        matchPath("/projects/:projectId", pathname);

    const id = match?.params?.projectId;

    // Exclude "/contacts" and "/projects" as project ids
    const isBasePath = PAGES.includes(id as Page);

    return id && !isBasePath ? id : null;
};

function LayoutRoot() {
    const { pathname } = useLocation();
    const setRoute = useRouteStore((s) => s.setRoute);

    const activePage = getActivePage(pathname);
    const activeProjectId = getActiveProjectId(pathname);

    const [visibleProject, setVisibleProject] = useState<string | null>(null);

    useEffect(() => {
    setRoute(activePage, activeProjectId);

    if (activeProjectId) {
        setVisibleProject(activeProjectId);
    } else {
        // ALWAYS run this when project closes
        const timeout = setTimeout(() => {
            setVisibleProject(null);
        }, 400);

        return () => clearTimeout(timeout);
    }
}, [pathname, activeProjectId]);

    return (
        <>
            <Nav />
            <main>
                <div
                    style={{
                        display: activePage === "home" ? "block" : "none",
                    }}
                >
                    <HomePage />
                </div>
                <div
                    style={{
                        display: activePage === "projects" ? "block" : "none",
                    }}
                >
                    <ProjectsGridPage />
                </div>
                <div
                    style={{
                        display: activePage === "contact" ? "block" : "none",
                    }}
                >
                    <ContactPage />
                </div>
            </main>

            {visibleProject && (
                <ProjectWindow
                    projectId={visibleProject}
                    isOpen={!!activeProjectId}
                />
            )}
        </>
    );
}

export default LayoutRoot;
