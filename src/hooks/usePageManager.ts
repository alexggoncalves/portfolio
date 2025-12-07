import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Page } from "../components/PageRenderer/Page";

import createPage from "../helpers/createPage";
import useContentStore from "../stores/contentStore";

function usePageManager(location: any, isMobile: boolean, deps: any[]) {
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [nextPage, setNextPage] = useState<Page | null>(null);

    const { works } = useContentStore();

    const navigate = useNavigate();
    const goTo = (p: string) => navigate(p);

    // Change scene when route or sizes change
    useEffect(() => {
        // Get path and remove first "/"
        const scene = location.pathname.slice(1);
        const newPage = createPage(scene, isMobile, goTo, works);

        // Set page on first load and return
        if (!currentPage) {
            newPage.fadeSpeed = 3; // Slow down first fade in
            setCurrentPage(newPage);
            return;
        }
        // Start current fade
        currentPage.targetOpacity = 0;

        if (currentPage) currentPage.destroy();
        if (nextPage) nextPage.destroy();

        setNextPage(newPage);
    }, [...deps, location, isMobile]);
    
    // Handle page transitions
    useEffect(() => {
        if (!currentPage || !nextPage) return;

        // When transition is complete, destroy the currentPage and replace with the new page
        currentPage.onFadeOutComplete = () => {
            // currentPage.destroy?.();
            setCurrentPage(nextPage);
            setNextPage(null);
        };
    }, [currentPage, nextPage]);

    return { currentPage, nextPage };
}

export default usePageManager;
