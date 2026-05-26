import { matchPath, useLocation } from "react-router-dom";
import Nav from "./Nav";
import ProjectWindow from "./project-window/ProjectWindow";
import ProjectsGridPage from "./projects-grid/ProjectsGridPage";
import ContactPage from "./contact/ContactPage";
import HomePage from "./homepage/HomePage";
import type { Page } from "../../stores/routeStore";
import useRouteStore from "../../stores/routeStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
    const mainRef = useRef<HTMLElement>(null);
    const setRoute = useRouteStore((s) => s.setRoute);

    const activePage = getActivePage(pathname);
    const activeProjectId = getActiveProjectId(pathname);

    const [visibleProject, setVisibleProject] = useState<string | null>(null);

    // Handle route changes + projectWindow open + close
    useEffect(() => {
        setRoute(activePage, activeProjectId);

        if (activeProjectId) {
            setVisibleProject(activeProjectId);
        } else {
            const timeout = setTimeout(() => {
                setVisibleProject(null);
            }, 400);

            return () => clearTimeout(timeout);
        }
    }, [pathname, activeProjectId]);

    // Reset scroll of main on page change
    useLayoutEffect(() => {
        const el = mainRef.current;
        if (!el) return;

        el.scrollTop = 0;
    }, [activePage]);

    return (
        <>
            <Nav />
            <main ref={mainRef}>
                {activePage === "home" && <HomePage />}
                {activePage === "projects" && <ProjectsGridPage />}
                {activePage === "contact" && <ContactPage />}
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
