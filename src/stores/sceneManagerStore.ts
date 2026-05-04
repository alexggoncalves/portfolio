import { create } from "zustand";

export type SceneId = "home" | "projects" | "contacts" | "more";

export type Device = "mobile" | "tablet" | "desktop";

type SceneManagerState = {
    activeSceneId: SceneId;
    nextSceneId: SceneId | null;
    isTransitioning: boolean;
    transitionProgress: number;

    navigationSource: SceneId;

    device: Device;
    // Transition management
    queueScene: (sceneId: SceneId) => void;
    setTransitionProgress: (progress: number) => void;
    endTransition: () => void;
};

const useSceneManager = create<SceneManagerState>((set, get) => ({
    activeSceneId: "home",
    nextSceneId: null,
    isTransitioning: false,
    transitionProgress: 0,

    navigationSource: "projects",

    device: "desktop",
    
    queueScene: (sceneId) => {
        const { activeSceneId, isTransitioning } = get();

        if (sceneId === activeSceneId && !isTransitioning) return;

        set({
            nextSceneId: sceneId,
            isTransitioning: true,
            transitionProgress: 0,
        });
    },
    setTransitionProgress: (progress) => {
        set({
            transitionProgress: Math.min(1, Math.max(0, progress)),
        });
    },
    endTransition: () => {
        const { nextSceneId, activeSceneId } = get();

        set({
            activeSceneId: nextSceneId ?? activeSceneId,
            nextSceneId: null,
            isTransitioning: false,
            transitionProgress: 0,
        });
    },
}));

export default useSceneManager;
