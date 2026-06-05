import { create } from "zustand";

export type Page = "home" | "work" | "contact";

type SceneStoreState = {
    page: Page;
    projectId: string | null;

    mobileSize: number;
    isMobile: boolean;
    isTouch: boolean;

    isFireworksLocked: boolean;

    setRoute: (page: Page, projectId: string | null) => void;
    setIsMobile: (value: boolean) => void;
    setIsTouch: (value: boolean) => void;
    setFireworksLocked: (value: boolean) => void;
};

const useSceneStore = create<SceneStoreState>((set) => ({
    page: "home",
    projectId: null,

    mobileSize: 700,
    isMobile: false,
    isTouch: false,

    isFireworksLocked: false,

    setRoute: (page, projectId) => set(() => ({ page, projectId })),
    setIsMobile: (value) => set(() => ({ isMobile: value })),
    setIsTouch: (value) => set(() => ({ isTouch: value })),

    setFireworksLocked: (value) => set(() => ({ isFireworksLocked: value })),
}));

export default useSceneStore;
