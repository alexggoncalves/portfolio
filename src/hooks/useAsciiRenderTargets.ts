import { useEffect, useRef } from "react";
import { Vector2, type Texture } from "three";
import useAsciiStore from "../stores/asciiStore";
import { useThree } from "@react-three/fiber";
import {
    createAsciiRenderTarget,
    createBackgroundRenderTarget,
} from "../utils/createRenderTargets";
import type Color4 from "three/src/renderers/common/Color4.js";

function useAsciiRenderTargets() {
    const { size } = useThree();
    const { charSize, setGridSize, setTextures } = useAsciiStore();

    const ascii = useRef<{
        texture: Texture | null;
        context: CanvasRenderingContext2D | null;
    }>({ texture: null, context: null });

    const bg = useRef<{
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
        ascii.current = {
            texture: uiRenderTarget.texture,
            context: uiRenderTarget.context,
        };
        bg.current = {
            texture: bgRenderTarget.texture,
            context: bgRenderTarget.context,
        };

        setGridSize(new Vector2(gridWidth, gridHeight));
        setTextures(bgRenderTarget.texture, uiRenderTarget.texture);
    }, [size.width, size.height, charSize.x, charSize.y]);

    const clearRenderTargets = (
        uiContext: CanvasRenderingContext2D,
        bgContext: CanvasRenderingContext2D,
        bgColor: Color4,
    ) => {
        const { width: uiW, height: uiH } = uiContext.canvas;
        const { width: bgW, height: bgH } = bgContext.canvas;

        // Clear ui and background textures
        uiContext.clearRect(0, 0, uiW, uiH);
        bgContext.fillStyle = `rgb(
            ${bgColor.r * 255},
            ${bgColor.g * 255},
            ${bgColor.b * 255})`;
        bgContext.fillRect(0, 0, bgW, bgH);
    };

    return { ascii, bg, clearRenderTargets };
}

export default useAsciiRenderTargets;
