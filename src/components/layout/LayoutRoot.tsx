import { matchPath, useLocation } from "react-router-dom";
import Nav from "./general/Nav";
import ProjectWindow from "./project-window/ProjectWindow";
import ProjectsGridPage from "./projects-grid/ProjectsGridPage";
import ContactPage from "./contact/ContactPage";
import HomePage from "./homepage/HomePage";
import type { Page } from "../../stores/sceneStore";
import useSceneStore from "../../stores/sceneStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AsciiStage from "../ascii/AsciiStage";

const PAGES = ["work", "contact"] as Page[];

const getActivePage = (pathname: string): Page => {
    if (pathname.startsWith("/work")) return "work";
    if (pathname === "/contact") return "contact";
    return "home";
};

const getActiveProjectId = (pathname: string): string | null => {
    const match =
        matchPath("/:projectId", pathname) ||
        matchPath("/work/:projectId", pathname);

    const id = match?.params?.projectId;

    // Exclude "/contacts" and "/projects" as project ids
    const isBasePath = PAGES.includes(id as Page);

    return id && !isBasePath ? id : null;
};

function LayoutRoot() {
    const { pathname } = useLocation();
    const mainRef = useRef<HTMLElement>(null);
    const setRoute = useSceneStore((s) => s.setRoute);
    const isLoaded = useSceneStore((s) => s.isLoaded);

    const activePage = getActivePage(pathname);
    const activeProjectId = getActiveProjectId(pathname);

    const [visibleProject, setVisibleProject] = useState<string | null>(null);

    // Keep scene store in sync with the URL before paint so AsciiScene never
    // renders one frame of the wrong page (avoids ASCII / logo glitches).
    useLayoutEffect(() => {
        setRoute(activePage, activeProjectId);
    }, [activePage, activeProjectId, setRoute]);

    // Project window open + delayed close
    useEffect(() => {
        if (activeProjectId) {
            setVisibleProject(activeProjectId);
        } else {
            const timeout = setTimeout(() => {
                setVisibleProject(null);
            }, 400);

            return () => clearTimeout(timeout);
        }
    }, [activeProjectId]);

    // Reset scroll of main on page change
    useLayoutEffect(() => {
        const el = mainRef.current;
        if (!el) return;

        el.scrollTop = 0;
    }, [activePage, isLoaded]);

    // Mobile check
    const setIsMobile = useSceneStore((s) => s.setIsMobile);
    const setIsTouch = useSceneStore((s) => s.setIsTouch);

    useEffect(() => {
    const check = () => {
        const { mobileSize } = useSceneStore.getState();
        setIsMobile(window.innerWidth <= mobileSize);
        setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
}, [setIsMobile, setIsTouch]);

    return (
        <>
            <Nav />
            <AsciiStage />

            {isLoaded && (
                <main ref={mainRef}>
                    {activePage === "home" && <HomePage />}
                    {activePage === "work" && <ProjectsGridPage />}
                    {activePage === "contact" && <ContactPage />}

                    {visibleProject && (
                        <ProjectWindow
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
