import { CanvasTexture, NearestFilter, Texture, Vector2 } from "three";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

import useSceneStore from "../../stores/sceneStore";
import useAsciiStore from "../../stores/asciiStore";

import { Layer } from "./Layer";
import { Page } from "./Page";
import useScroll from "../../hooks/useScroll";

// Create context to draw in and use on the the GPU
function createTexture(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;

    const texture = new CanvasTexture(canvas);

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    return { texture, ctx };
}

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
    const { viewport, size } = useThree();

    const scrollDelta = useScroll();
    const scrollDeltaRef = useRef(0);

    scrollDeltaRef.current = scrollDelta

    const {
        charSize,
        uiTexture,
        backgroundTexture,
        setUI,
        setBackground,
        pixelRatio,
    } = useAsciiStore();

    const uiTexRef = useRef<Texture>(null);
    const uiContextRef = useRef<CanvasRenderingContext2D>(null);
    const backgroundTexRef = useRef<Texture>(null);
    const backgroundContextRef = useRef<CanvasRenderingContext2D>(null);

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

            const currentScrollDelta = scrollDeltaRef.current;
            scrollDeltaRef.current = 0; 

            // Draw and update current page
            if (currentPage) {
                currentPage.update(
                    uiContext,
                    bgContext,
                    delta,
                    new Vector2(0, 0),
                    !nextPage ? currentScrollDelta : 0,
                );
            }

            // Draw next page if it exists (for transitions)
            if (nextPage) {
                nextPage.update(
                    uiContext,
                    bgContext,
                    delta,
                    new Vector2(0, 0),
                    currentScrollDelta
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

    // Create background and ui(ascii) textures
    useEffect(() => {
        const charSize = useAsciiStore.getState().charSize;

        // Create a texture to draw the UI as ASCII on the GPU
        const uiTex = createTexture(
            size.width / charSize.x,
            size.height / charSize.y
        );

        const backgroundTex = createTexture(size.width, size.height);

        // Store the texture and the context for both canvas created on the asciiStore
        setUI(uiTex.texture, uiTex.ctx);
        setBackground(backgroundTex.texture, backgroundTex.ctx);

        // Save references for the created objects
        uiTexRef.current = uiTex.texture;
        uiContextRef.current = uiTex.ctx;
        backgroundTexRef.current = backgroundTex.texture;
        backgroundContextRef.current = backgroundTex.ctx;
    }, [size.width, size.height, charSize.x, charSize.y, pixelRatio]);

    return null;
}

export default PageRenderer;
