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
import { getDistortedPosition } from "../../utils/getDistortedPosition";
import { useRef } from "react";

function LayoutRenderer({ nav }: { nav: Navigation | null }) {
    const { currentPage, nextPage, backgroundColor, distortion, focalLength } =
        useSceneStore();
    const { ascii, bg, clearRenderTargets } = useAsciiRenderTargets();

    const scrollDelta = useScroll();
    const { pointerPosition, clickTarget, isMouseDown } = usePointer();

    const distortedPointerPosition = useRef<Vector2>(new Vector2(0));

    // Set canvas size
    const charSize = useAsciiStore.getState().charSize;
    const canvasSize = useGridCanvasSize(charSize);

    const frameSkip = useRef(0);

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        frameSkip.current++;

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

        // Map the mouse or touch position to fit the applied lens distortion
        distortedPointerPosition.current = getDistortedPosition(
            pointerPosition.current,
            canvasSize,
            distortion,
            focalLength,
        );

        // Update and draw current and next page
        updatePages(
            delta,
            distortedPointerPosition.current,
            isMouseDown.current,
        );

        // Update mouse targets
        updateMouseTargets();

        // Draw pages
        drawPages(asciiTarget.ctx, bgTarget.ctx);

        if (frameSkip.current % 1 === 0) {
            // every 2 frames
            asciiTarget.texture.needsUpdate = true;
            bgTarget.texture.needsUpdate = true;
        }
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

    const updatePages = (
        delta: number,
        mousePos: Vector2,
        isMouseDown: boolean,
    ) => {
        // Update current page
        currentPage?.update(
            delta,
            mousePos,
            !nextPage ? scrollDelta.current : 0,
            isMouseDown,
        );

        // Update next page if it exists
        nextPage?.update(delta, mousePos, scrollDelta.current, isMouseDown);

        // Update navigation
        nav?.update(0, 0);
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
