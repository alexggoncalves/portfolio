import { create } from "zustand";
import type { Page } from "../components/elements/core/Page";

type SceneState = {
    isReady: boolean;
    currentPage: Page | null;
    nextPage: Page | null;
    setCurrentPage: (page: Page) => void;
    setNextPage: (page: Page | null) => void;

    isMobile: boolean;
    setIsMobile: (isMobile: boolean) => void;
};

const useSceneStore = create<SceneState>((set) => ({
    isReady: false,
    isMobile: window.innerWidth < 600,
    currentPage: null,
    nextPage: null,

    // navigationSource: null,

    setCurrentPage: (page: Page) => set({ currentPage: page }),
    setNextPage: (page: Page | null) => set({ nextPage: page }),

    setIsMobile: (isMobile: boolean) => set({ isMobile: isMobile }),
}));

export default useSceneStore;
