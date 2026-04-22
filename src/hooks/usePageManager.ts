import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Page } from "../components/elements/core/Page";

import createPage from "../utils/createPage";
import { AppState } from "../components/app/AppState";
import { Navigation } from "../components/elements/ui/Navigation";

function usePageManager(location: any) {
    const currentPage = useRef<Page | null>(null);
    const nextPage = useRef<Page | null>(null);
    const nav = useRef<Navigation | null>(null);

    // prevents overlapping transitions
    const transitionId = useRef(0);

    // Set goTo function
    const navigateRef = useRef(useNavigate());
    const goTo = useCallback((path: string) => {
        navigateRef.current(path);
    }, []);

    // Create nav layer
    useEffect(() => {
        if (!nav.current) {
            nav.current = new Navigation(goTo);
            nav.current.init();
        }
        return () => {
            nav.current?.destroy();
            nav.current = null;
        };
    }, []);

    useEffect(() => {
        const scene = location.pathname.slice(1);

        const newPage = createPage(scene, goTo);

        // Get page last scroll
        const storedScroll = AppState.pageScrolls[newPage.name] || 0;
        newPage.scrollOffset = storedScroll;

        // Set page as current on first load
        if (!currentPage.current) {
            newPage.opacity = 0;
            newPage.targetOpacity = 1;
            newPage.fadeSpeed = 3;
            currentPage.current = newPage;
            AppState.pageHeight = newPage.pageHeight;
            return;
        }

        // Destroy any page currently on transition
        nextPage.current?.destroy?.();

        // Start transition
        startTransitionFromTo(currentPage.current, newPage);
    }, [location.pathname]);

    function startTransitionFromTo(from: Page, to: Page) {
        transitionId.current += 1;
        const id = transitionId.current;

        from.disableButtons();
        from.targetOpacity = 0;

        to.targetOpacity = 1;
        to.opacity = 0;
        nextPage.current = to;

        from.onFadeOutComplete = () => {
            if (id !== transitionId.current) return;

            // Destroy currentPage
            from.destroy?.();

            // Switch new page to current and set it's height to global state
            currentPage.current = to;
            nextPage.current = null;
            AppState.pageHeight = to.pageHeight;
        };
    }

    return {
        currentPage,
        nextPage,
        nav,
    };
}

export default usePageManager;
