import { create } from "zustand";

import type { Asset } from "./contentStore";
import { Vector2 } from "three";

type MediaViewerState = {
    isOpen: boolean;
    media: Asset[];

    position: Vector2;
    size: Vector2;

    open: (media: Asset[]) => void;
    close: () => void;

    setMediaViewerPosition: (position: Vector2) => void;
    setMediaViewerSize: (size: Vector2) => void;
};

const useMediaViewerStore = create<MediaViewerState>((set, _get) => ({
    isOpen: false,
    media: [],

    position: new Vector2(0, 0),
    size: new Vector2(200, 200),

    open: (media: Asset[]) => {
        set({ media, isOpen: true });
    },
    close: () => {
        set({ media: [], isOpen: false });
    },
    setMediaViewerPosition: (position: Vector2) => {
        set({ position });
    },
    setMediaViewerSize: (size: Vector2) => {
        set({ size });
    },
}));

export default useMediaViewerStore;
