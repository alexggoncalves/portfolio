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

    // Mobile check
    const setIsMobile = useSceneStore((s) => s.setIsMobile);
    const mobileSize = useSceneStore((s) => s.mobileSize);
    const setIsTouch = useSceneStore((s) => s.setIsTouch);
    useEffect(() => {
        const check = () => {
            setIsMobile(window.innerWidth <= mobileSize);

            setIsTouch(
                window.matchMedia("(pointer: coarse)").matches ||
                    navigator.maxTouchPoints > 0,
            );
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <>
            <Nav />
            <main ref={mainRef}>
                <AsciiStage />

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
        </>
    );
}

export default LayoutRoot;
