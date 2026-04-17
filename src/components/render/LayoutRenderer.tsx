import { Vector2 } from "three";
import { useFrame } from "@react-three/fiber";

import useSceneStore from "../../stores/sceneStore";

import useScroll from "../../hooks/useScroll";
import useAsciiRenderTargets from "../../hooks/useAsciiRenderTargets";
import usePointer from "../../hooks/usePointer";
import useGridCanvasSize from "../../hooks/useGridCanvasSize";
import type { Navigation } from "../elements/ui/Navigation";
import { InteractiveElement } from "../elements/core/InteractiveElement";
import { getDistortedPosition } from "../../utils/getDistortedPosition";
import { useEffect, useRef } from "react";
import { RenderConfig } from "./RenderConfig";

function LayoutRenderer({ nav }: { nav: Navigation | null }) {
    const { currentPage, nextPage } = useSceneStore();
    const canvasSize = useGridCanvasSize();

    const { ascii, bg, clearRenderTargets } = useAsciiRenderTargets();
    const { pointerPosition, setClickTarget, isMouseDown, updateCursor } =
        usePointer();

    const scrollDelta = useScroll();

    const distortedPointerPosition = useRef<Vector2>(new Vector2(0));

    useEffect(() => {
        nav?.onResize();
        currentPage?.onResize();
        nextPage?.onResize();
    }, [canvasSize.width, canvasSize.height]);

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        const asciiTarget = {
            ctx: ascii.current?.context,
            texture: ascii.current?.texture,
        };
        const bgTarget = {
            ctx: bg.current?.context,
            texture: bg.current?.texture,
        };

        if (
            !asciiTarget.ctx ||
            !asciiTarget.texture ||
            !bgTarget.ctx ||
            !bgTarget.texture
        )
            return;

        // Clear Render Targets
        clearRenderTargets(asciiTarget.ctx, bgTarget.ctx, RenderConfig.bgColor);

        // Map the mouse or touch position to fit the applied lens distortion
        getDistortedPosition(
            pointerPosition.current,
            canvasSize,
            RenderConfig.distortion,
            RenderConfig.focalLength,
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
        drawPages(asciiTarget.ctx, bgTarget.ctx);

        asciiTarget.texture.needsUpdate = true;
        bgTarget.texture.needsUpdate = true;
    });

    const updateMouseTargets = () => {
        // Get topmost hovered element
        let topHoveredElement: InteractiveElement | null = null;

        if (nav?.hoveredElement) {
            topHoveredElement = nav?.hoveredElement;
        } else if (nextPage && nextPage.currentHoveredElement) {
            topHoveredElement = nextPage.currentHoveredElement;
        } else if (currentPage && currentPage.currentHoveredElement) {
            topHoveredElement = currentPage.currentHoveredElement;
        }

        // Apply hover to topmost element
        if (topHoveredElement) {
            topHoveredElement.isMouseOver = true;
            setClickTarget(topHoveredElement);
        } else {
            setClickTarget(null);
        }
    };

    const updatePages = (
        delta: number,
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ) => {
        // Update current page
        currentPage?.update(
            delta,
            mouseX,
            mouseY,
            !nextPage ? scrollDelta.current : 0,
            isMouseDown,
        );

        // Update next page if it exists
        nextPage?.update(
            delta,
            mouseX,
            mouseY,
            scrollDelta.current,
            isMouseDown,
        );

        // Update navigation
        // nav?.update(0, 0);
        nav?.updateNavMouseState(mouseX, mouseY);
        if (nextPage) {
            nav?.updateScrollBar(nextPage?.scrollOffset, nextPage?.pageHeight);
        } else if (currentPage) {
            nav?.updateScrollBar(
                currentPage?.scrollOffset,
                currentPage?.pageHeight,
            );
        }
    };

    const drawPages = (
        asciiCtx: CanvasRenderingContext2D,
        bgCtx: CanvasRenderingContext2D,
    ) => {
        // Draw current page
        currentPage?.draw(asciiCtx, bgCtx);

        // Draw next page
        nextPage?.draw(asciiCtx, bgCtx);

        // Draw fixed layers (nav)
        nav?.draw(asciiCtx, bgCtx, 1);
    };

    return null;
}

export default LayoutRenderer;
