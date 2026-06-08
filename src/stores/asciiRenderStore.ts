import type { Texture } from "three";
import { create } from "zustand";

// * --------------------------------------------------------------------------------------
// * ASCII Render Store: shared reactive config and parameters for ascii layout and shader.
// * --------------------------------------------------------------------------------------

type AsciiRenderState = {
    isGridReady: boolean;
    isAtlasReady: boolean;

    // Size of the ascii cells
    charSize: { w: number; h: number };
    viewCellSize: { w: number; h: number };

    // Grid and full canvas size
    gridSize: { cols: number; rows: number };
    canvasSize: { w: number; h: number };

    // Optional extra columns and rows outside viewport grid
    extraColumns: number;
    extraRows: number;

    // Ascii atlas + sequence
    asciiAtlas: Texture | null;
    asciiAtlasSrc: string;
    asciiSequence: string;
    atlasGridSize: { cols: number; rows: number };

    // Ascii shader settings
    glyphThreshold: number;
    glyphSoftness: number;

    setGridSize: (cols: number, rows: number) => void;
    setViewportCellSize: (viewPortW: number, viewPortH: number) => void;
    setGridReady: (value:boolean) => void,
    setAtlas: (atlas: Texture) => void;
    setAtlasReady: (value:boolean) => void;
};

const useAsciiRenderStore = create<AsciiRenderState>((set, get) => ({
    isGridReady: false,
    isAtlasReady: false,
    //       \`·.-\',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOãâD&%R0Æ8NBMg@QW$░▒▓█
    charSize: { w: 8, h: 12 },
    viewCellSize: {w: 1, h: 1},

    gridSize: { cols: 1, rows: 1 },
    canvasSize: { w: 1, h: 1 },
    extraColumns: 2,
    extraRows: 2,

    asciiAtlas: null,
    asciiAtlasSrc: "/font_atlas/asciiAtlas.webp",
    atlasGridSize: { cols: 16, rows: 9 },
    asciiSequence: ` \`·.-\',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»⬦v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOãâD&%R0Æ8NBMg@QW$✦꩜☽♠★░▒▓█`,

    glyphThreshold: 0.75,
    glyphSoftness: 0.3,

    setGridSize: (cols, rows) => {
        if (cols <= 0 || rows <= 0) return;

        const { charSize } = get();

        set({
            gridSize: { cols, rows },
            canvasSize: { w: cols * charSize.w, h: rows * charSize.h },
        });
    },

    setViewportCellSize: (viewPortW, viewPortH) => {
        const { gridSize } = get();

        set({
            viewCellSize: { w: viewPortW/gridSize.cols, h: viewPortH/gridSize.rows },
        });
    },

    setGridReady: (value) => set({ isGridReady: value }),
    setAtlas: (atlas) => set({ asciiAtlas: atlas }),
    setAtlasReady: (value) => set({ isAtlasReady: value }),
}));

export default useAsciiRenderStore;
