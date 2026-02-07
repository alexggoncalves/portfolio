import { create } from "zustand";

type CursorState = {
    cursorPosition: { x: number; y: number };
    cursorState: "default" | "pointer";
    cursorEnabled: boolean;

    setCursorPosition: (pos: { x: number; y: number }) => void;
    setCursorState: (state: "default" | "pointer") => void;
    setCursorEnabled: (enabled: boolean) => void;
};

const useCursorStore = create<CursorState>((set) => ({
    cursorPosition: { x: 0, y: 0 },
    cursorState: "default",
    cursorEnabled: true,

    setCursorPosition: (pos) => set({ cursorPosition: pos }),
    setCursorState: (state) => set({ cursorState: state }),
    setCursorEnabled: (enabled) => set({cursorEnabled: enabled}),
}));

export default useCursorStore;
