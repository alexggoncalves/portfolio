import { create } from "zustand";

export type Page = "home" | "work" | "contact";

type SceneStoreState = {
    page: Page;
    projectId: string | null;

    mobileSize: number;
    isMobile: boolean;
    isTouch: boolean;

    isFireworksLocked: boolean;

    /** When true, preloaded UI assets are ready and `<main>` may mount. */
    isLoaded: boolean;

    setRoute: (page: Page, projectId: string | null) => void;
    setIsMobile: (value: boolean) => void;
    setIsTouch: (value: boolean) => void;
    setFireworksLocked: (value: boolean) => void;
    setIsLoaded: (value: boolean) => void;
};

const useSceneStore = create<SceneStoreState>((set) => ({
    page: "home",
    projectId: null,

    mobileSize: 700,
    isMobile: false,
    isTouch: false,

    isFireworksLocked: false,

    isLoaded: false,

    setRoute: (page, projectId) => set(() => ({ page, projectId })),
    setIsMobile: (value) => set(() => ({ isMobile: value })),
    setIsTouch: (value) => set(() => ({ isTouch: value })),

    setFireworksLocked: (value) => set(() => ({ isFireworksLocked: value })),

    setIsLoaded: (value) => set(() => ({ isLoaded: value })),
}));

export default useSceneStore;
