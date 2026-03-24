import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Page } from "../components/pages/layout/Page";

import createPage from "../utils/createPage";
import useContentStore from "../stores/contentStore";
import useSceneStore from "../stores/sceneStore";

function usePageManager(location: any, isMobile: boolean, deps: any[]) {
    const { currentPage, nextPage, setCurrentPage, setNextPage } =
        useSceneStore();

    const { works } = useContentStore();

    const navigate = useNavigate();
    const goTo = (p: string) => navigate(p);

    useEffect(() => {
        // Create or switch pages when route or dependencies change
        updatePage();
    }, [...deps, location.pathname, isMobile]);

    function updatePage() {

        // Get path and remove first "/"
        const scene = location.pathname.slice(1);
        const newPage = createPage(scene, isMobile, goTo, works);

        // Restore last scroll 
        const pageScrolls = useSceneStore.getState().pageScrolls;
        const storedScroll: number = pageScrolls[newPage.name] || 0;
        newPage.scrollOffset = storedScroll;

        // Set page on first load and return
        if (!currentPage) {
            newPage.fadeSpeed = 3; // Slow down first fade in
            setCurrentPage(newPage);
            return;
        }

        startTransitionTo(newPage);
    }

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

        // When transition is complete, destroy the currentPage and replace with the new page
        currentPage.onFadeOutComplete = () => {
            currentPage.destroy?.();
            setCurrentPage(nextPage);
            setNextPage(null);
        };
    }, [currentPage, nextPage]);
}

export default usePageManager;
