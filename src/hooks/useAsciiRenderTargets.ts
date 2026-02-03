import { useEffect, useRef } from "react";
import { Vector2, type Color, type Texture } from "three";
import useAsciiStore from "../stores/asciiStore";
import { useThree } from "@react-three/fiber";
import {
    createAsciiRenderTarget,
    createBackgroundRenderTarget,
} from "../utils/renderTargets";

function useAsciiRenderTargets() {
    const { size } = useThree();
    const { charSize, pixelRatio, setGridSize, setTextures } = useAsciiStore();

    const ui = useRef<{
        texture: Texture | null;
        context: CanvasRenderingContext2D | null;
    }>({ texture: null, context: null });

    const background = useRef<{
        texture: Texture | null;
        context: CanvasRenderingContext2D | null;
    }>({ texture: null, context: null });

    useEffect(() => {
        // Calculate ascii grid size
        const gridWidth = size.width / charSize.x;
        const gridHeight = size.height / charSize.y;

        // Create a render target to draw ASCII on the GPU
        const uiRenderTarget = createAsciiRenderTarget(gridWidth, gridHeight);

        // Create a render target to draw background behind the ascii on the GPU
        const bgRenderTarget = createBackgroundRenderTarget(
            size.width,
            size.height,
        );

        // Save locally
        ui.current = {
            texture: uiRenderTarget.texture,
            context: uiRenderTarget.context,
        };
        background.current = {
            texture: bgRenderTarget.texture,
            context: bgRenderTarget.context,
        };

        setGridSize(new Vector2(gridWidth, gridHeight));
        setTextures(
            bgRenderTarget.texture,
            uiRenderTarget.texture,
        );

    }, [size.width, size.height, charSize.x, charSize.y, pixelRatio]);

    const clearRenderTargets = (
        uiContext: CanvasRenderingContext2D,
        bgContext: CanvasRenderingContext2D,
        bgColor: Color,
    ) => {
        const { width: uiW, height: uiH } = uiContext.canvas;
        const { width: bgW, height: bgH } = bgContext.canvas;

        // Clear ui and background textures
        uiContext.clearRect(0, 0, uiW, uiH);
        bgContext.clearRect(0, 0, bgW, bgH);
        bgContext.fillStyle = `rgb(${bgColor.r * 255},${bgColor.g * 255},${
            bgColor.b * 255
        }`;

        // Fill the entire canvas
        bgContext.fillRect(0, 0, bgW, bgH);
    };

    return { ui, background, clearRenderTargets };
}

export default useAsciiRenderTargets;
