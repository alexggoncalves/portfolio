import { useEffect, useRef } from "react";
import { type Texture } from "three";
import { useThree } from "@react-three/fiber";
import {
    createAsciiRenderTarget,
    createBgRenderTarget,
} from "../utils/createRenderTargets";
import type Color4 from "three/src/renderers/common/Color4.js";

import { AsciiRenderConfig } from "../components/app/AsciiRenderConfig";
import { AppState } from "../components/app/AppState";

function useAsciiRenderTargets() {
    const { size } = useThree();

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
        const gridWidth = size.width / AsciiRenderConfig.charSize.x;
        const gridHeight = size.height / AsciiRenderConfig.charSize.y;

        // Create a render target to draw ASCII on the GPU
        const uiRenderTarget = createAsciiRenderTarget(gridWidth, gridHeight);

        // Create a render target to draw background behind the ascii on the GPU
        const bgRenderTarget = createBgRenderTarget(size.width, size.height);

        // Save locally
        ascii.current = {
            texture: uiRenderTarget.texture,
            context: uiRenderTarget.context,
        };
        bg.current = {
            texture: bgRenderTarget.texture,
            context: bgRenderTarget.context,
        };

        AppState.setBackground(bgRenderTarget.texture);
        AppState.setUI(uiRenderTarget.texture);

        return () => {
            uiRenderTarget.texture.dispose();
            bgRenderTarget.texture.dispose();
        };
    }, [size.width, size.height]);

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
