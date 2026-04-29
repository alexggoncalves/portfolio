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
    scrollSpeed: number = 2;
    pageHeight: number = 0;
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
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].update(delta, this.scrollOffset);
        }
    }

    updateInteractiveElements(
        mouseX: number,
        mouseY: number,
        isMouseDown: boolean,
    ) {
        let top: InteractiveElement | null = null;

        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];

            // Update draggable layer's state
            if (layer instanceof DraggableLayer) {
                layer.updateDragState(mouseX, mouseY, isMouseDown);
            }

            // Update interactive elements and find topmost hovered element
            for (let j = 0; j < layer.interactiveElements.length; j++) {
                const element = layer.interactiveElements[j];

                if (element.contains(mouseX, mouseY)) {
                    if (!top || element.zIndex > top.zIndex) {
                        top = element;
                    }
                }
                element.isMouseOver = false;
            }
        }

        if (top && this.targetOpacity != 0) {
            top.isMouseOver = true;
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

        if (this.targetOpacity === 1 && this.opacity > 0.999) {
            this.opacity = 1;
        }

        if (this.targetOpacity === 0 && this.opacity < 0.001) {
            this.opacity = 0;

            if (this.onFadeOutComplete) {
                const callback = this.onFadeOutComplete;
                this.onFadeOutComplete = undefined;
                callback();
            }
        }
    }

    updateScroll(scrollDelta: number): void {
        // this.hoverDirty = true;

        // Constrain scroll offset to page height
        const max = Math.max(0, this.pageHeight - AsciiRenderConfig.gridSize.y);

        // Update scroll on page resize to maintain position
        if (this.pendingLayoutUpdate) {
            this.scrollOffset =
                max > 0 && this.lastMaxScroll > 0
                    ? (this.scrollOffset / this.lastMaxScroll) * max
                    : 0;
            this.lastMaxScroll = max;
            this.pendingLayoutUpdate = false;
        }

        // Update offset
        if (scrollDelta !== 0) {
            this.scrollOffset = clamp(
                this.scrollOffset + scrollDelta * this.scrollSpeed,
                0,
                max,
            );
            AppState.recordScroll(this.name, this.scrollOffset);
        }
    }

    resetFade(opacity = 0, target = 1, speed = 5) {
        this.opacity = opacity;
        this.targetOpacity = target;
        this.fadeSpeed = speed;
    }

    disableButtons(): void {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i].interactiveElements;

            for (let j = 0; j < layer.length; j++) {
                const element = this.layers[i].interactiveElements[j];
                element.active = false;
            }
        }
    }
    onResize() {}

    destroy(): void {
        // Clear hovered elements
        this.currentHoveredElement = null;
        this.hoveredLayer = null;

        // Destroy all layers
        this.layers.forEach((layer) => layer.destroy());
        this.layers = [];
        this.layers.length = 0;

        // Remove callbacks
        this.onFadeOutComplete = undefined;

        this.goTo = () => {};
    }
}
