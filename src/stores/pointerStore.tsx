import { Vector2 } from "three";
import { create } from "zustand";

type PointerState = {
    pointerPosition: Vector2;
    pointerEnabled: boolean;
    hoverCount: number;
    isDraggingHorizontally: boolean;

    mouseEnter: () => void;
    mouseLeave: () => void;

    setPointerPosition: (pos: Vector2) => void;
    setPointerEnabled: (enabled: boolean) => void;
    setIsDraggingHorizontally: (isDragging: boolean) => void;
};

const usePointerStore = create<PointerState>((set) => ({
    pointerPosition: new Vector2(0),
    pointerEnabled: true,
    hoverCount:0,
    isDraggingHorizontally: false,
    
    mouseEnter: () => set((state) => ({ hoverCount: state.hoverCount + 1 })),
    mouseLeave: () => set((state) => ({ hoverCount: Math.max(0, state.hoverCount - 1) })),

    setPointerPosition: (pos) => set({ pointerPosition: pos }),
    setPointerEnabled: (enabled) => set({ pointerEnabled: enabled }),
    setIsDraggingHorizontally: (isDragging) => set({ isDraggingHorizontally: isDragging }),
}));

export default usePointerStore;
