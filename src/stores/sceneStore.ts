import { create } from "zustand";
import { photos } from "../data/content"

export type View = "Center" | "Camera" | "Music";

type sceneStoreState = {
    view: View;
    setView: (view: View) => void;

    // Photos
    photoIndex: number;
    photoPress: { dir: 1 | -1; id: number };
    stepPhoto: (dir: 1 | -1) => void;

    ready: boolean;
    setReady: () => void;
};

const useSceneStore = create<sceneStoreState>((set) => ({
    view: "Center",
    setView: (view) => set({ view }),

    photoIndex: 0,
    photoPress: { dir: 1, id: 0 },
    stepPhoto: (dir) =>
        set((s) => ({
            photoIndex: (s.photoIndex + dir + photos.length) % photos.length,
            photoPress: { dir, id: s.photoPress.id + 1 },
        })),

    ready: false,
    setReady: () => set({ ready: true }),
}));

export default useSceneStore;
