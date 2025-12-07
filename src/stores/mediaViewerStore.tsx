import { create } from "zustand";

import type { Asset } from "./contentStore";
import { Vector2 } from "three";

type MediaViewerState = {
    position: Vector2;
    size: Vector2;

    media: Asset[];
    mediaLength: number;
    currentIndex: number;

    isOpen: boolean;

    open: (media: Asset[]) => void;
    close: () => void;
    next: () => void;
    prev: () => void;

    setMediaViewerPosition: (position: Vector2) => void;
    setMediaViewerSize: (size: Vector2) => void;
};

const useMediaViewerStore = create<MediaViewerState>((set, get) => ({
    position: new Vector2(0, 0),
    size: new Vector2(200, 200),

    media: [],
    mediaLength: 0,
    currentIndex: 0,

    isOpen: false,

    open: (media: Asset[]) => {
        set({
            media,
            mediaLength: media.length,
            isOpen: true,
            currentIndex: 0,
        });
    },
    close: () => {
        set({ media: [], mediaLength: 0, isOpen: false });
    },
    setMediaViewerPosition: (position: Vector2) => {
        set({ position });
    },
    setMediaViewerSize: (size: Vector2) => {
        set({ size });
    },
    next: () => {
        const { mediaLength } = get();
        const { currentIndex } = get();

        let newIndex = currentIndex + 1;
        if (newIndex > mediaLength - 1) newIndex = 0;

        set({ currentIndex: newIndex });
    },
    prev: () => {
        const { mediaLength } = get();
        const { currentIndex } = get();

        let newIndex = currentIndex - 1;
        if(newIndex < 0) newIndex = mediaLength -1 

        set({ currentIndex: newIndex });
    },
}));

export default useMediaViewerStore;
