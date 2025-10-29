import { create } from "zustand";
import { CanvasTexture, Vector2 } from "three";

type ASCIIState = {
    charSize: Vector2;
    canvasSize: Vector2;
    atlasGridSize: Vector2;
    asciiSequence: string;
    fontAtlas: string;
    pixelRatio: number;
    canvasOffset: Vector2;

    uiTexture: CanvasTexture | null;
    uiContext: CanvasRenderingContext2D | null;
    uiResolution: Vector2;
    backgroundTexture: CanvasTexture | null;
    backgroundContext: CanvasRenderingContext2D | null;
    backgroundResolution: Vector2;

    setUI: (
        uiTexture: CanvasTexture,
        uiContext: CanvasRenderingContext2D
    ) => void;

    setBackground: (
        backgroundTexture: CanvasTexture,
        backgroundContext: CanvasRenderingContext2D
    ) => void;

    setCanvasSize: (width: number, height: number) => void;

    setCanvasOffset: (left: number, top: number) => void;

    setPixelRatio: (pixelRatio: number) => void;
};

const useAsciiStore = create<ASCIIState>((set) => ({
    charSize: new Vector2(16, 16),
    canvasSize: new Vector2(0, 0),
    atlasGridSize: new Vector2(16, 9),
    pixelRatio: 1,
    canvasOffset: new Vector2(0, 0),

    fontAtlas: "/font_atlas/fontAtlas-ibmplex-16x9(16-16).png",
    asciiSequence:
        "       `·.-',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOâD&¥%R0Æ8NBMg@QW$░▒▓█",

    uiTexture: null,
    uiContext: null,
    uiResolution: new Vector2(0, 0),
    backgroundTexture: null,
    backgroundContext: null,
    backgroundResolution: new Vector2(0, 0),

    setUI: (uiTexture: CanvasTexture, uiContext: CanvasRenderingContext2D) =>
        set({
            uiTexture: uiTexture,
            uiContext: uiContext,
            uiResolution: new Vector2(uiTexture.width, uiTexture.height),
        }),

    setBackground: (
        backgroundTexture: CanvasTexture,
        backgroundContext: CanvasRenderingContext2D
    ) =>
        set({
            backgroundTexture: backgroundTexture,
            backgroundContext: backgroundContext,
            backgroundResolution: new Vector2(
                backgroundTexture.width,
                backgroundTexture.height
            ),
        }),

    setCanvasSize: (width: number, height: number) =>
        set({ canvasSize: new Vector2(width, height) }),

    setPixelRatio: (pixelRatio: number) => set({ pixelRatio: pixelRatio }),

    setCanvasOffset: (left: number, top: number) =>
        set({ canvasOffset: new Vector2(left, top) }),
}));

export default useAsciiStore;
