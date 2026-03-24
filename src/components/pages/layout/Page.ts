import { Layer } from "./Layer";
import { Vector2 } from "three";
import { MathUtils } from "three";
import { clamp } from "three/src/math/MathUtils.js";
import useAsciiStore from "../../../stores/asciiStore";
import useSceneStore from "../../../stores/sceneStore";
import type { InteractiveElement } from "../../elements/InteractiveElement";

//----------------------------------
// PAGE CLASS
//----------------------------------

export class Page {
    name: string = "";
    layers: Layer[] = [];
    hoveredElements: InteractiveElement[] = [];
    hoveredLayer: Layer | null = null;

    // Transitions
    opacity: number = 0.0;
    targetOpacity: number = 1.0;
    fadeSpeed: number = 5;

    // Scroll
    scrollOffset: number = 0;
    pageHeight: number = 0;
    bottomScrollMargin: number = 0;
    readonly scrollDampingRange: number = 10;

    // Callbacks
    onFadeOutComplete?: () => void;
    goTo: (path: string) => void;

    // Flags
    isMobile: boolean;

    constructor(name: string, isMobile: boolean, goTo: (path: string) => void) {
        this.name = name;
        this.goTo = goTo;
        this.isMobile = isMobile;
    }

    update(delta: number, mousePos: Vector2, scrollDelta: number): void {
        this.updateScroll(scrollDelta);
        this.updateTransitions(delta);

        // Reset hovered elements array
        this.hoveredElements = [];

        // Update all page layers
        this.layers.forEach((layer: Layer) => {
            // Update layer
            layer.update(delta, this.scrollOffset);

            // Update hovered elements array
            layer.interactiveElements.forEach((element: InteractiveElement) => {
                if (element.contains(mousePos))
                    this.hoveredElements.push(element);
            });
        });
    }

    draw(asciiCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D) {
        // Draw layer
        this.layers.forEach((layer: Layer) => {
            layer.draw(asciiCtx, bgCtx, this.opacity);
        });
    }

    protected setPageHeight(height: number) {
        this.pageHeight = height;
    }

    updateTransitions(delta: number): void {
        // Set faster speed for fade out
        const speed =
            this.targetOpacity === 0 ? this.fadeSpeed * 2 : this.fadeSpeed;

        // Lerp opacity for transitions
        this.opacity = MathUtils.damp(
            this.opacity,
            this.targetOpacity,
            speed,
            delta,
        );

        // Trigger the fade out completion event
        // (to destroy the fading out page)
        if (
            this.targetOpacity === 0 &&
            this.opacity <= 0.003 &&
            this.onFadeOutComplete
        ) {
            const callback = this.onFadeOutComplete;
            this.onFadeOutComplete = undefined; // prevent multiple calls
            callback();
        }
    }

    updateScroll(scrollDelta: number): void {
        const gridSize = useAsciiStore.getState().gridSize;

        // Get max scroll
        const max = Math.max(0, this.pageHeight - gridSize.y);

        if (max <= 0) {
            this.scrollOffset = 0;
            return;
        }

        const offset = this.scrollOffset;
        const distanceFromBottom = max - offset;

        const dampingRange = Math.min(this.scrollDampingRange, max * 0.15);
        let dampingMultiplier = 1.0;

        if (offset < dampingRange && scrollDelta < 0) {
            dampingMultiplier = offset / dampingRange;
        } else if (distanceFromBottom < dampingRange && scrollDelta > 0) {
            dampingMultiplier = distanceFromBottom / dampingRange;
        }

        // Apply the scroll delta with damping
        const speedScale = 1.4;
        const move = scrollDelta * dampingMultiplier * speedScale;

        // Only apply scroll if it's significant
        if (Math.abs(move) > 0.01) {
            this.scrollOffset = clamp(this.scrollOffset + move, 0, max);
        }

        // Update store
        const state = useSceneStore.getState();
        if (state.pageScrolls[this.name] !== this.scrollOffset) {
            state.setScroll(this.name, this.scrollOffset);
        }
    }

    resetFade(opacity = 0, target = 1, speed = 5) {
        this.opacity = opacity;
        this.targetOpacity = target;
        this.fadeSpeed = speed;
    }

    disableButtons(): void {
        this.layers.forEach((layer) => {
            layer.interactiveElements.forEach((element) => {
                element.active = false;
            });
        });
    }

    resetHoverStates() {
        this.layers.forEach((layer) => {
            layer.interactiveElements.forEach((element) => {
                element.isMouseOver = false;
            });
        });
    }
}
