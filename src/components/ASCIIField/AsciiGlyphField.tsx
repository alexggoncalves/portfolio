import { CanvasTexture, NearestFilter, Texture, Vector2 } from "three";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

import useAsciiStore from "../../stores/asciiStore";

import { ASCIILayer } from "./ASCIILayer";
import { ASCIIPage } from "../Pages/ASCIIPage";

type AsciiGlyphFieldProps = {
    currentPage?: ASCIIPage | null;
    nextPage?: ASCIIPage | null;
    fixedElements?: ASCIILayer[] | null;
};

function AsciiGlyphField({
    currentPage,
    nextPage,
    fixedElements,
}: AsciiGlyphFieldProps) {
    const { viewport, size, gl } = useThree();
    const setPixelRatio = useAsciiStore((state) => state.setPixelRatio);

    const {
        charSize,
        uiTexture,
        backgroundTexture,
        setUI,
        setBackground,
        canvasOffset,
    } = useAsciiStore();

    const uiTexRef = useRef<Texture>(null);
    const uiContextRef = useRef<CanvasRenderingContext2D>(null);
    const backgroundTexRef = useRef<Texture>(null);
    const backgroundContextRef = useRef<CanvasRenderingContext2D>(null);

    // Create context to draw in and use on the the GPU
    function createTexture(width: number, height: number) {
        const canvas = document.createElement("canvas");
        canvas.width = width * viewport.dpr;
        canvas.height = height * viewport.dpr;

        const ctx = canvas.getContext("2d", { alpha: true })!;
        // ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;

        const texture = new CanvasTexture(canvas);

        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;

        return { texture, ctx };
    }

    useFrame((_state, delta) => {
        if (!uiTexture || !backgroundTexture) return;

        if (uiContextRef.current && backgroundContextRef.current) {
            const uiContext = uiContextRef.current;
            const bgContext = backgroundContextRef.current;
            const uiCanvas = uiContext.canvas;
            const bgCanvas = bgContext.canvas;

            // Clear ui and background textures
            uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
            bgContext.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

            // Draw Frame + Navigation
            if (fixedElements) {
                fixedElements.forEach((layer: ASCIILayer) => {
                    layer.draw(uiContext, bgContext);
                });
            }

            // Draw and update current page
            if (currentPage) {
                currentPage.layers.forEach((layer: ASCIILayer) => {
                    layer.update(delta, canvasOffset);
                    layer.draw(uiContext, bgContext);
                });
            }

            // Draw next page if exists (for transitions)
            if (nextPage) {
                nextPage.layers.forEach((layer: ASCIILayer) => {
                    layer.update(delta, new Vector2(0, 0));
                    layer.draw(uiContext!, bgContext!);
                });
            }
        }

        uiTexture.needsUpdate = true;
        backgroundTexture.needsUpdate = true;
    });

    useEffect(() => {
        // setPixelRatio
        setPixelRatio(gl.getPixelRatio());

        // Create a texture to draw the UI as ASCII and the background on the GPU
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
    }, [size.width, size.height, charSize.x, charSize.y]);

    return null;
}

export default AsciiGlyphField;
