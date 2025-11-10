import { create } from "zustand";
import type { To, NavigateOptions } from "react-router";

type SceneState = {
    isMobile: boolean;
    currentScene: string | null;
    nextScene: string | null;
    navigate: (to: To, options?: NavigateOptions) => void | null;

    setInitialScene: (scene: string) => void;
    setScene: (scene: string) => void;
    endTransition: () => void;
    setIsMobile: (isMobile: boolean) => void;
};

const useSceneStore = create<SceneState>((set) => ({
    isMobile: window.innerWidth < 600,
    currentScene: null,
    nextScene: null,
    navigate: () => {},

    setInitialScene: (scene: string) =>
        set({ currentScene: scene, nextScene: null }),

    setScene: (scene: string) => set({ nextScene: scene }),

    endTransition: () =>
        set((state) => ({
            currentScene: state.nextScene,
            nextScene: null,
        })),

    setIsMobile: (isMobile: boolean) => set({ isMobile: isMobile }),
}));

export default useSceneStore;
