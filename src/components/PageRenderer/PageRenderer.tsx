import { Vector2 } from "three";
import { useFrame } from "@react-three/fiber";

import useSceneStore from "../../stores/sceneStore";

import { Layer } from "./Layer";
import { Page } from "./Page";
import useScroll from "../../hooks/useScroll";
import useAsciiRenderTargets from "../../hooks/useAsciiRenderTargets";
import type { Cursor } from "./Elements/Cursor";
import useCustomCursor from "../../hooks/useCustomCursor";

type PageRendererProps = {
    currentPage?: Page | null;
    nextPage?: Page | null;
    fixedLayers?: Layer[] | null;
    cursor: Cursor;
};

function PageRenderer({
    currentPage,
    nextPage,
    fixedLayers,
    cursor,
}: PageRendererProps) {
    const scrollDelta = useScroll();
    const { cursorPosition, cursorState, cursorEnabled } = useCustomCursor();

    const { backgroundColor } = useSceneStore();
    const { ui, background, clearRenderTargets } = useAsciiRenderTargets();

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        const uiContext = ui.current?.context;
        const bgContext = background.current?.context;

        const uiTexture = ui.current?.texture;
        const backgroundTexture = background.current?.texture;

        if (!uiContext || !bgContext) return;
        if (!uiTexture || !backgroundTexture) return;

        // Clear Render Targets
        clearRenderTargets(uiContext, bgContext, backgroundColor);

        // Update and draw current page
        currentPage?.update(
            uiContext,
            bgContext,
            delta,
            new Vector2(0, 0),
            !nextPage ? scrollDelta : 0,
        );

        // Update and draw next page if it exists (for transitions)
        nextPage?.update(
            uiContext,
            bgContext,
            delta,
            new Vector2(0, 0),
            scrollDelta,
        );

        // Draw fixed layers
        fixedLayers?.forEach((layer: Layer) => {
            layer.draw(uiContext, bgContext, 1);
        });

        // Draw custom cursor
        if(cursorEnabled)
            cursor?.update(uiContext, bgContext, cursorPosition, cursorState);

        uiTexture.needsUpdate = true;
        backgroundTexture.needsUpdate = true;
    });

    return null;
}

export default PageRenderer;
