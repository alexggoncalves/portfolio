import { Layer } from "./Layer";
import { Vector2 } from "three";
import { MathUtils } from "three";
import { clamp } from "three/src/math/MathUtils.js";
import useAsciiStore from "../../stores/asciiStore";

//----------------------------------
// PAGE CLASS
//----------------------------------

export class Page {
    name: string = "";
    layers: Layer[] = [];

    // Transitions
    opacity: number = 0.0;
    targetOpacity: number = 1.0;
    fadeSpeed: number = 5;

    // Scroll
    scrollOffset: number = 0;
    pageHeight: number = 0;
    bottomScrollMargin: number = 0;
    readonly scrollDampingRange: number = 10;

    onFadeOutComplete?: () => void;

    constructor(name: string) {
        this.name = name;
    }

    update(
        ui: CanvasRenderingContext2D,
        background: CanvasRenderingContext2D,
        delta: number,
        mousePos: Vector2,
        scrollDelta: number,
        // _mouseDown?: boolean
    ): void {
        this.setCurrentScroll(scrollDelta);
        this.updateTransitions(delta);

        // Update and draw all page layers
        this.layers.forEach((layer: Layer) => {
            layer.update(
                ui,
                background,
                delta,
                mousePos,
                this.opacity,
                this.scrollOffset,
            );
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

    setCurrentScroll(scrollDelta: number): void {
        if (!scrollDelta) return;
        const gridSize = useAsciiStore.getState().gridSize;
        // Get max scroll
        const max = this.pageHeight - gridSize.y;

        const offset = this.scrollOffset;
        const distanceFromBottom = max - offset;

        const dampingRange = Math.min(this.scrollDampingRange, max * 0.15);
        let dampingMultiplier = 0.9;
        // Apply damping when scrolling near the top
        if (offset < dampingRange && scrollDelta < 0) {
           dampingMultiplier *= offset / dampingRange;
        }

        // Apply damping when scrolling near the bottom
        if (distanceFromBottom < dampingRange && scrollDelta > 0) {
            dampingMultiplier *= distanceFromBottom / dampingRange;
        }

        // Apply the scroll delta with damping
        const speedScale = clamp(Math.sqrt(max / gridSize.y), 1, 2);
        this.scrollOffset += scrollDelta * dampingMultiplier * speedScale;

        // Clamp the scroll offset between limits
        this.scrollOffset = clamp(this.scrollOffset, 0, max);
    }

    resetFade(opacity = 0, target = 1, speed = 5) {
        this.opacity = opacity;
        this.targetOpacity = target;
        this.fadeSpeed = speed;
    }

    destroy(): void {
        this.layers.forEach((layer: Layer) => {
            layer.destroy();
        });
    }
}
