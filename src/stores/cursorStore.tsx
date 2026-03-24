import { create } from "zustand";

type CursorState = {
    cursorPosition: { x: number; y: number };
    cursorEnabled: boolean;
    hoverCount: number;

    mouseEnter: () => void;
    mouseLeave: () => void;

    setCursorPosition: (pos: { x: number; y: number }) => void;
    setCursorEnabled: (enabled: boolean) => void;
};

const useCursorStore = create<CursorState>((set) => ({
    cursorPosition: { x: 0, y: 0 },
    cursorEnabled: true,
    hoverCount:0,
    
    mouseEnter: () => set((state) => ({ hoverCount: state.hoverCount + 1 })),
    mouseLeave: () => set((state) => ({ hoverCount: Math.max(0, state.hoverCount - 1) })),

    setCursorPosition: (pos) => set({ cursorPosition: pos }),
    setCursorEnabled: (enabled) => set({cursorEnabled: enabled}),
}));

export default useCursorStore;
