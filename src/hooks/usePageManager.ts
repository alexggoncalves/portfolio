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

    // Set goTo function
    const navigate = useNavigate();
    const goTo = useCallback(
        (path: string) => {
            navigate(path);
        },
        [navigate],
    );

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
        nextPage.current = null;

        // Start transition
        startTransitionFromTo(currentPage.current, newPage);
    }, [location.pathname]);

    function startTransitionFromTo(from: Page, to: Page) {
        from.disableButtons();
        from.targetOpacity = 0;

        to.opacity = 0;
        to.targetOpacity = 1;

        nextPage.current = to;

        from.onFadeOutComplete = () => {
            
            if (nextPage.current !== to) {
                to.destroy?.();
                return;
            }

            from.destroy?.();

            currentPage.current = to;
            nextPage.current = null;
            AppState.pageHeight = to.pageHeight;

            to.targetOpacity = 1;
        };
    }

    useEffect(() => {
        return () => {
            currentPage.current?.destroy?.();
            nextPage.current?.destroy?.();
            nav.current?.destroy?.();

            currentPage.current = null;
            nextPage.current = null;
            nav.current = null;
        };
    }, []);

    return {
        currentPage,
        nextPage,
        nav,
    };
}

export default usePageManager;
