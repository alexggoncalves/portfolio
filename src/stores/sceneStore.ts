import { create } from "zustand";

export type View = "Center" | "Camera" | "Music";

type sceneStoreState = {
    view: View;
    setView: (view: View) => void;
    ready: boolean;
    setReady: () => void;
};

const useSceneStore = create<sceneStoreState>((set) => ({
    view: "Center",
    setView: (view) => set({ view }),
    ready: false,
    setReady: () => set({ ready: true }),
}));

export default useSceneStore;
