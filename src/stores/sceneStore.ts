import { create } from "zustand";

export type Page = "home" | "projects" | "contact";

type SceneStoreState = {
    page: Page;
    projectId: string | null;

    mobileSize: number;
    isMobile: boolean;

    setRoute: (page: Page, projectId: string | null) => void;
    setIsMobile: (value: boolean) => void;
};

const useSceneStore = create<SceneStoreState>((set) => ({
    page: "home",
    projectId: null,

    mobileSize: 600,
    isMobile: false,

    setRoute: (page, projectId) => set(() => ({ page, projectId })),
    setIsMobile: (value) => set(() => ({ isMobile: value })),
}));

export default useSceneStore;
