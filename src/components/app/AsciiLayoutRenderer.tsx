import { CanvasTexture, Vector2 } from "three";
import { useFrame } from "@react-three/fiber";

// import useScroll from "../../hooks/useScroll";
import useInput from "../../hooks/useInput";
import { getDistortedPosition } from "../../utils/getDistortedPosition";
import { useRef } from "react";
import { AsciiRenderConfig } from "./AsciiRenderConfig";
import { type Page } from "../elements/core/Page";
import type { Navigation } from "../elements/ui/Navigation";
import type { CanvasSize } from "../../hooks/useAsciiRenderTargets";
import { InteractiveElement } from "../elements/core/InteractiveElement";

function AsciiLayoutRenderer({
    currentPage,
    nextPage,
    nav,
    size,
    asciiRenderTarget,
    backgroundRenderTarget,
}: {
    currentPage: React.RefObject<Page | null>;
    nextPage: React.RefObject<Page | null>;
    nav: React.RefObject<Navigation | null>;
    size: React.RefObject<CanvasSize>;
    asciiRenderTarget: React.RefObject<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>;
    backgroundRenderTarget: React.RefObject<{
        texture: CanvasTexture | null;
        context: CanvasRenderingContext2D | null;
    }>;
}) {
    const prevSize = useRef({ width: 0, height: 0 });

    // Mouse event managers
    const {
        scrollVelocity,
        pointerPosition,
        isPointerDown,
        updateCursor,
        setClickTarget,
    } = useInput();

    const lastMouse = useRef(new Vector2(-1, -1));
    const mouseDirty = useRef(true);

    const topHoveredElement = useRef<InteractiveElement | null>(null);

    // Mouse position with distortion applied
    const distortedPointerPosition = useRef<Vector2>(new Vector2(0));

    // Update and render pages (->layers->elements)
    useFrame((_state, delta) => {
        const mouseMoved =
            Math.abs(lastMouse.current.x - pointerPosition.current.x) > 0.001 ||
            Math.abs(lastMouse.current.y - pointerPosition.current.y) > 0.001;

        if (mouseMoved) {
            mouseDirty.current = true;
            lastMouse.current.copy(pointerPosition.current);
        }

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

        const asciiCtx = asciiRenderTarget.current?.context;
        const asciiTexture = asciiRenderTarget.current?.texture;
        const bgCtx = backgroundRenderTarget.current?.context;
        const bgTexture = backgroundRenderTarget.current?.texture;

        if (!asciiCtx || !asciiTexture || !bgCtx || !bgTexture) return;

        // Clear Render Targets
        clearRenderTargets(asciiCtx, bgCtx, AsciiRenderConfig.bgColor);

        // Map the mouse or touch position to fit the applied lens distortion
        if (mouseDirty.current) {
            getDistortedPosition(
                pointerPosition.current,
                size.current,
                AsciiRenderConfig.distortion,
                AsciiRenderConfig.focalLength,
                distortedPointerPosition.current,
            );
        }

        // Update and draw current and next page
        updatePages(
            delta,
            distortedPointerPosition.current.x,
            distortedPointerPosition.current.y,
            isPointerDown.current,
        );

        if (mouseDirty.current) {
            // Update mouse targets
            updateMouseTargets();
            updateCursor();
        }

        // Draw pages
        drawPages(asciiCtx, bgCtx);

        asciiTexture.needsUpdate = true;
        bgTexture.needsUpdate = true;

        mouseDirty.current = false;
    }, 0);

    const clearRenderTargets = (
        uiContext: CanvasRenderingContext2D,
        bgContext: CanvasRenderingContext2D,
        color: string,
    ) => {
        uiContext.clearRect(0, 0, size.current.width, size.current.height);

        bgContext.fillStyle = color;
        bgContext.fillRect(0, 0, size.current.width, size.current.height);
    };

    const updatePages = (
        delta: number,
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ) => {
        const isTransitioning = !!nextPage.current;

        // console.log(currentPage.current)

        // Update current page
        currentPage.current?.update(
            delta,
            mouseX,
            mouseY,
            isTransitioning ? 0 : scrollVelocity.current,
            isMouseDown,
        );

        // Update next page if transition is happening
        if (isTransitioning) {
            nextPage.current?.update(
                delta,
                mouseX,
                mouseY,
                isTransitioning ? scrollVelocity.current : 0,
                isMouseDown,
            );
        }

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
        topHoveredElement.current =
            nav.current?.hoveredElement ?? // Nav on top
            nextPage.current?.currentHoveredElement ??
            currentPage.current?.currentHoveredElement ??
            null;

        // Apply hover to topmost element
        if (topHoveredElement.current) {
            setClickTarget(topHoveredElement.current);
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
