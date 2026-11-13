import { create } from "zustand";

export type View = 'Center' | 'Left' | 'Right'

type sceneStoreState = {
    view: View;
    setView: (view: View) => void;
};

const useSceneStore = create<sceneStoreState>((set) => ({
    view: 'Center',
    setView: (view) => set({ view }),
}));

export default useSceneStore;
