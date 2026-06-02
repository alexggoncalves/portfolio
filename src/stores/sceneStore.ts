import { create } from "zustand";

export type Page = "home" | "projects" | "contact";

type SceneStoreState = {
    page: Page;
    projectId: string | null;

    bgColor: string;

    mobileSize: number;
    isMobile: boolean;

    setRoute: (page: Page, projectId: string | null) => void;
    setIsMobile: (value: boolean) => void;
};

const useSceneStore = create<SceneStoreState>((set) => ({
    page: "home",
    projectId: null,

    bgColor: "rgb(13, 13, 19)",

    mobileSize: 700,
    isMobile: false,

    setRoute: (page, projectId) => set(() => ({ page, projectId })),
    setIsMobile: (value) => set(() => ({ isMobile: value })),
}));

export default useSceneStore;
