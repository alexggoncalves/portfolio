import { Layer } from "./Layer";
import { MathUtils } from "three";
import { clamp } from "three/src/math/MathUtils.js";
import type { InteractiveElement } from "./InteractiveElement";
import { AsciiRenderConfig } from "../../app/AsciiRenderConfig";
import { AppState } from "../../app/AppState";
import { DraggableLayer } from "./DraggableLayer";

//----------------------------------
// PAGE CLASS
//----------------------------------

export class Page {
    name: string = "";
    layers: Layer[] = [];

    currentHoveredElement: InteractiveElement | null = null;
    hoveredLayer: Layer | null = null;

    // Transitions
    opacity: number = 0.0;
    targetOpacity: number = 1.0;
    fadeSpeed: number = 5;

    // Scroll
    scrollOffset: number = 0;
    pageHeight: number = 0;
    bottomScrollMargin: number = 0;
    scrollDampingRange: number = 10;
    lastMaxScroll: number = 0;

    lastMouseX = -1;
    lastMouseY = -1;
    hoverDirty = true;

    // Callbacks
    onFadeOutComplete?: () => void;
    goTo: (path: string) => void;

    // Flags
    pendingLayoutUpdate: boolean = false;

    constructor(name: string, goTo: (path: string) => void) {
        this.name = name;
        this.goTo = goTo;
    }

    update(
        delta: number,
        mouseX: number,
        mouseY: number,
        scrollDelta: number,
        isMouseDown: boolean,
    ): void {
        this.updateTransitions(delta);
        this.updateScroll(scrollDelta);

        if (this.hoverDirty) {
            this.updateInteractiveElements(mouseX, mouseY, isMouseDown);
        }

        // Update all page layers
        this.layers.forEach((layer: Layer) => {
            layer.update(delta, this.scrollOffset);
        });
    }

    updateInteractiveElements(
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ) {
        let top: InteractiveElement | null = null;

        for (const layer of this.layers) {
            // Update worksRow dragging state
            if (layer instanceof DraggableLayer) {
                layer.updateDragState(mouseX, mouseY, isMouseDown);
            }

            for (const element of layer.interactiveElements) {
                // if (!element.active) continue;

                if (element.contains(mouseX, mouseY)) {
                    if (!top || element.zIndex > top.zIndex) {
                        top = element;
                    }
                }
            }
        }

        // Reset hover state
        for (const layer of this.layers) {
            const list = layer.interactiveElements;
            for (let i = 0; i < list.length; i++) {
                list[i].isMouseOver = false;
            }
        }

        if (top && this.targetOpacity != 0) {
            this.currentHoveredElement = top;
        } else {
            this.currentHoveredElement = null;
        }
    }

    draw(asciiCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D) {
        // Draw layer
        asciiCtx.save();
        bgCtx.save();

        bgCtx.globalAlpha = this.opacity;
        asciiCtx.globalAlpha = this.opacity;

        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].draw(asciiCtx, bgCtx, this.opacity);
        }

        asciiCtx.restore();
        bgCtx.restore();
    }

    protected setPageHeight(height: number) {
        this.pageHeight = height;
        this.pendingLayoutUpdate = true;
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

        if(this.targetOpacity === 0 && this.opacity < 0.001){
            this.opacity = 0;
        }

        if(this.targetOpacity === 1 && this.opacity > 0.999){
            this.opacity = 1;
        }

        // Trigger the fade out completion event
        // (to destroy the fading out page)
        if (
            this.targetOpacity === 0 &&
            this.opacity <= 0.01 &&
            this.onFadeOutComplete
        ) {
            const callback = this.onFadeOutComplete;
            this.onFadeOutComplete = undefined; // prevent multiple calls
            callback();
        }


    }

    updateScroll(scrollDelta: number): void {
        if (scrollDelta === 0) return;
        this.hoverDirty = true;

        // Get max scroll
        const max = Math.max(0, this.pageHeight - AsciiRenderConfig.gridSize.y);

        if (this.pendingLayoutUpdate) {
            if (this.lastMaxScroll > 0) {
                const ratio = this.scrollOffset / this.lastMaxScroll;
                this.scrollOffset = ratio * max;
            }

            this.lastMaxScroll = max;
            this.pendingLayoutUpdate = false;
        }

        if (max <= 0) {
            this.scrollOffset = 0;
            return;
        }

        // Only apply scroll if it's significant
        if (Math.abs(scrollDelta) > 0.01) {
            this.scrollOffset = clamp(this.scrollOffset + scrollDelta, 0, max);
        }

        // Update pageScrolls
        if (AppState.pageScrolls[this.name] !== this.scrollOffset) {
            AppState.recordScroll(this.name, this.scrollOffset);
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
    onResize() {}

    destroy(): void {
        // Destroy all layers
        this.layers.forEach((layer) => layer.destroy());
        this.layers = [];

        // Clear arrays to release references
        this.currentHoveredElement = null;
        this.hoveredLayer = null;

        // Remove callbacks
        this.onFadeOutComplete = undefined;

        this.goTo = undefined as any;
    }
}
