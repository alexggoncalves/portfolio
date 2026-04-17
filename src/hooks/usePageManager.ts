import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { Page } from "../components/elements/core/Page";

import createPage from "../utils/createPage";
import useSceneStore from "../stores/sceneStore";
import { AppState } from "../components/app/AppState";
import useGridCanvasSize from "./useGridCanvasSize";

function usePageManager(location: any, isMobile: boolean) {
    const { setCurrentPage, setNextPage } = useSceneStore();

    const currentPage = useSceneStore((s) => s.currentPage);
    const nextPage = useSceneStore((s) => s.nextPage);

    const navigate = useNavigate();

    const goTo = useCallback(
        (p: string) => {
            navigate(p);
        },
        [navigate],
    );

    useEffect(() => {
        // Create or switch pages when route or dependencies change
        updatePage();
    }, [isMobile, location.pathname]);

    const updatePage = useCallback(() => {
        const scene = location.pathname.slice(1);

        const newPage = createPage(scene, isMobile, goTo);

        const storedScroll = AppState.pageScrolls[newPage.name] || 0;
        newPage.scrollOffset = storedScroll;

        if (!currentPage) {
            newPage.fadeSpeed = 3;
            setCurrentPage(newPage);
            AppState.pageHeight = newPage.pageHeight;
            return;
        }

        startTransitionTo(newPage);
    }, [location.pathname, isMobile, goTo, currentPage, setCurrentPage]);

    function startTransitionTo(page: Page) {
        if (!currentPage) return;

        currentPage.disableButtons();

        currentPage.targetOpacity = 0;
        page.targetOpacity = 1;

        setNextPage(page);
    }

    // Handle page transitions
    useEffect(() => {
        if (!currentPage || !nextPage) return;

        const next = nextPage;

        currentPage.onFadeOutComplete = () => {
            currentPage.destroy?.();
            setCurrentPage(next);
            AppState.pageHeight = next.pageHeight;
            setNextPage(null);
        };
    }, [currentPage, nextPage, setCurrentPage, setNextPage]);
}

export default usePageManager;
