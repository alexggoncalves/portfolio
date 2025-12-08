import { Texture, Vector2 } from "three";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {createAsciiRenderTarget, createBackgroundRenderTarget} from "../../helpers/createRenderTarget";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";

import { Layer } from "./Layer";
import { Page } from "./Page";
import useScroll from "../../hooks/useScroll";

type PageRendererProps = {
    currentPage?: Page | null;
    nextPage?: Page | null;
    fixedLayers?: Layer[] | null;
};

function PageRenderer({
    currentPage,
    nextPage,
    fixedLayers,
}: PageRendererProps) {
    const { size } = useThree();
    const scrollDelta = useScroll();

    const { charSize, setUI, setBackground, pixelRatio } = useAsciiStore();

    const uiTexRef = useRef<Texture>(null);
    const uiContextRef = useRef<CanvasRenderingContext2D>(null);
    const backgroundTexRef = useRef<Texture>(null);
    const backgroundContextRef = useRef<CanvasRenderingContext2D>(null);

    useEffect(() => {
        const charSize = useAsciiStore.getState().charSize;
        const gridWidth = size.width / charSize.x;
        const gridHeight = size.height / charSize.y;

        // Create a texture to draw ASCII on the GPU
        const uiTex = createAsciiRenderTarget(gridWidth, gridHeight);

        // Create a texture to draw bacground behind the ascii on the GPU
        const backgroundTex = createBackgroundRenderTarget(size.width, size.height);

        // Store the texture and the context for both canvas created on the asciiStore
        setUI(uiTex.texture, uiTex.ctx);
        setBackground(backgroundTex.texture, backgroundTex.ctx);

        // Save references for the created objects
        uiTexRef.current = uiTex.texture;
        uiContextRef.current = uiTex.ctx;
        backgroundTexRef.current = backgroundTex.texture;
        backgroundContextRef.current = backgroundTex.ctx;
    }, [size.width, size.height, charSize.x, charSize.y, pixelRatio]);

    
    const { uiTexture, backgroundTexture } = useAsciiStore();

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        const bgColor = useSceneStore.getState().backgroundColor;

        if (!uiTexture || !backgroundTexture) return;

        if (uiContextRef.current && backgroundContextRef.current) {
            const uiContext = uiContextRef.current;
            const bgContext = backgroundContextRef.current;
            const uiCanvas = uiContext.canvas;
            const bgCanvas = bgContext.canvas;

            // Clear ui and background textures
            uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
            bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            bgContext.fillStyle = `rgb(${bgColor.r * 255},${bgColor.g * 255},${
                bgColor.b * 255
            }`;

            // Fill the entire canvas
            bgContext.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

            // Draw and update current page
            if (currentPage) {
                currentPage.update(
                    uiContext,
                    bgContext,
                    delta,
                    new Vector2(0, 0),
                    !nextPage ? scrollDelta : 0
                );
            }

            // Draw next page if it exists (for transitions)
            if (nextPage) {
                nextPage.update(
                    uiContext,
                    bgContext,
                    delta,
                    new Vector2(0, 0),
                    scrollDelta
                );
            }

            // Draw Frame + Navigation
            if (fixedLayers) {
                fixedLayers.forEach((layer: Layer) => {
                    layer.draw(uiContext, bgContext, 1);
                });
            }
        }

        uiTexture.needsUpdate = true;
        backgroundTexture.needsUpdate = true;
    });

    return null;
}

export default PageRenderer;
