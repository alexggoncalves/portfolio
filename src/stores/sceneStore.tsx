import { create } from "zustand";

type SceneState = {
    isMobile: boolean;
    currentScene: string | null;
    nextScene: string | null;

    setInitialScene: (scene: string) => void;
    setScene: (scene: string) => void;
    endTransition: () => void;
};

const useSceneStore = create<SceneState>((set) => ({
    isMobile: window.innerWidth < 600,
    currentScene: null,
    nextScene: null,

    setInitialScene: (scene: string) =>
        set({ currentScene: scene, nextScene: null }),

    setScene: (scene: string) => set({ nextScene: scene }),

    endTransition: () =>
        set((state) => ({
            currentScene: state.nextScene,
            nextScene: null,
        })),
}));

export default useSceneStore;
