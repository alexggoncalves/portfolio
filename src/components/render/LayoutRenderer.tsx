import { Vector2 } from "three";
import { useFrame } from "@react-three/fiber";

import useSceneStore from "../../stores/sceneStore";

import useScroll from "../../hooks/useScroll";
import useAsciiRenderTargets from "../../hooks/useAsciiRenderTargets";
import usePointer from "../../hooks/usePointer";
import useGridCanvasSize from "../../hooks/useGridCanvasSize";
import useAsciiStore from "../../stores/asciiStore";
import type { Navigation } from "../elements/Navigation";
import { InteractiveElement } from "../elements/InteractiveElement";
import lensDistortPosition from "../../utils/lensDistortPosition";
import { useEffect, useRef } from "react";
// import { Layer } from "../pages/layout/Layer";

function LayoutRenderer({ nav }: { nav: Navigation | null }) {
    const { currentPage, nextPage, backgroundColor } = useSceneStore();
    const { ascii, bg, clearRenderTargets } = useAsciiRenderTargets();

    const scrollDelta = useScroll();
    const { mousePosition } = usePointer();

    // Set canvas size
    const charSize = useAsciiStore.getState().charSize;
    const canvasSize = useGridCanvasSize(charSize);

    const DRAG_THRESHOLD = 5;
    let mouseDownPos: Vector2 | null = null;
    let isDragging = false;

    const clickTarget = useRef<InteractiveElement | null>(null);
    // const dragTarget = useRef<Layer | null>(null);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            mouseDownPos = new Vector2(e.clientX, e.clientY);
            isDragging = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!mouseDownPos) return;

            const horizontalDistance = e.clientX - mouseDownPos.x;

            if (Math.abs(horizontalDistance) > DRAG_THRESHOLD) {
                isDragging = true;
                console.log(horizontalDistance);
            }
        };

        const handleMouseUp = () => {
            if (!mouseDownPos) return;

            if (!isDragging) {
                if (clickTarget.current) clickTarget.current.onClick();
            }

            mouseDownPos = null;
            isDragging = false;
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

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
        clearRenderTargets(asciiTarget.ctx, bgTarget.ctx, backgroundColor);

        // Map the mouse position to fit the applied lens distortion
        const mousePos = lensDistortPosition(mousePosition.current, canvasSize);

        // Update and draw current and next page
        updatePages(delta, mousePos);

        // Update mouse targets
        updateMouseTargets();

        // Draw pages
        drawPages(asciiTarget.ctx, bgTarget.ctx);

        asciiTarget.texture.needsUpdate = true;
        bgTarget.texture.needsUpdate = true;
    });

    const updateMouseTargets = () => {
        // Reset page elements hover state
        currentPage?.resetHoverStates();
        nextPage?.resetHoverStates();
        nav?.resetHoverStates();

        // Get topmost hovered element
        let topHoveredElement: InteractiveElement | null = null;
        if (nav?.hoveredElement) {
            topHoveredElement = nav?.hoveredElement;
        } else if (nextPage && nextPage.hoveredElements?.length > 0) {
            topHoveredElement = nextPage.hoveredElements?.[0];
        } else if (currentPage && currentPage.hoveredElements?.length > 0) {
            topHoveredElement = currentPage.hoveredElements?.[0];
        }

        // Apply hover to topmost element
        if (topHoveredElement) {
            topHoveredElement.isMouseOver = true;
            clickTarget.current = topHoveredElement;
        } else {
            clickTarget.current = null;
        }
    };

    const updatePages = (delta: number, mousePos: Vector2) => {
        // Update current page
        currentPage?.update(
            delta,
            mousePos,
            !nextPage ? scrollDelta.current : 0,
        );

        // Update next page if it exists
        nextPage?.update(delta, mousePos, scrollDelta.current);

        // Update navigation hover state
        nav?.updateMouseState(mousePos);
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
