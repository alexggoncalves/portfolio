import { create } from "zustand";

type SceneState = {
    isReady: boolean;

    isMobile: boolean;
    setIsMobile: (isMobile: boolean) => void;
};

const useSceneStore = create<SceneState>((set) => ({
    isReady: false,
    isMobile: window.innerWidth < 600,

    // navigationSource: null,

    setIsMobile: (isMobile: boolean) => set({ isMobile: isMobile }),
}));

export default useSceneStore;
