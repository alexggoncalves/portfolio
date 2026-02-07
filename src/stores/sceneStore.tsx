import { create } from "zustand";
import type { To, NavigateOptions } from "react-router";
import Color4 from "three/src/renderers/common/Color4.js";

type Scene = "loading" | "homepage" | "works" | "workDetails" | "contacts" | null

type SceneState = {
    isMobile: boolean;
    backgroundColor: Color4;
    currentScene: string | Scene;
    nextScene: string | Scene;
    navigate: (to: To, options?: NavigateOptions) => void | null;

    setInitialScene: (scene: string) => void;
    setScene: (scene: string) => void;
    endTransition: () => void;
    setIsMobile: (isMobile: boolean) => void;
};

const useSceneStore = create<SceneState>((set) => ({
    isMobile: window.innerWidth < 600,
    backgroundColor: new Color4(0.1,0.1,0.1,1),
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
