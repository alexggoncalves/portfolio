import { create } from "zustand";
import Color4 from "three/src/renderers/common/Color4.js";
import type { Page } from "../components/elements/core/Page";

export type NavigationSource = "home" | "work";

type SceneState = {
    backgroundColor: Color4;
    distortion: { x: number; y: number };
    focalLength: { x: number; y: number };

    currentPage: Page | null;
    nextPage: Page | null;
    setCurrentPage: (page: Page) => void;
    setNextPage: (page: Page | null) => void;

    pageHeight: number;
    pageScrolls: Record<string, number>;
    setScroll: (pageName: string, scroll: number) => void;

    isMobile: boolean;
    setIsMobile: (isMobile: boolean) => void;

    navigationSource: NavigationSource | null;
    setNavigationSource: (source: NavigationSource | null) => void;
};

const useSceneStore = create<SceneState>((set) => ({
    backgroundColor: new Color4(0.1, 0.1, 0.1, 1),
    distortion: { x: 0.02, y: 0.02 },
    focalLength: { x: 0.96, y: 0.96 },

    pageHeight: 0,
    pageScrolls: {},
    isMobile: window.innerWidth < 600,
    currentPage: null,
    nextPage: null,

    navigationSource: null,

    setCurrentPage: (page: Page) =>
        set({ currentPage: page, pageHeight: page.pageHeight }),
    setNextPage: (page: Page | null) => set({ nextPage: page }),

    setScroll: (pageName: string, scroll: number) => {
        set((state) => ({
            pageScrolls: { ...state.pageScrolls, [pageName]: scroll },
        }));
    },

    setIsMobile: (isMobile: boolean) => set({ isMobile: isMobile }),
    setNavigationSource: (source: NavigationSource | null) =>
        set({ navigationSource: source }),
}));

export default useSceneStore;
