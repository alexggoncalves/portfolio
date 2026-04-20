import { Vector2 } from "three";
import { useFrame } from "@react-three/fiber";

import useScroll from "../../hooks/useScroll";
import useAsciiRenderTargets from "../../hooks/useAsciiRenderTargets";
import usePointer from "../../hooks/usePointer";
import { getDistortedPosition } from "../../utils/getDistortedPosition";
import { useRef } from "react";
import { AsciiRenderConfig } from "./RenderConfig";
import { type Page } from "../elements/core/Page";
import type { CanvasSize } from "../../hooks/useGridCanvasSize";
import type { Navigation } from "../elements/ui/Navigation";

function AsciiLayoutRenderer({
    currentPage,
    nextPage,
    nav,
    size,
}: {
    currentPage: React.RefObject<Page | null>;
    nextPage: React.RefObject<Page | null>;
    nav: React.RefObject<Navigation | null>;
    size: React.RefObject<CanvasSize>;
}) {
    const { ascii, bg, clearRenderTargets } = useAsciiRenderTargets();
    const prevSize = useRef({ width: 0, height: 0 });

    // Mouse event managers
    const scrollDelta = useScroll();
    const { pointerPosition, isMouseDown, updateCursor, setClickTarget } =
        usePointer();

    // Mouse position with distortion applied
    const distortedPointerPosition = useRef<Vector2>(new Vector2(0));

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        if (!size.current) return;
        const { width, height } = size.current;

        // Handle resize
        if (
            width !== prevSize.current.width ||
            height !== prevSize.current.height
        ) {
            // Resize nav and pages
            nav.current?.onResize();
            currentPage.current?.onResize();
            nextPage.current?.onResize();

            prevSize.current.width = width;
            prevSize.current.height = height;
        }

        const asciiCtx = ascii.current?.context;
        const asciiTexture = ascii.current?.texture;
        const bgCtx = bg.current?.context;
        const bgTexture = bg.current?.texture;

        if (!asciiCtx || !asciiTexture || !bgCtx || !bgTexture) return;

        // Clear Render Targets
        clearRenderTargets(
            asciiCtx,
            bgCtx,
            AsciiRenderConfig.bgColor,
        );

        // Map the mouse or touch position to fit the applied lens distortion
        getDistortedPosition(
            pointerPosition.current,
            size.current,
            AsciiRenderConfig.distortion,
            AsciiRenderConfig.focalLength,
            distortedPointerPosition.current,
        );

        // Update and draw current and next page
        updatePages(
            delta,
            distortedPointerPosition.current.x,
            distortedPointerPosition.current.y,
            isMouseDown.current,
        );

        // Update mouse targets
        updateMouseTargets();
        updateCursor();

        // Draw pages
        drawPages(asciiCtx, bgCtx);

        asciiTexture.needsUpdate = true;
        bgTexture.needsUpdate = true;
    });

    const updatePages = (
        delta: number,
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ) => {
        const isTransitioning = !!nextPage.current;

        // Update current page
        currentPage.current?.update(
            delta,
            mouseX,
            mouseY,
            isTransitioning ? 0 : scrollDelta.current,
            isMouseDown,
        );

        // Update next page if it exists
        nextPage.current?.update(
            delta,
            mouseX,
            mouseY,
            isTransitioning ? scrollDelta.current : 0,
            isMouseDown,
        );

        // Update navigation
        nav.current?.updateNavMouseState(mouseX, mouseY);

        // Update nav scroll attributes
        const activePage = nextPage.current ?? currentPage.current;
        if (activePage) {
            nav.current?.updateScrollBar(
                activePage.scrollOffset,
                activePage.pageHeight,
            );
        }
    };

    const updateMouseTargets = () => {
        // Get topmost hovered element
        const topHoveredElement =
            nav.current?.hoveredElement ?? // Nav on top
            nextPage.current?.currentHoveredElement ??
            currentPage.current?.currentHoveredElement ??
            null;

        // Apply hover to topmost element
        if (topHoveredElement) {
            topHoveredElement.isMouseOver = true;
            setClickTarget(topHoveredElement);
        } else {
            setClickTarget(null);
        }
    };

    const drawPages = (
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ) => {
        // Draw current page
        currentPage.current?.draw(asciiCtx, bgCtx);

        // Draw next page
        nextPage.current?.draw(asciiCtx, bgCtx);

        // Draw fixed layers (nav)
        nav.current?.draw(asciiCtx, bgCtx, 1);
    };

    return null;
}

export default AsciiLayoutRenderer;
