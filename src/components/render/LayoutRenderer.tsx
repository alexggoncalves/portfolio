import { Vector2 } from "three";
import { useFrame } from "@react-three/fiber";

import useSceneStore from "../../stores/sceneStore";

import { Layer } from "../pages/layout/Layer";
import { Page } from "../pages/layout/Page";
import useScroll from "../../hooks/useScroll";
import useAsciiRenderTargets from "../../hooks/useAsciiRenderTargets";
import type { Cursor } from "../elements/Cursor";
import useCursorStore from "../../stores/cursorStore";

type LayoutRendererProps = {
    fixedLayers?: Layer[] | null;
    cursor: Cursor;
};

const zero = new Vector2(0, 0);

function LayoutRenderer({ fixedLayers, cursor }: LayoutRendererProps) {
    const scrollDeltaRef = useScroll();
    const { cursorPosition, cursorState, cursorEnabled } = useCursorStore();
    const { currentPage, nextPage, backgroundColor } = useSceneStore();
    
    const { ascii, bg, clearRenderTargets } = useAsciiRenderTargets();

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        const asciiTarget = {ctx: ascii.current?.context, texture: ascii.current?.texture}
        const bgTarget = {ctx: bg.current?.context, texture: bg.current?.texture};

        if (!asciiTarget.ctx || !asciiTarget.texture || !bgTarget.ctx || !bgTarget.texture) return;

        // Clear Render Targets
        clearRenderTargets(asciiTarget.ctx, bgTarget.ctx, backgroundColor);

        // Update and draw current and next page
        drawPage(delta, asciiTarget.ctx, bgTarget.ctx);

        // Update and draw persistent layers/elements
        drawFixedElements(fixedLayers, cursor, asciiTarget.ctx, bgTarget.ctx);

        asciiTarget.texture.needsUpdate = true;
        bgTarget.texture.needsUpdate = true;
    });

    function drawPage(
        delta: number,
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ) {
        // Update and draw current page
        currentPage?.update(
            asciiCtx,
            bgCtx,
            delta,
            zero,
            !nextPage ? scrollDeltaRef.current : 0,
        );

        // Update and draw next page if it exists
        nextPage?.update(
            asciiCtx,
            bgCtx,
            delta,
            zero,
            scrollDeltaRef.current,
        );
    }

    function drawFixedElements(
        fixedLayers: Layer[] | null | undefined,
        cursor: Cursor,
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ) {
        if (fixedLayers) {
            // Draw fixed layers
            fixedLayers.forEach((layer: Layer) => {
                layer.draw(asciiCtx, bgCtx, 1);
            });
        }

        // Draw custom cursor
        if (cursorEnabled)
            cursor?.update(asciiCtx, bgCtx, cursorPosition, cursorState);
    }

    return null;
}

export default LayoutRenderer;
