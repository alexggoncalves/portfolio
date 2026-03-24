import { create } from "zustand";
import { CanvasTexture, Vector2 } from "three";

type ASCIIState = {
    texelSize: Vector2;
    charSize: Vector2;
    atlasGridSize: Vector2;
    asciiSequence: string;
    fontAtlas: string;
    canvasOffset: Vector2;

    gridSize: Vector2;
    backgroundTexture?: CanvasTexture | null;
    uiTexture?: CanvasTexture | null;

    setGridSize: (gridSize: Vector2) => void;
    setTextures: (
        backgroundTexture: CanvasTexture,
        uiTexture: CanvasTexture,
    ) => void;
    setCanvasOffset: (left: number, top: number) => void;

};

const useAsciiStore = create<ASCIIState>((set, _get) => ({
    texelSize: new Vector2(12, 16),
    charSize: new Vector2(12, 16),
    atlasGridSize: new Vector2(16, 9),
    canvasOffset: new Vector2(0, 0),

    backgroundTexture: null,
    uiTexture: null,

    fontAtlas: "/font_atlas/fontAtlas-ibmplex-16x9(12-16).png",
    asciiSequence: `       \`·.-\',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOãâD&%R0Æ8NBMg@QW$░▒▓█`,
    gridSize: new Vector2(0, 0),

    setGridSize: (gridSize: Vector2) => set({ gridSize }),

    setTextures: (
        backgroundTexture: CanvasTexture,
        uiTexture: CanvasTexture,
    ) => set({ backgroundTexture, uiTexture }),


    setCanvasOffset: (left: number, top: number) =>
        set({ canvasOffset: new Vector2(left, top) }),
}));

export default useAsciiStore;
