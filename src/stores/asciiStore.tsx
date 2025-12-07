import { create } from "zustand";
import { CanvasTexture, Vector2 } from "three";

type ASCIIState = {
    texelSize: Vector2;
    charSize: Vector2;
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

    setCanvasOffset: (left: number, top: number) => void;

    setPixelRatio: (pixelRatio: number) => void;
};

const useAsciiStore = create<ASCIIState>((set, get) => ({
    // texelSize: new Vector2(10, 14),
    texelSize: new Vector2(12,16),
    charSize: new Vector2(12, 16),
    atlasGridSize: new Vector2(16, 9),
    pixelRatio: window.devicePixelRatio,
    canvasOffset: new Vector2(0, 0),

    fontAtlas: "/font_atlas/fontAtlas-ibmplex-16x9(12-16).png",
    asciiSequence: `       \`·.-\',_:;\"~°º!¡ª÷+=^|)<>(\\/L«≈»v*c[¿?T±rxi≤≥zuìí]t√l7Y{nJ}IFjyîsç1oúùeπaCµ24ZhVfûk3P¢òóE£w95èpXébàáS6mAUGÇqôdH#KΩêÉOãâD&%R0Æ8NBMg@QW$░▒▓█`,
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

    setPixelRatio: (pixelRatio: number) => {
        const { texelSize } = get();
        set({
            pixelRatio: pixelRatio,
            charSize: new Vector2(
                texelSize.x * pixelRatio,
                texelSize.y * pixelRatio
            ),
        });
    },

    setCanvasOffset: (left: number, top: number) =>
        set({ canvasOffset: new Vector2(left, top) }),
}));

export default useAsciiStore;
